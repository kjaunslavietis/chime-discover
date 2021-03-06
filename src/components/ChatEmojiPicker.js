import React from 'react';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
import InsertEmoticon from '@material-ui/icons/InsertEmoticon';

class ChatEmojiPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingEmojiPocker: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillMount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = e => {
    try {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      this.setState({ showingEmojiPocker: false })
    }
  } catch(err) {

  }
  }

  render() {
    return (
          <div>
            <IconButton onClick={() => this.setState({ showingEmojiPocker: !this.state.showingEmojiPocker})}>
              <InsertEmoticon fontSize="large" />
            </IconButton>
            <div style={{ position: 'relative' }}>
              {this.state.showingEmojiPocker && <Picker onSelect={this.props.addEmoji} style={{ position: 'absolute', bottom: '60px', right: '10px' }}/> }
            </div>
          </div>
    )
  }
}

export default ChatEmojiPicker;