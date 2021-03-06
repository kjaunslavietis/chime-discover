import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';

import RoomCard from './components/RoomCard';
import CreateConversation from './components/CreateConversation';
import ActiveConversation from './components/ActiveConversation';
import SearchPage from './components/SearchPage';

import ConversationService from './services/ConversationService';
import CategoriesService from './services/CategoriesService';

import { Storage, Auth, Hub } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

import { Map, Set } from 'immutable';

import { v4 as uuidv4 } from 'uuid';
import Compressor from 'compressorjs';

import './App.css';


const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(0),
  },
  title: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    padding: '1rem',
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "10px",
    marginRight: "10px",
    minWidth: '350px',
    overflowY: 'scroll',
    maxHeight: '90vh',
    flex: "none",
    direction: 'rtl'
  },
  sidebarContent: {
    direction: 'ltr'
  },
  main: {
    display: "flex",
    justifyContent: "center",
    flexGrow: "0.8"
  },
  searchButton: {
    maxWidth: "325px",
    margin: "5px",
  }
});

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isCurrentPageSearch: true,
      createDialogOpen: false,
      isSignedIn: false,
      userName: null,
      currentConversation: null,
      conversations: new Map(),
      conversationHistory: new Map(),
      categories: []
    }

    this.conversationService = new ConversationService();
    this.categoriesService = new CategoriesService();

    this.createConversationSubscription = null;
    this.updateConversationSubscription = null;
    this.deleteConversationSubscription = null;

    this.doInitialLoad = this.doInitialLoad.bind(this);
    this.cancelSubscriptions = this.cancelSubscriptions.bind(this);

    
  }

  componentDidMount() {
    this.getAllCategories()
  }

  doInitialLoad() {
    this.loadConversations().then(() => console.log('Conversations loaded'));
    this.loadHistory().then(() => console.log('History loaded'));
    this.setupSubscriptions().then(() => console.log('Subscriptions created'));
  }

  async getAllCategories() {
    this.categoriesService.getCategories().then(categories => {
      const compatibleCategories = categories.map((e , index) => ({title: e.name, id: index}));
      this.setState({
        categories: compatibleCategories
      })
    })
  }

  async loadHistory() {
    let idsFromHistory = this.getHistoryFromLocalStorage();
    let stillValidIds = Set();
    let conversationHistory = Map();
    for(let nextId of idsFromHistory.values()) {
      let matchedConversation = await this.conversationService.getConversation(nextId);
      if(matchedConversation) {
        stillValidIds = stillValidIds.add(nextId);
        conversationHistory = conversationHistory.set(nextId, matchedConversation);
      }
    }

    this.saveHistoryToLocalStorage(stillValidIds);
    this.setState({conversationHistory: conversationHistory});
  }

  getHistoryFromLocalStorage() {
    let historyArray = JSON.parse(localStorage.getItem('conversationHistory') || "[]");
    return Set(historyArray);
  }

  saveHistoryToLocalStorage(historySet) {
    let historyArray = Array.from(historySet || Set());
    if(historyArray.length > 20) {
      historyArray = historyArray.slice(historyArray.length - 20);
    }

    let historyString = JSON.stringify(historyArray);
    localStorage.setItem('conversationHistory', historyString);
  }

  async loadConversations() {
    let allConversations = await this.conversationService.getAllConversations();
    if(allConversations) {
      let conversationMap = new Map();
      for(let nextConversation of allConversations) {
        conversationMap = conversationMap.set(nextConversation.id, nextConversation);
      }

      this.setState({conversations: conversationMap});
    }
  }

  async setupSubscriptions() {
    if(!this.createConversationSubscription) {
      this.createConversationSubscription = this.conversationService.subscribeToCreates((newConvo) => {
        this.setState({conversations: this.state.conversations.set(newConvo.id, newConvo)});
      });
    }

    if(!this.updateConversationSubscription) {
      this.updateConversationSubscription = this.conversationService.subscribeToUpdates((updatedConvo) => {
        if(this.state.conversationHistory.has(updatedConvo.id)) {
          this.setState({conversationHistory: this.state.conversationHistory.set(updatedConvo.id, updatedConvo)});
        }

        this.setState({conversations: this.state.conversations.set(updatedConvo.id, updatedConvo)});
      });
    }

    if(!this.deleteConversationSubscription) {
      this.deleteConversationSubscription = this.conversationService.subscribeToDeletes((deletedConvo) => {
        if(this.state.conversationHistory.has(deletedConvo.id)) {
          this.setState({conversationHistory: this.state.conversationHistory.delete(deletedConvo.id)});
          let previousStoredHistory = this.getHistoryFromLocalStorage();
          this.saveHistoryToLocalStorage(previousStoredHistory.delete(deletedConvo.id));
        }
        this.setState({conversations: this.state.conversations.delete(deletedConvo.id)});
      });
    }
  }

  cancelSubscriptions() {
    if(this.createConversationSubscription) {
      this.createConversationSubscription.unsubscribe();
      this.createConversationSubscription = null;
    }

    if(this.updateConversationSubscription) {
      this.updateConversationSubscription.unsubscribe();
      this.updateConversationSubscription = null;
    }

    if(this.deleteConversationSubscription) {
      this.deleteConversationSubscription.unsubscribe();
      this.deleteConversationSubscription = null;
    }
  }

  handleClickOnCard = (conv) => {
    this.joinRoom(conv);
  };

  handleJoinRoomOnSearch = (conv) => {
    this.joinRoom(conv);
  }

  joinRoom = (conv) => {
    this.setState({
      isCurrentPageSearch: false,
      currentConversation: conv,
      conversationHistory: this.state.conversationHistory.set(conv.id, conv)
    });

    let previousStoredHistory = this.getHistoryFromLocalStorage();
    if(previousStoredHistory.has(conv.id)) {
      previousStoredHistory = previousStoredHistory.delete(conv.id);
    }
    this.saveHistoryToLocalStorage(previousStoredHistory.add(conv.id));
  }

  handleBackToSearch = () => {
    this.setState({
      isCurrentPageSearch: true,
      currentConversation: null
    })
  }

  onConversationCreated = (name, description, category, acceptRecording, image) => {
    console.log(name + " " + description + " " + category + " " + acceptRecording);
    // we don't check for creation error, let's assume everything is always working :-)
    this.setState({
      createDialogOpen: false
    })

    let imageKey = null;
    if(image) {
      imageKey = `images/${uuidv4()}`;
      new Compressor(image, {
        quality: 0.6,
        convertSize: 500000,
        success(compressedImage) {
          Storage.put(imageKey, compressedImage)
          .then (result => {
            console.log(result)
          })
          .catch(err => console.log(err));
        },
        error(err) {
          console.log(err.message);
        },
      });

    }

    this.conversationService.createConversation({
      name: name,
      description: description,
      category: category,
      canBeAnalyzed: acceptRecording,
      meetingId: "",
      imageUrl: imageKey,
      keywords: [],

    }).then(() => {});
    // TODO : join the newly created room
  }

  handleClickOpen = () => {
    this.setState({createDialogOpen: true})
  };

  handleClose = () => {
    this.setState({createDialogOpen: false})
  };

  conversationHistory = () => {
    let conversationHistoryArray = this.conversationHistoryArray();
    if(conversationHistoryArray && conversationHistoryArray.length > 0) {
        return conversationHistoryArray.map((conversation) => (
          <RoomCard
            conversation={conversation}
            focus={this.state.currentConversation && conversation.id === this.state.currentConversation.id}
            audioActivated={this.state.currentConversation && conversation.id === this.state.currentConversation.id}
            handleClickOnCard={this.handleClickOnCard}
          />
        ))
    } else {
      return <p><em>Looks like you haven't joined any conversations yet. <br /> Go on, pick one!</em></p>
    }
  }

  conversationArray = () => Array.from(this.state.conversations.values());

  conversationHistoryArray = () => {
     // doing it this way ensures we preserve the order of history, which we couldn't do by just calling values() on the map
    let storedIds = this.getHistoryFromLocalStorage();
    let historyArray = [];
    for(let nextId of storedIds.values()) {
      let conversationRecord = this.state.conversationHistory.get(nextId);
      if(conversationRecord) {
        historyArray.push(conversationRecord);
      }
    }

    return historyArray.reverse();
  }

  doAuth = () => {
    if (!this.state.isSignedIn) {
      Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      }).then(user => {
        this.setState({isSignedIn: true, userName: user.username}, this.doInitialLoad);
      })
      .catch(err => console.log("Not logged in"));
  
      const authListener = (data) => {
  
        switch (data.payload.event) {
  
          case 'signIn':
            this.setState({isSignedIn: true, userName: data.payload.data.username}, this.doInitialLoad);
            break;
          case 'signUp':
            console.log('user signed up');
            break;
          case 'signOut':
            this.setState({isSignedIn: false}, this.cancelSubscriptions);
            break;
          case 'signIn_failure':
            console.log('user sign in failed');
            break;
          case 'configured':
            console.log('the Auth module is configured');
        }
      }
  
      Hub.listen('auth', authListener);
    }
  }

  handleSignOut = () => {
    Auth.signOut()
    .then(data => {
      this.setState({isSignedIn: false});
      console.log(data)}
      )
    .catch(err => console.log(err));
  }

  render() {
    this.doAuth();

    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <AppBar position="static" color="transparent" style={{ background: 'rgba(136, 138, 143, 0.15)' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <img src={`${process.env.PUBLIC_URL}/logo-removebg-preview(1).png`} />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.title}>
                Chime Discover
                      </Typography>
              <Button color="inherit" onClick={this.handleClickOpen}>Create a new Conversation</Button>
              <Button color="inherit" onClick={this.handleSignOut}>Sign Out</Button>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.container} >
          <div className={classes.sidebar}>
            <div className={classes.sidebarContent}>
              {/* <Button
                style={{direction:'ltr'}}
                variant="contained"
                color="primary"
                size="large"
                className={classes.searchButton}
                startIcon={<SearchIcon />}
                onClick={() => this.setState({isCurrentPageSearch: true})}
              >
                Find new Rooms
                    </Button> */}
              {
                this.conversationHistory()
              }
            </div>
          </div>
          <Container maxWidth="xl">
            <Paper>
              {this.state.isCurrentPageSearch ?
                <SearchPage conversations={this.conversationArray()} handleJoinRoom={this.handleJoinRoomOnSearch} />
                :
                <ActiveConversation
                  conversation={this.state.currentConversation}
                  userName={this.state.userName}
                  onConversationExited={this.handleBackToSearch} />
              }
            </Paper>
          </Container>
        </div>
        <CreateConversation handleCreate={this.onConversationCreated} open={this.state.createDialogOpen} handleClose={this.handleClose} categories = {this.state.categories.map(category => category.title)} />
      </React.Fragment>
  )
  }
}

export default withAuthenticator(withStyles(styles)(App));