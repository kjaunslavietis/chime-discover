import React from 'react';
import { Container, Button, Spinner, Row, Col } from 'react-bootstrap';
import { joinMeeting } from './../chime/handlers';
import AudioControl from './AudioControl';
import AttendeesList from './AttendeesList';

import Chat from './Chat';

import { Mp3MediaRecorder } from 'mp3-mediarecorder';
import mp3RecorderWorker from 'workerize-loader!./RecorderWorker';  // eslint-disable-line import/no-webpack-loader-syntax
import { Storage, Auth } from 'aws-amplify';

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
        this.mediaRecorder = null;
        this.MS_BETWEEN_RECORDINGS = 1000 * 60 * 1; // 1 minute

        this.joinChimeMeeting();
        this.getUser()
    }

    getUser() {
        Auth.currentAuthenticatedUser({
          bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then(user => {
          this.userName = user.username;
        })
        .catch(err => console.log("Not logged in"));
      }

    // this will be called when the component is un-rendered, eg. the user has chosen to leave the meeting
    componentWillUnmount() {
        this.killRecorderForGood();
        if(this.state.isAudioEnabled){
            this.meetingSession.audioVideo.stop();
        }
        this.leaveChimeMeeting();
    }

    componentDidMount() {
        this.enableAudio();
    }

    // on switching the meeting
    componentDidUpdate(prevProps) {
        if(prevProps.conversation.id !== this.props.conversation.id) {
            console.log("Switching the room");
            this.setState({
                isAudioEnabled: false,
                isMuted: false
            });
            this.killRecorderForGood();
            if(this.state.isAudioEnabled){
                this.meetingSession.audioVideo.stop();
            }
            this.leaveChimeMeeting();
            this.joinChimeMeeting();
        }
    }

    killRecorderForGood() {
        if(this.mediaRecorder && this.mediaRecorder.state==='recording') {
            if(this.recorderInterval) {
                clearInterval(this.recorderInterval);
            }
            this.mediaRecorder.onstop = {};
            this.mediaRecorder.audioContext.close();
            this.mediaRecorder.stop();    
        }
    }

    async joinChimeMeeting() {
        this.setState({
            isMeetingLoading: true
        })
        // call getOrCreateMeeting lambda (or service), get the necessary parameters, use chime SDK to connect to meeting, finally set isMeetingLoading: false
        console.log("MEETING ID: ", this.props.conversation.meetingID);
        console.log("ROOM ID: ", this.props.conversation.id);
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
            const audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
            const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();

            // An array of MediaDeviceInfo objects
            // Might be needed to change the device

            /*
            audioInputDevices.forEach(mediaDeviceInfo => {
            console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
            });
            audioOutputDevices.forEach(mediaDeviceInfo => {
                console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
            });
            */
            
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
        let key = `audioin/${this.props.conversation.id}.mp3`;
        if(blob.size > 200 * 1024 && await this.checkShouldPush(key)) {
            Storage.put(key, blob)
            .then (result => console.log(result))
            .catch(err => console.log(err));
        }
    }

    async checkShouldPush(key) {
        let listResult = await Storage.list(key, {maxKeys: 1});
        if(listResult.length === 0) return true; // if there's no current recording, we should push ours
        
        let existingRecording = listResult[0];

        return Date.now() - Date.parse(existingRecording.lastModified) >= this.MS_BETWEEN_RECORDINGS;
    }

    async startRecording() {
        if(this.mediaRecorder) {
            return;
        }
        let audioElement = document.getElementById('meeting-audio');
        let audioStream = audioElement.captureStream ? audioElement.captureStream() : audioElement.mozCaptureStream();

        let userMediaStream = await this.meetingSession.audioVideo.deviceController.acquireAudioInputStream();

        for(let userTrack of userMediaStream.getTracks()) {
            audioStream.addTrack(userTrack);
        }

        this.mediaRecorder = new Mp3MediaRecorder(audioStream, { 
            worker: mp3RecorderWorker(),
            audioContext: new AudioContext()
            });

        this.mediaRecorder.onstart = () => {
            this.recorderInterval = 
                setInterval(() => {
                    console.log(`MediaRecorder state: ${this.mediaRecorder.state}`);
                    this.restartMediaRecorder();
                }, this.MS_BETWEEN_RECORDINGS);
        }

        this.mediaRecorder.onerror = (e) => {
            console.error(`MediaRecorder error: ${JSON.stringify(e)}`);
        }

        this.mediaRecorder.start();
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
            if (!this.state.isAudioEnabled) {
                const audioElement = document.getElementById('meeting-audio');
                this.setState({
                    isAudioEnabled: true
                });
                this.meetingSession.audioVideo.bindAudioElement(audioElement);
                
                let observer = {
                audioVideoDidStart: () => {
                    if(this.props.conversation.canBeAnalyzed) {
                        console.log("Conversation can be recorded, commencing recording...");
                        this.startRecording();
                    } else {
                        console.log("Creator has asked us to not record this room, so leave it alone");
                    }
                }
                };

                observer.audioVideoDidStart = observer.audioVideoDidStart.bind(this);
                
                this.meetingSession.audioVideo.addObserver(observer);
                
                this.meetingSession.audioVideo.start();

                console.log("Audio has started");
            }

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
        //TODO change to the user name later
        let randomUser = Math.random().toString(36).substring(7);
        if(this.state.isMeetingLoading) {
            return this.loadingScreen();
        } else {
            this.chooseAudioDevice();
            return (

                <Container>
                    <Row className='room-control'>
                        <Col className='room-title' sm={8}>
                            <h4>{`Joined meeting: ${this.props.conversation.name}`}</h4>
                        </Col>
                        <Col sm={2}>
                            <AudioControl
                                isMuted={this.state.isMuted} 
                                isAudioEnabled={this.state.isAudioEnabled}
                                enableAudio={this.enableAudio}
                                muteOrUnmute={this.muteOrUnmute}
                            />

                        </Col>
                        <Col sm={2}>
                            <Button variant="danger" size="md" block onClick={this.exitConversation}>Leave</Button>
                            <audio id="meeting-audio" ></audio>
                        </Col>
                    </Row>
                    <Row className="participants-number">
                        <Col>
                            <h5>{this.props.attendeesList.length} participants</h5>
                        </Col>
                    </Row>
                    <Row className='chat-participants'>
                        <Col className='chat-ui' sm={8}>
                            <Chat
                            // userName = {randomUser}
                            userName = {this.userName}
                            roomID = {this.props.conversation.id}
                            />
                        </Col>
                        <Col className='participants-ui' sm={4}>
                            <AttendeesList attendeesList={this.props.attendeesList}/>
                        </Col>
                    </Row>
                </Container>
            )

        }
    }
}

export default ActiveConversation;