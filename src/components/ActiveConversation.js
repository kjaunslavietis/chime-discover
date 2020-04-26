import React from 'react';
import { Container, Button, Spinner, DropdownButton } from 'react-bootstrap';
import { joinMeeting } from './../chime/handlers';
import { OutputDevices } from './OutputDevices.js';
import { InputDevices } from './InputDevices.js';

class ActiveConversation extends React.Component {
    constructor(props) {
        super(props);

        this.exitConversation = this.exitConversation.bind(this);
        this.enableAudio = this.enableAudio.bind(this);
        this.muteOrUnmute = this.muteOrUnmute.bind(this);
        this.state = {
            isMeetingLoading: true,
            onConversationExited: this.props.onConversationExited,
            isAudioEnabled: false,
            isMuted: false
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
        this.meetingSession = await joinMeeting(this.props.desiredMeetingId);
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

    enableAudio() {
        try {
            const audioElement = document.getElementById('meeting-audio');
            this.meetingSession.audioVideo.bindAudioElement(audioElement);
            
            const observer = {
              audioVideoDidStart: () => {
                console.log('Started');
              }
            };
            
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
                    })
                } 
            // Unmute
            } else {
                this.meetingSession.audioVideo.realtimeMuteLocalAudio();
                console.log('Muted');
                this.setState({
                    isMuted: true
                })
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
            //When audio is disabled, enable audio
            if(!this.state.isAudioEnabled) {
                this.setState({
                    isAudioEnabled: true
                })
                return (
                    <Container>
                        <p>{`Joined meeting: ${this.props.conversation.name}`}</p>
                        <Button variant="secondary" size="lg" block onClick={this.enableAudio}>Enable Audio</Button>
                        <Button variant="danger" size="lg" block onClick={this.exitConversation}>Exit conversation</Button>
                        <audio id="meeting-audio" ></audio>
                    </Container>
                )
            //when audio is enabled, mute or unmute
            }  else {
                //when is muted, unmute
                if(this.state.isMuted) {
                    return (
                        <Container>
                            <p>{`Joined meeting: ${this.props.conversation.name}`}</p>
                            <Button variant="secondary" size="lg" block onClick={this.muteOrUnmute}>Unmute</Button>
                            <Button variant="danger" size="lg" block onClick={this.exitConversation}>Exit conversation</Button>
                            <audio id="meeting-audio" ></audio>
                        </Container>
                    )
                //when unmuted, mute
                } else {
                    return (
                        // layout should be something like
                        // meeting controls on top
                        // active participants and their status (talking/not talking, muted/not muted) on the right
                        // chat in the middle / bottom
                        <Container>
                            
                            <p>{`Joined meeting: ${this.props.conversation.name}`}</p>
                            <Button variant="primary" size="lg" block onClick={this.muteOrUnmute}>Mute</Button>
                            <Button variant="danger" size="lg" block onClick={this.exitConversation}>Exit conversation</Button>
                            <audio id="meeting-audio" ></audio>
                        </Container>
                    )
                }
            }
        }
    }
}

export default ActiveConversation;