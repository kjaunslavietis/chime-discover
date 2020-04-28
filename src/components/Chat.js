import { MessageList, Button, Input } from 'react-chat-elements';
import React from 'react';
import 'react-chat-elements/dist/main.css'
import './Chat.css'
import ChatService from './../services/ChatService'
import ScrollToBottom from 'react-scroll-to-bottom';
import { JS } from 'aws-amplify';


class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageList: [],
    };
    
    this.onNewMessageCreated = this.onNewMessageCreated.bind(this);
    this.chatService = new ChatService(this.onNewMessageCreated, this.props.roomID, this.props.userName);
    this.composeMessage = this.composeMessage.bind(this)
    console.log("==> roomid " + props.roomID)
  }
  
componentDidMount() {
  this.timer = setInterval(() => {this.setState({});console.log("update chat messages time every min")},60*1000)
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
  if (!this.state.message) {
    return
  }
  const newMessage = { roomID: this.props.roomID, senderName: this.props.userName, content: this.state.message }
  this.appendMessagesToChat([newMessage])
  this.chatService.createMessage(newMessage)
  this.setState({
    message: ""
  });
  this.refs.inputRef.clear()
}

render() {
  return (
    <div
      className='chat-frame'>
      <ScrollToBottom className = "message-list-container">
      <MessageList
        lockable={true}
        className='message-list'
        toBottomHeight={0}
        dataSource={this.state.messageList} />
        </ScrollToBottom>
      <Input
        placeholder="write here"
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