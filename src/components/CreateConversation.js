import React from 'react';
import { Form, Button } from 'react-bootstrap';

class CreateConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newConversationTitle: "",
            newConversationDescription: "",
            newConversationCategory: ""
        };

        this.submitForm = this.submitForm.bind(this);
    }

    submitForm() {
        let newConversation = {
            name: this.state.newConversationName,
            description: this.state.newConversationDescription,
            category: this.state.newConversationCategory,
            meetingId: this.createChimeMeeting()
        };
        this.writeConversation();
        this.props.onConversationCreated(newConversation);
    }

    createChimeMeeting() {
        // call chime SDK to create meeting
        // put an overlay while meeting creating
        return "MockMeetingId";
    }

    writeConversation() {
        // write conversation record to DynamoDB
    }

    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Conversation Name</Form.Label>
                    <Form.Control type="text" placeholder="Conversation Name" onChange={(e) => this.setState({newConversationName: e.target.value})}/>
                    <br />
                    <Form.Label>Conversation Description</Form.Label>
                    <Form.Control type="text" placeholder="Conversation Description" onChange={(e) => this.setState({newConversationDescription: e.target.value})}/>
                    <br />
                    <Form.Label>Conversation Category</Form.Label>
                    <Form.Control type="text" placeholder="Conversation Category" onChange={(e) => this.setState({newConversationCategory: e.target.value})}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={this.submitForm}>
                    Create
                </Button>
            </Form>
        )
    }
}

export default CreateConversation;