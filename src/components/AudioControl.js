import React from 'react';
import { Container, Button, Spinner, DropdownButton } from 'react-bootstrap';
import OutputDevices from './OutputDevices';
import InputDevices from './InputDevices';

class AudioControl extends React.Component {
    constructor(props) {
        super(props);
    }

    enableAudioButton() {
        return (
            <Button variant="secondary" size="lg" block onClick={this.props.enableAudio}>Enable Audio</Button>
        )
    }

    unmuteButton() {
        return (
            <Button variant="secondary" size="sm" block onClick={this.props.muteOrUnmute}>Unmute</Button>
        )
        
    }

    muteButton() {
        return (
            <Button variant="primary" size="sm" block onClick={this.props.muteOrUnmute}>Mute</Button>
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