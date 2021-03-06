import React from 'react';
import { API, graphqlOperation } from 'aws-amplify'
import { listMeetingAttendees} from './../graphql/queries'
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import AttendeesService from '../services/AttendeesService';
import Avatar from '@material-ui/core/Avatar';

import Chat from './Chat';
import { joinMeeting } from './../chime/handlers';
import AudioControl from './AudioControl';

import { MeetingSessionStatusCode } from 'amazon-chime-sdk-js';
import { Mp3MediaRecorder } from 'mp3-mediarecorder';
import mp3RecorderWorker from 'workerize-loader!./RecorderWorker';  // eslint-disable-line import/no-webpack-loader-syntax
import { Storage } from 'aws-amplify';

import './ActiveConversation.css';

const styles = theme => ({
    slider: {
      marginTop: '10px'
    },
  });
  

class ActiveConversation extends React.Component {

    constructor(props) {
        super(props);
        this.exitConversation = this.exitConversation.bind(this);
        this.pushMeetingRecording = this.pushMeetingRecording.bind(this);
        this.muteOrUnmute = this.muteOrUnmute.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.restartMediaRecorder = this.restartMediaRecorder.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.onAttendeeLeaves = this.onAttendeeLeaves.bind(this);
        this.onAttendeeJoins = this.onAttendeeJoins.bind(this);
        this.attendeesService = new AttendeesService(this.onAttendeeJoins, this.onAttendeeLeaves,
            this.props.conversation.id)
        
        this.state = {
            isMeetingLoading: true,
            onConversationExited: this.props.onConversationExited,
            isAudioEnabled: false,
            isMuted: false,
            attendeesList: [],
            meetingId: null, //update after joining the meeting
            volume: 50
        }
        this.mediaRecorder = null;
        this.MS_BETWEEN_RECORDINGS = 1000 * 60 * 1; // 1 minute

        this.joinChimeMeeting(this.props.conversation, this.props.userName);
    }

    // this will be called when the component is un-rendered, eg. the user has chosen to leave the meeting
    componentWillUnmount() {
        clearInterval(this.timer);
        this.killRecorderForGood();
        this.leaveChimeMeeting(this.props.conversation.id);  
    }

    componentDidUpdate(prevProps, prevState) {
        // on switching the meeting
        if(prevProps.conversation.id !== this.props.conversation.id) {
            console.log("Switching the room");
            this.setState({
                isAudioEnabled: false,
                isMuted: false,
            });
            this.killRecorderForGood();
            this.leaveChimeMeeting(prevProps.conversation.id);
            this.attendeesService.updateConversationId(this.props.conversation.id);
            //Join the new meeting
            this.joinChimeMeeting(this.props.conversation, this.props.userName);
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

    async removeAttendee(roomID, username) { 
        await this.attendeesService.makeAttendeeLeaveMeeting(username);
        let updatedAttendeesList = this.state.attendeesList.filter(function(e) {
            return e !== username
          })
        this.attendeesService.updateRoomAttendeesNames(roomID, updatedAttendeesList)
    }

    async addAttendee(roomID, username) {
        if (this.isAttendeeHere(this.state.attendeesList, username)) {
            return
        }
        await this.attendeesService.makeAttendeeJoinMeeting(username);
        let updatedAttendeesList = this.state.attendeesList;
        updatedAttendeesList.push(username)
        this.attendeesService.updateRoomAttendeesNames(roomID, updatedAttendeesList)
    }

    isAttendeeHere(attendees, username) {
        return attendees.indexOf(username) > -1;
    }

    onAttendeeJoins(attendeeName) {
        if (!attendeeName) {
            return
        }
        if (this.isAttendeeHere(this.state.attendeesList, attendeeName)) {
            return
        }
        console.log("Attendee joined: ", attendeeName);
        let updatedAttendeesList = this.state.attendeesList;
        updatedAttendeesList.push(attendeeName)
        updatedAttendeesList =  updatedAttendeesList.sort(this.sortByUsername)
        this.setState({
            attendeesList: updatedAttendeesList
        })
        
    }

    onAttendeeLeaves(attendeeName) {
        console.log("Attendee left: ", attendeeName);
        let updatedAttendeesList = this.state.attendeesList.filter(function(e) {
            return e !== attendeeName
          });
        this.setState({
            attendeesList: updatedAttendeesList
        })
        
    }

    async joinChimeMeeting(conversation, username) {
        // call getOrCreateMeeting lambda (or service), get the necessary parameters, use chime SDK to connect to meeting, finally set isMeetingLoading: false
        console.log("ROOM ID: ", conversation.id);
        const meetingSessions = await joinMeeting(conversation.id, conversation.meetingID, username);
        console.log(meetingSessions);
        this.meetingSession = meetingSessions.meeting;
        console.log('MEETING ID: ', meetingSessions.meetingId);
        await new Promise(r => setTimeout(r, 2000));
        this.setState({
            meetingId: meetingSessions.meetingId
        });
        this.chooseAudioDevice();
        let attendees = await this.attendeesService.gettAttendees();
        this.setState({
            isMeetingLoading: false,
            attendeesList: attendees

        });
        this.attendeesService.subscribe();
        this.addAttendee(conversation.id, username);
        await new Promise(r => setTimeout(r, 1000));
        this.enableAudio();
    }

    leaveChimeMeeting(roomID) {
        console.log("Stopping the audio");
        this.meetingSession.audioVideo.chooseAudioInputDevice(null); //red circle should disappear after this line
        try {
            this.meetingSession.audioVideo.stop();
            this.meetingSession.audioVideo.unbindAudioElement();
        } catch(err) {
            console.error(err);
        }
        if (this.audioVideoObserver) {
            this.meetingSession.audioVideo.removeDeviceChangeObserver(this.audioVideoObserver);
            console.log('AudioVideo observer removed');
        }
        if (this.deviceChangeObserver) {
            this.meetingSession.audioVideo.removeObserver(this.deviceChangeObserver);
            console.log('DeviceChange observer removed');
        }
        this.attendeesService.unsubscribe()
        this.removeAttendee(roomID, this.props.userName);
        console.log("Left chime meeting");
        
    }

    exitConversation() {
        this.state.onConversationExited();
    }

    loadingScreen() {
        return (
            <Container maxWidth="sm">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                    <CircularProgress />
                    <Typography style={{ paddingLeft: "20px" }} variant="h5">Joining meeting...</Typography>
                </div>
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

            this.deviceChangeObserver = {
                audioInputsChanged: freshAudioInputDeviceList => {
                  // An array of MediaDeviceInfo objects
                  freshAudioInputDeviceList.forEach(mediaDeviceInfo => {
                    // console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
                  });
                },
                audioOutputsChanged: freshAudioOutputDeviceList => {
                //   console.log('Audio outputs updated: ', freshAudioOutputDeviceList);
                },
                videoInputsChanged: freshVideoInputDeviceList => {
                //   console.log('Video inputs updated: ', freshVideoInputDeviceList);
                }
              };
              
              this.meetingSession.audioVideo.addDeviceChangeObserver(this.deviceChangeObserver);
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
            // console.log('Input audio device: ', audioInputDeviceInfo[0]);
            await this.meetingSession.audioVideo.chooseAudioInputDevice(inputDeviceId);
            const audioOutputDeviceInfo = devices.output;
            const outputDeviceId = audioOutputDeviceInfo[0].deviceId;
            // console.log('Ouput audio device: ', audioOutputDeviceInfo[0]);
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

    async enableAudio() {
        try {
            if (!this.state.isAudioEnabled) {
                const audioElement = document.getElementById('meeting-audio');
                this.meetingSession.audioVideo.bindAudioElement(audioElement);
                
                this.audioVideoObserver = {
                    audioVideoDidStart: () => {
                        if(this.props.conversation.canBeAnalyzed) {
                            console.log("Conversation can be recorded, commencing recording...");
                            this.startRecording();
                        } else {
                            console.log("Creator has asked us to not record this room, so leave it alone");
                        }
                    },
                    audioVideoDidStop: sessionStatus => {
                        const sessionStatusCode = sessionStatus.statusCode();
                        // See the "Stopping a session" section for details
                        console.log("Status code: ", sessionStatusCode);
                        if (sessionStatusCode === MeetingSessionStatusCode.Left) {
                            /*
                              - You called meetingSession.audioVideo.stop().
                              - When closing a browser window or page, Chime SDK attempts to leave the session.
                            */

                            console.log('You left the session');
                        } else {
                            console.log('Stopped with a session status code: ', sessionStatusCode);
                        }
                    },
                    audioVideoDidStartConnecting: reconnecting => {
                        if (reconnecting) {
                          // e.g. the WiFi connection is dropped.
                          console.log('Attempting to reconnect');
                        }
                    }              
                };

                this.audioVideoObserver.audioVideoDidStart = this.audioVideoObserver.audioVideoDidStart.bind(this);
                
                this.meetingSession.audioVideo.addObserver(this.audioVideoObserver);
                
                this.meetingSession.audioVideo.start();
                
                this.setState({
                    isAudioEnabled: true
                });

                console.log("Audio has started");
                audioElement.volume = 0.5;
            }

        }
        catch(err) {
            console.error(err);
        }
    }   

    muteOrUnmute() {
        console.log("Trying to unmute/mute");
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
    sortByUsername(x,y) 
    {
     if (x.ExternalUserId < y.ExternalUserId)
       return -1;
     if (x.ExternalUserId > y.ExternalUserId)
       return 1;
     return 0;
    }

    handleVolumeChange(event, newValue) {
        const audioElement = document.getElementById('meeting-audio');
        audioElement.volume = newValue/100.0;
        this.setState({
            volume: newValue
        });
    }

    render() {
        const { classes } = this.props;
        if (this.state.isMeetingLoading) {
            return this.loadingScreen();
        } else {
            return (
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "30px" }}>
                    <div style={{ display: "flex", flexDirection: "column", flex: '1', marginRight: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            {`You're in ${this.props.conversation.name}`}
                        </Typography>
                        <Divider />
                        <Chat
                            userName = {this.props.userName}
                            roomID = {this.props.conversation.id}
                        />
                    </div>
                    <audio id="meeting-audio"></audio>

                    <div style={{ display: "flex", flexDirection: "column", minWidth: "300px" }}>
                        <div style={{ minWidth: '300px', display: "flex", flexDirection:"row", justifyContent: "center", padding:"10px"}}>
                            <div style={{minWidth:"200px", marginLeft: "5px"}}>
                                        <Grid container spacing={2} className={classes.slider}>
                                            <Grid item>
                                                <VolumeDown />
                                            </Grid>
                                            <Grid item xs>
                                                <Slider value={this.state.volume} onChange={this.handleVolumeChange} aria-labelledby="continuous-slider" />
                                            </Grid>
                                            <Grid item>
                                                <VolumeUp />
                                            </Grid>
                                        </Grid>
                            </div>
                            <div style={{marginLeft: "20px", padding:"8px"}}>
                                <AudioControl
                                    isMuted={this.state.isMuted} 
                                    muteOrUnmute={this.muteOrUnmute}
                                />
                                </div>
                            <div style={{marginLeft: "5px", padding:"8px"}}>
                                    <Fab size="medium" color="secondary" onClick={this.exitConversation}>
                                        <CallEnd />
                                    </Fab>
                            </div>
                        </div>
                        <div style={{ minHeight: '650px', minWidth: '300px'}}>
                            <List subheader={<ListSubheader disableSticky>Room Participants ({this.state.attendeesList ? this.state.attendeesList.length : 0})</ListSubheader>} style={{maxHeight: '70vh', overflow: 'auto'}}>
                                {this.state.attendeesList.map((value, key) => {
                                    const labelId = `checkbox-list-secondary-label-${key}`;
                                    return (
                                    <React.Fragment>
                                        <ListItem key={key} button>
                                            <ListItemAvatar>
                                            <Avatar
                                                alt={`Avatar n°${key + 1}`}
                                                src={key%2 === 0 ? "https://randomuser.me/api/portraits/men/" + key + ".jpg" 
                                                : "https://randomuser.me/api/portraits/women/" + key + ".jpg"}
                                            />
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primary={value} />
                                        </ListItem>
                                        <Divider variant="inset" />
                                    </React.Fragment>
                                    );
                                })}
                            </List>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

const mock = {
    first_name: ['Aaliyah', 'Aaron', 'Abagail', 'Abbey', 'Abbie', 'Abbigail', 'Abby', 'Abdiel', 'Abdul', 'Abdullah', 'Abe', 'Abel', 'Abelardo', 'Abigail', 'Abigale', 'Abigayle', 'Abner', 'Abraham', 'Ada', 'Adah', 'Adalberto', 'Adaline', 'Adam', 'Adan', 'Addie', 'Addison', 'Adela', 'Adelbert', 'Adele', 'Adelia', 'Adeline', 'Adell', 'Adella', 'Adelle', 'Aditya', 'Adolf', 'Adolfo', 'Adolph', 'Adolphus', 'Adonis', 'Adrain', 'Adrian', 'Adriana', 'Adrianna', 'Adriel', 'Adrien', 'Adrienne', 'Afton', 'Aglae', 'Agnes', 'Agustin', 'Agustina', 'Ahmad', 'Ahmed', 'Aida', 'Aidan', 'Aiden', 'Aileen', 'Aimee', 'Aisha', 'Aiyana', 'Akeem', 'Al', 'Alaina', 'Alan', 'Alana', 'Alanis', 'Alanna', 'Alayna', 'Alba', 'Albert', 'Alberta', 'Albertha', 'Alberto', 'Albin', 'Albina', 'Alda', 'Alden', 'Alec', 'Aleen', 'Alejandra', 'Alejandrin', 'Alek', 'Alena', 'Alene', 'Alessandra', 'Alessandro'],
    last_name: ['Abbott', 'Abernathy', 'Abshire', 'Adams', 'Altenwerth', 'Anderson', 'Ankunding', 'Armstrong', 'Auer', 'Aufderhar', 'Bahringer', 'Bailey', 'Balistreri', 'Barrows', 'Bartell', 'Bartoletti', 'Barton', 'Bashirian', 'Batz', 'Bauch', 'Baumbach', 'Bayer', 'Beahan', 'Beatty', 'Bechtelar', 'Becker', 'Bednar', 'Beer', 'Beier', 'Berge', 'Bergnaum', 'Bergstrom', 'Bernhard', 'Bernier', 'Bins', 'Blanda', 'Blick', 'Block', 'Bode', 'Boehm', 'Bogan', 'Bogisich', 'Borer', 'Bosco', 'Botsford', 'Boyer', 'Boyle', 'Bradtke', 'Brakus', 'Braun', 'Breitenberg', 'Brekke', 'Brown', 'Bruen', 'Buckridge', 'Carroll', 'Carter', 'Cartwright', 'Casper', 'Cassin', 'Champlin', 'Christiansen', 'Cole', 'Collier', 'Collins', 'Conn', 'Connelly', 'Conroy', 'Considine', 'Corkery', 'Cormier', 'Corwin', 'Cremin', 'Crist', 'Crona', 'Cronin', 'Crooks', 'Cruickshank'],
};

export default withStyles(styles)(ActiveConversation);