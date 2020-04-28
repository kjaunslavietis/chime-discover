import React from 'react';

import { Modal, Button } from 'react-bootstrap';

class MeetingInfoModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let conversationName = this.props.conversation ? this.props.conversation.name : '';
        let conversationDescription = this.props.conversation ? this.props.conversation.description : '';
        let conversationCategory = this.props.conversation ? this.props.conversation.category : '';

        return (
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header closeButton>
                <Modal.Title>{conversationName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Conversation description:</strong> {conversationDescription}
                    </p>
                    <p>
                        <strong>Conversation category:</strong> {conversationCategory}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={this.props.onClose}>
                    Close
                </Button>
                <Button variant="primary" size="lg" onClick={this.props.onJoin}>
                    Join Conversation
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default MeetingInfoModal;