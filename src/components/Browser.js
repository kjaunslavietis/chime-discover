import { Card, Container, ListGroup } from 'react-bootstrap';
import React from 'react';

import './Browser.scss';

class Browser extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(id) {
        console.log(`You selected: ${id}`);
        this.props.onConversationSelected(id);

    }

    render() {
        let conversationCards = this.props.conversations.map((item, key) =>
            <ListGroup.Item action variant="primary" onClick={(e) => this.handleClick(key)}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
            </ListGroup.Item>
        );

        return (
            <ListGroup>
                {conversationCards}
            </ListGroup>
        );
    }
  }

  export default Browser;