import { MessageList, Button , Input} from 'react-chat-elements';
import React from 'react';
import 'react-chat-elements/dist/main.css'
import './Chat.css'


class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            show: true,
            messageList: [],
        };
        this.addMessage = this.addMessage.bind(this);
    }
    addMessage() {      
      var list = this.state.messageList;
      list.push({position: 'left', title :" name", date: new Date(), text: this.state.message});
      this.setState({
        message:"",
          messageList: list
      });
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
                        onChange = {(e) => this.setState({message : e.target.value})}
                        onKeyPress={(e) => {
                            if (e.shiftKey && e.charCode === 13) {
                                return true;
                            }
                            if (e.charCode === 13) {
                                this.addMessage();
                               this.refs.inputRef.clear();  
                                e.preventDefault();
                                return false;
                            }
                        }}
                        rightButtons={
                            <Button
                                text='SEND'
                                onClick={this.addMessage} />
                        } />
                </div>
  )
    }
}

export default Chat;