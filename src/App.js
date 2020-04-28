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
import SearchPage from './components/SearchPage';

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

export default function App() {
	const classes = useStyles();
	const [isCurrentPageSearch, setIsCurrentPageSearch] = useState(true);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [currentConversation, setCurrentConversation] = useState(null);
	/*const [conversations, setConversations] = useState([]);

	useEffect(() => {
		async function loadConversations() {
			const conversationService = new ConversationService();
			const allConversations = await conversationService.getAllConversations();
			setConversations(allConversations);
		}
		loadConversations();
	}, []);*/

	const handleClickOnCard = (conv) => {
		console.log(conv);
		setIsCurrentPageSearch(false);
		setCurrentConversation(conv);
	};

	const handleJoinRoomOnSearch = (conv) => {
		console.log(conv);
		setIsCurrentPageSearch(false);
		setCurrentConversation(conv);
	}

	const onConversationCreated = (e) => {
		console.log(e);
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
							<img src="https://framapic.org/cddKfQa7ertU/UodmdFuda7u2.png" />
						</IconButton>
						<Typography variant="h6" color="inherit" className={classes.title}>
							Chime Discover
          				</Typography>
						<Button color="inherit" onClick={handleClickOpen}>Create a new Conversation</Button>
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
							: <ActiveConversation conversation={currentConversation} onConversationExited={undefined} />
						}
					</Paper>
				</Container>
			</div>
			<Dialog
				open={createDialogOpen}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<CreateConversation onConversationCreated={onConversationCreated} />
	  		</Dialog>
		</React.Fragment>
	);
}

const mockConversations = [
	{
		id: "40d648e3-999a-4967-9ca9-ebb82ea6f958",
		meetingID: "a7c059f3-7795-4080-8428-7e0a70613ed2",
		name: "tet",
		description: "tet",
		category: "tet",
		keywords: []
	}
];

const conversations = [
    {
        name: "World War II",
        description: "This room is dedicated to discuss the Second World War",
        category: "History",
        meetingID: "a7c059f3-7795-4080-8428-7e0a70613ed2",
        numberOfUsers: 3,
        keywords: {
            definedKeywords: ["supernatural", "world war two"],
            extractedKeywords: ["fiction", "Russia"]
        },
    },
    {
        name: "World War III",
        description: "I know not with what weapons World War III will be fought, but World War IV will be fought with sticks and stones.",
        category: "Futurology",
        meetingID: "a7c059f3-7795-4080-8428-7e0a70613ed2",
        numberOfUsers: 6,
        keywords: {
            definedKeywords: ["Science", "History", "Apocalypse"],
            extractedKeywords: ["Zombie"]
        },
    },
    {
        name: "Astronomy room",
        description: "Yeah science!",
        category: "Science",
        meetingID: "a7c059f3-7795-4080-8428-7e0a70613ed2",
        numberOfUsers: 10,
        keywords: {
            definedKeywords: ["Theory", "Futurology"],
            extractedKeywords: ["Celestial", "Cool"]
        },
    },
];