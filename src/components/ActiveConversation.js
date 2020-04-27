import React from 'react';
import { Container, Button, Spinner, DropdownButton, Row, Col } from 'react-bootstrap';
import { joinMeeting } from './../chime/handlers';
import OutputDevices from './OutputDevices';
import InputDevices from './InputDevices';
import AudioControl from './AudioControl';
import Chat from './Chat';


import { Mp3MediaRecorder } from 'mp3-mediarecorder';
import mp3RecorderWorker from 'workerize-loader!./RecorderWorker';  // eslint-disable-line import/no-webpack-loader-syntax
import { Storage } from 'aws-amplify';

class ActiveConversation extends React.Component {

    constructor(props) {
        super(props);

        this.exitConversation = this.exitConversation.bind(this);
        this.pushMeetingRecording = this.pushMeetingRecording.bind(this);
        this.enableAudio = this.enableAudio.bind(this);
        this.muteOrUnmute = this.muteOrUnmute.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.restartMediaRecorder = this.restartMediaRecorder.bind(this);

        this.state = {
            isMeetingLoading: true,
            onConversationExited: this.props.onConversationExited,
            isAudioEnabled: false,
            isMuted: false
        }

        this.recorderWorker = mp3RecorderWorker();
        this.mediaRecorder = null;

        this.joinChimeMeeting();
    }

    // this will be called when the component is un-rendered, eg. the user has chosen to leave the meeting
    componentWillUnmount() {
        if(this.mediaRecorder) {
            this.mediaRecorder.onstop = {};
            this.mediaRecorder.audioContext.close();
            this.mediaRecorder.stop();
        }
        this.leaveChimeMeeting();
    }

    async joinChimeMeeting() {
        this.setState({
            isMeetingLoading: true
        })
        // call getOrCreateMeeting lambda (or service), get the necessary parameters, use chime SDK to connect to meeting, finally set isMeetingLoading: false
        console.log(this.props.conversation.meetingID);
        //TODO take desiredMeetingId from activeConversation after DB is ready
        this.meetingSession = await joinMeeting(this.props.conversation.id, this.props.conversation.meetingID);
        await new Promise(r => setTimeout(r, 2000));
        this.setState({
            isMeetingLoading: false
        })
    }

    leaveChimeMeeting() {
        console.log("Left chime meeting");
    }

    exitConversation() {
        this.meetingSession.audioVideo.stop();
        this.state.onConversationExited();
    }

    loadingScreen() {
        return (
            <Container>
                <Spinner animation="grow" size="lg"/>
                <h4>Joining meeting...</h4>
            </Container>
        );
    }

    async listAudioDevices() {
        try {
            console.log(this.meetingSession);
            const audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
            const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();

            // An array of MediaDeviceInfo objects
            audioInputDevices.forEach(mediaDeviceInfo => {
            console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
            });
            audioOutputDevices.forEach(mediaDeviceInfo => {
                console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
            });
            const devices = {
                input: audioInputDevices,
                output: audioOutputDevices
            }

            const observer = {
                audioInputsChanged: freshAudioInputDeviceList => {
                  // An array of MediaDeviceInfo objects
                  freshAudioInputDeviceList.forEach(mediaDeviceInfo => {
                    console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
                  });
                },
                audioOutputsChanged: freshAudioOutputDeviceList => {
                  console.log('Audio outputs updated: ', freshAudioOutputDeviceList);
                },
                videoInputsChanged: freshVideoInputDeviceList => {
                  console.log('Video inputs updated: ', freshVideoInputDeviceList);
                }
              };
              
              this.meetingSession.audioVideo.addDeviceChangeObserver(observer);
            return devices;
        }
        catch(err){
            console.error(err);
        }
    }

    async chooseAudioDevice() {
        try {
            const devices = await this.listAudioDevices();
            //chose the first ones by default for now
            const audioInputDeviceInfo = devices.input;
            const inputDeviceId = audioInputDeviceInfo[0].deviceId;
            console.log('Input audio device: ', audioInputDeviceInfo[0]);
            await this.meetingSession.audioVideo.chooseAudioInputDevice(inputDeviceId);
            const audioOutputDeviceInfo = devices.output;
            const outputDeviceId = audioOutputDeviceInfo[0].deviceId;
            console.log('Ouput audio device: ', audioOutputDeviceInfo[0]);
            await this.meetingSession.audioVideo.chooseAudioOutputDevice(outputDeviceId);
        }
        catch(err) {
            console.error(err);
        }
    }

    async pushMeetingRecording(e) {
        let blob = e.data;
        if(blob.size > 100 * 1024) {
            Storage.put(`audioin/${this.props.conversation.id}.mp3`, blob)
            .then (result => console.log(result))
            .catch(err => console.log(err));
        }
    }

    async startRecording() {
        let audioElement = document.getElementById('meeting-audio');
        let audioStream = audioElement.captureStream ? audioElement.captureStream() : audioElement.mozCaptureStream();

        let userMediaStream;
        try {
            userMediaStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        } catch(err) {
            userMediaStream = await navigator.mediaDevices.getUserMedia({audio: true});
        }

        for(let userTrack of userMediaStream.getTracks()) {
            audioStream.addTrack(userTrack);
        }

        let mediaRecorder = new Mp3MediaRecorder(audioStream, { 
            worker: this.recorderWorker,
            audioContext: new AudioContext()
         });

        // mediaRecorder.ondataavailable = (e) => {
        //     this.pushMeetingRecording(e);
        // }

        mediaRecorder.onstart = () => {
            setInterval(() => {
                console.log(`MediaRecorder state: ${this.mediaRecorder.state}`);
                this.restartMediaRecorder();
            }, 60 * 1000)
        }

        mediaRecorder.onerror = (e) => {
            console.error(`MediaRecorder error: ${JSON.stringify(e)}`);
        }

        while(mediaRecorder.state === 'inactive') {
            mediaRecorder.start(); // attempt to start the media recorder - might take several tries due to a race condition bug inside the recorder's worker
            await this.sleep(1000);
        }

        this.mediaRecorder = mediaRecorder;
    }

    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }   

    async restartMediaRecorder() { // stops and restarts the media recorder forcing it to emit the recording
        if(this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.onstop = () => {
                this.mediaRecorder.onstop = () => {};
                this.sleep(1000).then(() => {
                    this.mediaRecorder.start();
                }); //allow media recorder some time to stop properly
            };

            this.mediaRecorder.ondataavailable = (e) => { // ensures we only get data when we need it
                this.pushMeetingRecording(e);
                this.mediaRecorder.ondataavailable = {};
            }
            this.mediaRecorder.stop();
        }
    }

    enableAudio() {
        try {
            const audioElement = document.getElementById('meeting-audio');
            this.setState({
                isAudioEnabled: true
            });
            this.meetingSession.audioVideo.bindAudioElement(audioElement);
            
            let observer = {
              audioVideoDidStart: () => {
                this.startRecording();
              }
            };

            observer.audioVideoDidStart = observer.audioVideoDidStart.bind(this);
            
            this.meetingSession.audioVideo.addObserver(observer);
            
            this.meetingSession.audioVideo.start();

            console.log("Audio has started");

        }
        catch(err) {
            console.error(err);
        }
    }   

    muteOrUnmute() {
        try {
            // Mute
            if(this.state.isMuted) {
                const unmuted = this.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
                if (unmuted) {
                    console.log('Unmuted');
                    this.setState({
                        isMuted: false
                    });
                } 
            // Unmute
            } else {
                this.meetingSession.audioVideo.realtimeMuteLocalAudio();
                console.log('Muted');
                this.setState({
                    isMuted: true
                });
            }

        }
        catch(err) {
            console.error(err);
        }
    }

    render() {
        if(this.state.isMeetingLoading) {
            return this.loadingScreen();
        } else {
            this.chooseAudioDevice();
            return (

                <Container fluid>
                    <p>{`Joined meeting: ${this.props.conversation.name}`}</p>
                    <Row>
                        <Chat
                        roomId={this.props.conversation.id}
                        />
                    </Row>
                    <Row>
                        <AudioControl
                            isMuted={this.state.isMuted} 
                            isAudioEnabled={this.state.isAudioEnabled}
                            enableAudio={this.enableAudio}
                            muteOrUnmute={this.muteOrUnmute}
                        />
                        <Button variant="danger" size="lg" block onClick={this.exitConversation}>Exit conversation</Button>
                        <audio id="meeting-audio" ></audio>
                    </Row>
                </Container>
            )

        }
    }
}

export default ActiveConversation;