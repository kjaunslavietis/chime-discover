import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { createMeeting } from './../chime/handlers';
import ConversationService from './../services/ConversationService';

class CreateConversation extends React.Component {
    constructor(props) {
        super(props);

        this.conversationService = new ConversationService();

        this.state = {
            newConversationTitle: "",
            newConversationDescription: "",
            newConversationCategory: ""
        };

        this.submitForm = this.submitForm.bind(this);
    }

    async submitForm() {
        let newConversation = {
            name: this.state.newConversationName,
            description: this.state.newConversationDescription,
            category: this.state.newConversationCategory,
            meetingID: this.createChimeMeeting(),
            keywords: []
        };
        await this.writeConversation(newConversation);
        //Add an overlay while meeting is creating
        this.props.onConversationCreated(newConversation);
    }

    createChimeMeeting() {
        // call chime SDK to create meeting
        // put an overlay while meeting creating
        // createMeeting();
        return 'soon-to-be-id'; //id will be updated when the first person joins;
    }


    async writeConversation(newConversation) {
        console.log(newConversation);
        await this.conversationService.createConversation(newConversation);
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