import React from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';

class ActiveConversation extends React.Component {
    constructor(props) {
        super(props);

        this.exitConversation = this.exitConversation.bind(this);

        this.state = {
            isMeetingLoading: true,
            onConversationExited: this.props.onConversationExited
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

    render() {
        if(this.state.isMeetingLoading) {
            return this.loadingScreen();
        } else {
            return (
                <Container>
                    <p>{`Joined meeting: ${this.props.conversation.name}`}</p>
                    <Button variant="danger" size="lg" block onClick={this.exitConversation}>Exit conversation</Button>
                </Container>
            )
        }
    }
}

export default ActiveConversation;