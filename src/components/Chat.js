import { MessageList, Button, Input } from 'react-chat-elements';
import React from 'react';
import 'react-chat-elements/dist/main.css'
import './Chat.css'
import ChatService from './../services/ChatService'

const CHAT_ROOM_ID = "FAKE-34567654" // should be passed as prop

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageList: [],
    };
    this.onNewMessageCreated = this.onNewMessageCreated.bind(this);
    this.chatService = new ChatService(this.onNewMessageCreated, CHAT_ROOM_ID);
    this.composeMessage = this.composeMessage.bind(this)
    
    // access roomId with this.props.roomId
    console.log(this.props.roomId);
    
  }

  componentWillMount() {
    this.chatService.getMessagesForConversation(0).then(chatMessages => {
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
            position: element.position ? element.position : "left",
            title: element.senderName,
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
    const newMessage = { position: 'right', senderName: "You", createdAt: new Date(), content: this.state.message }
    this.appendMessagesToChat([newMessage])
    this.chatService.createMessage({roomID: CHAT_ROOM_ID, senderName: "John Doe", content: this.state.message})
    this.setState({
      message: ""
    });
  }

  render() {
    return (
      <div
        className='chat-container'>
        <MessageList
          className='message-list'
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={this.state.messageList} />
        <Input
          placeholder="Write your message here"
          ref='inputRef'
          multiline={true}
          onChange={(e) => this.setState({ message: e.target.value })}
          onKeyPress={(e) => {
            if (e.shiftKey && e.charCode === 13) {
              return true;
            }
            if (e.charCode === 13) {
              this.composeMessage();
              this.refs.inputRef.clear();
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