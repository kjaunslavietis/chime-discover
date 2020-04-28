import { MessageList, Button, Input } from 'react-chat-elements';
import React from 'react';
import 'react-chat-elements/dist/main.css'
import './Chat.css'
import ChatService from './../services/ChatService'

const CHAT_ROOM_ID = "FAKE-34567654" // should be passed as prop
const USER_NAME_AS_ID = "Wilson" // should be passed as prop

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageList: [],
    };
    this.onNewMessageCreated = this.onNewMessageCreated.bind(this);
    this.chatService = new ChatService(this.onNewMessageCreated, CHAT_ROOM_ID, USER_NAME_AS_ID);
    this.composeMessage = this.composeMessage.bind(this)
    
  }

  componentWillMount() {
    this.chatService.getMessagesForConversation().then(chatMessages => {
      this.appendMessagesToChat(chatMessages)
    })
  }

  onNewMessageCreated(chatMessage) {
    console.log("==> update from component" + JSON.stringify(chatMessage))
    this.appendMessagesToChat([chatMessage])
  
}

  appendMessagesToChat(newMessages) {
    var list = this.state.messageList;
    newMessages.forEach(element => {
      list.push
        (
          {
            position:  element.senderName===USER_NAME_AS_ID ? "right" : "left",
            title: element.senderName===USER_NAME_AS_ID ? "You" : element.senderName,
            date: new Date(element.createdAt),
            text: element.content
          }
        )
    }
    );
    this.setState({ messageList: list });
  }

  composeMessage() {
    if (!this.state.message) {
      return
    }
    const newMessage =  {roomID: CHAT_ROOM_ID, senderName: USER_NAME_AS_ID, content: this.state.message}
    this.appendMessagesToChat([newMessage])
    this.chatService.createMessage({roomID: CHAT_ROOM_ID, senderName: USER_NAME_AS_ID, content: this.state.message})
    this.setState({
      message: ""
    });
    this.refs.inputRef.clear()
  }

  render() {
    return (
      <div
        className='container'>
        <MessageList
          lockable={true}
          className='message-list'
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={this.state.messageList} />
        <Input
          placeholder="write anything here"
          ref='inputRef'
          multiline={true}
          onChange={(e) => this.setState({ message: e.target.value })}
          onKeyPress={(e) => {
            if (e.shiftKey && e.charCode === 13) {
              return true;
            }
            if (e.charCode === 13) {
              this.composeMessage();
              //this.refs.inputRef.clear();
              e.preventDefault();
              return false;
            }
          }}
          rightButtons={
            <Button
              text='SEND'
              onClick={this.composeMessage} />
          } />
      </div>
    )
  }
}

export default Chat;