import React from 'react';
import Fab from '@material-ui/core/Fab';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import VolumeOff from '@material-ui/icons/VolumeOff';
import OutputDevices from './OutputDevices';
import InputDevices from './InputDevices';

class AudioControl extends React.Component {
    constructor(props) {
        super(props);
    }

    enableAudioButton() {
        return (
            <Fab size="medium" onClick={this.props.enableAudio}>
                <VolumeOff />
            </Fab>
        )
    }

    unmuteButton() {
        return (
            <Fab size="medium" color="primary" onClick={this.props.muteOrUnmute}>
                <Mic />
            </Fab>
        )
        
    }

    muteButton() {
        return (
            <Fab size="medium" onClick={this.props.muteOrUnmute}>
                <MicOff />
            </Fab>
        );
    }

    render() {
        if(!this.props.isAudioEnabled) {
            return this.enableAudioButton();
        }
        else if(this.props.isMuted && this.props.isAudioEnabled) {
            return this.unmuteButton();
        }
        else if(!this.props.isMuted && this.props.isAudioEnabled) {
            return this.muteButton();
        }
    }
}

export default AudioControl;