import React from 'react'
import './App.css';
import { Container, Row, Col, Jumbotron, Navbar, Button, Form } from 'react-bootstrap';
import Browser from './components/Browser';
import { createMeeting, joinMeeting } from './chime/handlers';
import './App.scss';

const mockConvos = [
  {
    name: "Conversation 1",
    description: "Conversation 1 description"
  },
  {
    name: "Conversation 2",
    description: "Conversation 2 description"
  },
  {
    name: "Conversation 3",
    description: "Conversation 3 description"
  },
  {
    name: "Conversation 4",
    description: "Conversationm 4 description"
  },
  {
    name: "Conversation 5",
    description: "Conversation 5 description"
  },
]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: mockConvos,
      selectedConversation: null
    };

    this.conversationInfo = this.conversationInfo.bind(this);
  }

  noConversationSelected() {
    return (
      <Container>
        <h1>Select conversation</h1>
        <p>
          You are not currently in a conversation. Select a conversation from the left to join.
        </p>
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
        </Container>
      )
    } else {
      return this.noConversationSelected();
    }
  }

  render() {
    return (
      <Container fluid>
        <Navbar className="bg-light justify-content-between">
          <Navbar.Brand>Chime Discover</Navbar.Brand>
          <Form inline>
            <Button variant="primary">Create Conversation</Button>
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
                {this.conversationInfo()}
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
