import React from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { joinMeeting } from './../chime/handlers';
import { Mp3MediaRecorder } from 'mp3-mediarecorder';
// import mp3RecorderWorker from 'workerize-loader!./RecorderWorker';  // eslint-disable-line import/no-webpack-loader-syntax

class ActiveConversation extends React.Component {

    constructor(props) {
        super(props);

        this.exitConversation = this.exitConversation.bind(this);
        this.enableAudio = this.enableAudio.bind(this);
        this.startRecording = this.startRecording.bind(this);

        this.mediaRecorder = null;
        
        this.state = {
            isMeetingLoading: true,
            onConversationExited: this.props.onConversationExited,
            meetingSession: null
        }

        this.joinChimeMeeting();
    }

    // this will be called when the component is un-rendered, eg. the user has chosen to leave the meeting
    componentWillUnmount() {
        this.leaveChimeMeeting();
    }

    async joinChimeMeeting() {
        this.setState({
            isMeetingLoading: true
        })
        // call getOrCreateMeeting lambda (or service), get the necessary parameters, use chime SDK to connect to meeting, finally set isMeetingLoading: false
        console.log(this.props.desiredMeetingId);
        //TODO take desiredMeetingId from activeConversation after DB is ready
        this.state.meetingSession = await joinMeeting(this.props.desiredMeetingId);
        this.setState({
            isMeetingLoading: false
        })
    }

    leaveChimeMeeting() {
        console.log("Left chime meeting");
    }

    exitConversation() {
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
            console.log(this.state.meetingSession);
            const audioInputDevices = await this.state.meetingSession.audioVideo.listAudioInputDevices();
            const audioOutputDevices = await this.state.meetingSession.audioVideo.listAudioOutputDevices();

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
              
              this.state.meetingSession.audioVideo.addDeviceChangeObserver(observer);
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
            await this.state.meetingSession.audioVideo.chooseAudioInputDevice(inputDeviceId);
            const audioOutputDeviceInfo = devices.output;
            const outputDeviceId = audioOutputDeviceInfo[0].deviceId;
            console.log('Ouput audio device: ', audioOutputDeviceInfo[0]);
            await this.state.meetingSession.audioVideo.chooseAudioOutputDevice(outputDeviceId);
        }
        catch(err) {
            console.error(err);
        }
    }

    async pushMeetingRecording(e) {
        let blob = e.data;

        let reader = new FileReader();
        reader.onload = function() {
            let dataUrl = reader.result;
            let base64 = dataUrl.split(',')[1];
            console.log(base64);
        };
        reader.readAsDataURL(blob);
    }

    async startRecording() {
        let audioStream = await window.navigator.mediaDevices.getUserMedia({ audio: true });
        // let mediaRecorder = new Mp3MediaRecorder(audioStream, { worker: mp3RecorderWorker() });
        let mediaRecorder = new Mp3MediaRecorder(audioStream, new Worker('./RecorderWorker.js'));

        mediaRecorder.ondataavailable = (e) => {
            this.pushMeetingRecording(e);
        }

        mediaRecorder.onstart = (e) => {
            console.log(`Media recorder started: ${JSON.stringify(e)}`);
            setTimeout(() => {
                mediaRecorder.stop();
                // mediaRecorder.start();
            }, 20 * 1000);
        }

        mediaRecorder.worker.onerror = (e) => {
            console.log(`MediaRecorder worker error: ${JSON.stringify(e)}`);
        }

        mediaRecorder.onerror = (e) => {
            console.log(`MediaRecorder error: ${JSON.stringify(e)}`);
        }

        mediaRecorder.start();

        this.mediaRecorder = mediaRecorder;

        setInterval(() => {
            console.log(`MediaRecorder state: ${this.mediaRecorder.state}`);
        }, 1000);
    }

    enableAudio() {
        try {
            let audioElement = document.getElementById('meeting-audio');
            this.state.meetingSession.audioVideo.bindAudioElement(audioElement);
            
            let observer = {
              audioVideoDidStart: () => {
                console.log('Started');

                this.startRecording().then((a, b) => console.log(`startRecording finished: ${JSON.stringify(a)}, ${JSON.stringify(b)}`));
              }
            };

            observer.audioVideoDidStart = observer.audioVideoDidStart.bind(this);
            
            this.state.meetingSession.audioVideo.addObserver(observer);
            
            this.state.meetingSession.audioVideo.start();
            console.log("Audio has started");

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
                // layout should be something like
                // meeting controls on top
                // active participants and their status (talking/not talking, muted/not muted) on the right
                // chat in the middle / bottom
                <Container>
                    
                    <p>{`Joined meeting: ${this.props.conversation.name}`}</p>
                    <Button variant="secondary" size="lg" block onClick={this.enableAudio}>Enable Audio</Button>
                    <Button variant="danger" size="lg" block onClick={this.exitConversation}>Exit conversation</Button>
                    <audio id="meeting-audio" ></audio>
                </Container>
            )
        }
    }
}

export default ActiveConversation;