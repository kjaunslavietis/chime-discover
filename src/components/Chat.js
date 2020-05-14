import { MessageList } from 'react-chat-elements';
import React from 'react';
import ChatService from './../services/ChatService'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ChatEmojiPicker from './ChatEmojiPicker';
import 'react-chat-elements/dist/main.css'
import './Chat.css'

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageList: [],
      roomID: this.props.roomID,
    };

    this.onNewMessageCreated = this.onNewMessageCreated.bind(this);
    this.chatService = new ChatService(this.onNewMessageCreated, this.state.roomID, this.props.userName);
    this.composeMessage = this.composeMessage.bind(this)
    this.addEmoji = this.addEmoji.bind(this)
    console.log("==>user from the chat component " + this.props.userName)
    console.log("==>room id " + this.state.roomID)
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.timer = setInterval(() => { this.setState({}); console.log("update chat messages time every min") }, 60 * 1000)
    this.scrollToBottom();
  }

  componentWillMount() {
    this.chatService.getMessagesForConversation().then(chatMessages => {
      this.appendMessagesToChat(chatMessages)
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }


  onNewMessageCreated(chatMessage) {
    this.appendMessagesToChat([chatMessage])
  }

  //Update chat on switching the room
  async componentDidUpdate(prevProps, prevState) {
    this.scrollToBottom();
    if (prevProps.roomID !== this.props.roomID) {
      this.setState({
        roomID: this.props.roomID,
        messageList: [],
      });
      this.chatService.updateConversationId(this.props.roomID);
      this.chatService.getMessagesForConversation().then(chatMessages => {
        this.appendMessagesToChat(chatMessages)
      })
      console.log("==>room id updated to " + this.props.roomID)
    }
  }

  appendMessagesToChat(newMessages) {
    var list = this.state.messageList;
    newMessages.forEach(element => {
      list.push
        (
          {
            position: element.senderName === this.props.userName ? "right" : "left",
            title: element.senderName === this.props.userName ? "You" : element.senderName,
            date: element.createdAt ? new Date(element.createdAt) : new Date(),
            text: element.content
          }
        )
    }
    );
    this.setState({ messageList: list });
  }

  composeMessage() {
    if (this.state.message) {
      const newMessage = { roomID: this.state.roomID, senderName: this.props.userName, content: this.state.message }
      this.appendMessagesToChat([newMessage])
      this.chatService.createMessage(newMessage)
      this.setState({
        message: ""
      });
    }    
  }

  addEmoji(emoji) {
    this.setState((prevState) => ({
      message: prevState.message + emoji.native
    }));
  }

  render() {
    return (
      <Paper elevation={1} style={{ marginTop: '20px' }}>
        <div style={{ minHeight: '650px', minWidth: '1050px', backgroundColor: 'rgb(245, 245, 245)', maxHeight: '650px', overflow: 'auto', paddingLeft: '30px', paddingRight: '30px'}}>
          <div>
            <MessageList
              lockable={true}
              className='message-list'
              toBottomHeight={0}
              dataSource={this.state.messageList} />
          </div>
          <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        <div style={{ minHeight: '50px', minWidth: '1050px', display: 'flex', flexDirection: 'row' }}>
          <TextField
            fullWidth
            placeholder="Write here!"
            variant="outlined"
            value={this.state.message}
            onChange = {(e) => this.setState({ message: e.target.value })}
            onKeyPress={(e) => {
                if (e.shiftKey && e.charCode === 13) {
                return true;
              }
              if (e.charCode === 13) {
                this.composeMessage();
                e.preventDefault();
                return false;
              }
            }}
          />
          <ChatEmojiPicker addEmoji={this.addEmoji} />
          <Button style={{ marginRight: "10px" }} onClick={this.composeMessage}>
            SEND
          </Button>
        </div>
      </Paper>
    )
  }
}

export default Chat;