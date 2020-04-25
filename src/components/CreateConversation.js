import React from 'react';
import { Form, Button } from 'react-bootstrap';

class CreateConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newConversationTitle: "",
            newConversationDescription: "",
            newConversationTags: ""
        };

        this.submitForm = this.submitForm.bind(this);
    }

    submitForm() {
        let newConversation = {
            name: this.state.newConversationName,
            description: this.state.newConversationDescription,
            tags: this.state.newConversationTags
        };
        this.props.onConversationCreated(newConversation);
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
                    <Form.Label>Conversation Tags</Form.Label>
                    <Form.Control type="text" placeholder="Conversation Tags" onChange={(e) => this.setState({newConversationTags: e.target.value})}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={this.submitForm}>
                    Create
                </Button>
            </Form>
        )
    }
}

export default CreateConversation;