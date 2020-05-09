import { MessageList, Button, Input } from 'react-chat-elements';
import React from 'react';
import 'react-chat-elements/dist/main.css'
import './Chat.css'
import ChatService from './../services/ChatService'
import ScrollToBottom from 'react-scroll-to-bottom';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import ReactDOM from 'react-dom';

let currentEmoji = ""; 

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageList: [],
      showingEmojiPocker: false,
      roomID: this.props.roomID,
    };

    this.onNewMessageCreated = this.onNewMessageCreated.bind(this);
    this.chatService = new ChatService(this.onNewMessageCreated, this.state.roomID, this.props.userName);
    this.composeMessage = this.composeMessage.bind(this)
    this.addEmoji = this.addEmoji.bind(this)
    console.log("==>user from the chat component " + this.props.userName)
    console.log("==>room id " + this.state.roomID)

  }

  componentDidMount() {
    this.timer = setInterval(() => { this.setState({}); console.log("update chat messages time every min") }, 60 * 1000)
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillMount() {
    this.chatService.getMessagesForConversation().then(chatMessages => {
      this.appendMessagesToChat(chatMessages)
    })
    document.removeEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }


  onNewMessageCreated(chatMessage) {
    this.appendMessagesToChat([chatMessage])
  }

  //Update chat on switching the room
  async componentDidUpdate(prevProps, prevState) {
    if(prevProps.roomID !== this.props.roomID) {
      this.setState({
        roomID: this.props.roomID,
        messageList: [],
      });
      console.log('state: ', this.state);
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
    if (!this.state.message) {
      return
    }
    const newMessage = { roomID: this.state.roomID, senderName: this.props.userName, content: this.state.message }
    this.appendMessagesToChat([newMessage])
    this.chatService.createMessage(newMessage)
    this.setState({
      message: ""
    });
    this.refs.inputRef.clear()
  }

  addEmoji(emoji) {
  
    this.refs.inputRef.onChange({target: {value : this.state.message + emoji.native}});
  }

  handleClick = e => {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      this.setState({showingEmojiPocker: false})
    }
  }

  render() {
    return (
      <div id = "textfieldc"
        className='chat-frame'>
        <ScrollToBottom className="message-list-container">
          <MessageList
            lockable={true}
            className='message-list'
            toBottomHeight={0}
            dataSource={this.state.messageList} />
        </ScrollToBottom>
        <Input
          placeholder="write here"
          ref='inputRef'
          multiline={false}
          onChange = {(e) => this.setState({ message: e.target.value })}
          onKeyPress={(e) => {
            console.log.apply("==>event:" + e)
            if (e.shiftKey && e.charCode === 13) {
              return true;
            }
            if (e.charCode === 13) {
              this.composeMessage();
              e.preventDefault();
              return false;
            }
          }}
          rightButtons={
            <div>
              <div>
                <Button
                  text='😃'
                  onClick={() => { this.setState({ showingEmojiPocker: !this.state.showingEmojiPocker})}} />
                {this.state.showingEmojiPocker && <Picker onSelect={this.addEmoji} style={{ position: 'absolute', bottom: '57px', right: '55px' }}/> }
              </div>
              <Button
                text='SEND'
                onClick={this.composeMessage} />

            </div>
          } />
      </div>
    )
  }
}

export default Chat;