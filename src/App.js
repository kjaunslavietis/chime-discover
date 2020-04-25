import React from 'react'
import './App.css';
import { Container, Row, Col, Jumbotron, Navbar, Button, Form } from 'react-bootstrap';
import Browser from './components/Browser';
import CreateConversation from './components/CreateConversation';

import './App.scss';

const mockConvos = [
  {
    name: "Conversation 1",
    description: "Conversation 1 description",
    tags: "Conversation 1 tags"
  },
  {
    name: "Conversation 2",
    description: "Conversation 2 description",
    tags: "Conversation 2 tags"
  },
  {
    name: "Conversation 3",
    description: "Conversation 3 description",
    tags: "Conversation 3 tags"
  },
  {
    name: "Conversation 4",
    description: "Conversationm 4 description",
    tags: "Conversation 4 tags"
  },
  {
    name: "Conversation 5",
    description: "Conversation 5 description",
    tags: "Conversation 5 tags"
  },
]

class App extends React.Component {
  constructor(props) {
    super(props);

    this.conversationInfo = this.conversationInfo.bind(this);
    this.onConversationCreated = this.onConversationCreated.bind(this);
    this.createConversation = this.createConversation.bind(this);

    this.state = {
      conversations: mockConvos,
      selectedConversation: null,
      mainSlot: this.noConversationSelected()
    };
  }

  noConversationSelected() {
    return (
      <Container>
        <h1>Select conversation</h1>
        <p>
          You are not currently in a conversation. Select a conversation from the left to join.
        </p>
        <Button variant="primary" size="lg" block onClick={this.createConversation}>
            Create new conversation
        </Button>
      </Container>
    )
  }

  conversationInfo() {
    if(this.state.selectedConversation) {
      return (
        <Container>
          <h1>Conversation info</h1>
          <h3><strong>Conversation name:</strong> {this.state.selectedConversation.name}</h3>
          <p>
            <strong>Conversation description:</strong> {this.state.selectedConversation.description}
          </p>
          <p>
            <strong>Conversation tags:</strong> {this.state.selectedConversation.tags}
          </p>
        </Container>
      )
    } else {
      return this.noConversationSelected();
    }
  }

  createConversation() {
    this.setState({
      mainSlot: <CreateConversation onConversationCreated={(newConversation) => {this.onConversationCreated(newConversation)}}/>
    });
  }

  onConversationCreated(conversation) {
    console.log(JSON.stringify(conversation));
    this.setState({
      conversations: this.state.conversations.concat(conversation),
      selectedConversation: conversation
    }, () => this.setState({mainSlot: this.conversationInfo()}));
  }

  render() {
    return (
      <Container fluid>
        <Navbar className="bg-light justify-content-between">
          <Navbar.Brand>Chime Discover</Navbar.Brand>
          <Form inline>
            <Button variant="primary" onClick={this.createConversation}>Create Conversation</Button>
          </Form>
        </Navbar>
        <Row id="mainRow">
          <Col id="searchCol" sm={2}>
            <Browser 
              conversations={this.state.conversations}
              onConversationSelected={(id) => this.setState({selectedConversation: this.state.conversations[id]})}
              />
          </Col>
          <Col id="mainCol" sm={10}>
            <Jumbotron fluid>
                {this.state.mainSlot}
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
