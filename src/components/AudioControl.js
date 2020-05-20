import React from 'react';
import Fab from '@material-ui/core/Fab';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import OutputDevices from './OutputDevices';
import InputDevices from './InputDevices';

class AudioControl extends React.Component {
    constructor(props) {
        super(props);
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
        if (this.props.isMuted) {
            return this.unmuteButton();
        }
        else {
            return this.muteButton();
        }
    }
}

export default AudioControl;