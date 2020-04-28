import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

import ConversationService from './services/ConversationService';
import AttendeeService from './services/AttendeeService';
import SearchPage from './components/SearchPage';

import { Auth, Hub } from 'aws-amplify';

import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

import './App.css';

const useStyles = makeStyles((theme) => ({
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
}));


const App = () => {
    const classes = useStyles();
    const [isCurrentPageSearch, setIsCurrentPageSearch] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [conversations, setConversations] = useState([]);

    const conversationService = new ConversationService();
    const attendeeService = new AttendeeService();

    if(!isSignedIn) {
      Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      }).then(user => {
        setIsSignedIn(true)
      })
      .catch(err => console.log("Not logged in"));

      const authListener = (data) => {

        switch (data.payload.event) {
    
            case 'signIn':
                setIsSignedIn(true);
                break;
            case 'signUp':
                console.log('user signed up');
                break;
            case 'signOut':
                setIsSignedIn(false);
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

      async function loadConversations() {
        let allConversations = await conversationService.getAllConversations();
        allConversations = allConversations.map(conversation => {
          let conversationWithAttendees = conversation;
          conversationWithAttendees.attendees = attendeeService.getAttendeesForRoom(conversation.id);
          return conversationWithAttendees;
        });
        setConversations(allConversations);
    }

    useEffect(() => {
      if (isSignedIn) {
          loadConversations();
      }    
    }, [isSignedIn]);

    const handleClickOnCard = (conv) => {
      setIsCurrentPageSearch(false);
      setCurrentConversation(conv);
    };

    const handleJoinRoomOnSearch = (conv) => {
      setIsCurrentPageSearch(false);
      setCurrentConversation(conv);
    }

    const onConversationCreated = (name, description, category, acceptRecording) => {
      console.log(name + " " + description + " " + category + " " + acceptRecording);
      // we don't check for creation error, let's assume everything is always working :-)
      setCreateDialogOpen(false);
      conversationService.createConversation({
        name: name,
        description: description,
        category: category,
        canBeAnalyzed: acceptRecording,
        meetingId: "",
        keywords: []
      }).then(() => loadConversations());
      // TODO : join the newly created room
    }

    const handleClickOpen = () => {
      setCreateDialogOpen(true);
    };
    
    const handleClose = () => {
      setCreateDialogOpen(false);
    };

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
              <Button color="inherit" onClick={handleClickOpen}>Create a new Conversation</Button>
              <AmplifySignOut />
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.container} style={{ display: "flex" }}>
          <div className={classes.sidebar}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.searchButton}
              startIcon={<SearchIcon />}
              onClick={() => setIsCurrentPageSearch(true)}
            >
              Find new Rooms
                </Button>
            {conversations.map((conversation) => (
              <RoomCard 
                conversation={conversation}
                focus={currentConversation && conversation.meetingID === currentConversation.meetingID}
                audioActivated={currentConversation && conversation.meetingID === currentConversation.meetingID}
                handleClickOnCard={handleClickOnCard}
              />
            ))}
          </div>
          <Container maxWidth="xl">
            <Paper>
              {isCurrentPageSearch? 
                <SearchPage conversations={conversations} handleJoinRoom={handleJoinRoomOnSearch} />
                : 
                <ActiveConversation 
                attendeesList={conversationService.getAttendees(currentConversation.id)} 
                conversation={currentConversation}
                onConversationExited={undefined} />
              }
            </Paper>
          </Container>
        </div>
          <CreateConversation handleCreate={onConversationCreated} open={createDialogOpen} handleClose={handleClose} />
      </React.Fragment>
    );
}

export default withAuthenticator(App);