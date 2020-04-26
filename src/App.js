import React from 'react'
import './App.css';
import { Container, Row, Col, Jumbotron, Navbar, Button, Form } from 'react-bootstrap';
import Browser from './components/Browser';
import CreateConversation from './components/CreateConversation';
import ActiveConversation from './components/ActiveConversation';
import MeetingInfoModal from './components/MeetingInfoModal';

import ConversationService from './services/ConversationService';

import './App.scss';

const mockConvos = [
  {
    name: "Conversation 1",
    description: "Conversation 1 description",
    category: "Conversation 1 category",
    meetingId: ""
  },
  {
    name: "Conversation 2",
    description: "Conversation 2 description",
    category: "Conversation 2 category",
    meetingId: "AS1Q23EWDS"
  },
  {
    name: "Conversation 3",
    description: "Conversation 3 description",
    category: "Conversation 3 category",
    meetingId: "AWE12QWDSA"
  },
  {
    name: "Conversation 4",
    description: "Conversationm 4 description",
    category: "Conversation 4 category",
    meetingId: "123EWDQSAXC123"
  },
  {
    name: "Conversation 5",
    description: "Conversation 5 description",
    category: "Conversation 5 category",
    meetingId: "1234MM1234123"
  },
]

class App extends React.Component {
  constructor(props) {
    super(props);

    this.conversationInfo = this.conversationInfo.bind(this);
    this.onConversationCreated = this.onConversationCreated.bind(this);
    this.createConversation = this.createConversation.bind(this);
    this.joinConversation = this.joinConversation.bind(this);
    this.onConversationExited = this.onConversationExited.bind(this);
    this.onConversationSelected = this.onConversationSelected.bind(this);

    this.conversationService = new ConversationService();

    this.state = {
      conversations: this.conversationService.getAllConversations(),
      selectedConversation: null,
      activeConversation: null,
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

  joinConversation() {
    if(this.state.activeConversation) {
      this.setState({
        mainSlot: <ActiveConversation conversation={this.state.activeConversation} onConversationExited={this.onConversationExited}/>
      });
    }
  }

  onConversationExited() {
    this.setState({
      mainSlot: this.noConversationSelected(),
      activeConversation: null
    })
  }

  conversationInfo() {
    if(this.state.selectedConversation) {
      return <MeetingInfoModal 
        show={true}
        conversation={this.state.selectedConversation}
        onClose={() => this.setState({selectedConversation: null})}
        onJoin={() => this.setState({selectedConversation: null, activeConversation: this.state.selectedConversation}, () => this.joinConversation())}
        />
    }
  }

  createConversation() {
    this.setState({
      mainSlot: <CreateConversation onConversationCreated={(newConversation) => {this.onConversationCreated(newConversation)}}/>
    });
  }

  onConversationCreated(conversation) {
    console.log(JSON.stringify(conversation));
    this.conversationService.createConversation(conversation);
    this.setState({
      // conversations: this.state.conversations.concat(conversation),
      selectedConversation: conversation,
      mainSlot: this.noConversationSelected()
    });
  }

  onConversationSelected(id) {
    this.setState({
      selectedConversation: this.state.conversations[id]
    });
  }

  render() {
    return (
      <Container fluid>
        { this.conversationInfo() }
        <Navbar className="bg-light justify-content-between">
          <Navbar.Brand>Chime Discover</Navbar.Brand>
          <Form inline>
            <Button variant="primary" onClick={this.createConversation} disabled={this.state.activeConversation ? true : false}>Create Conversation</Button>
          </Form>
        </Navbar>
        <Row id="mainRow">
          <Col id="searchCol" sm={2}>
            <Browser 
              conversations={this.state.conversations}
              onConversationSelected={(id) => this.onConversationSelected(id)}
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
