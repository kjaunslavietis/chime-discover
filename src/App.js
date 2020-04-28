import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import Browser from './components/RoomCard';
import CreateConversation from './components/CreateConversation';
import ActiveConversation from './components/ActiveConversation';
import MeetingInfoModal from './components/MeetingInfoModal';

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
						<Button color="inherit">Create a new Conversation</Button>
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
					>
						Find new Rooms
      				</Button>
					<Browser />
					<Browser />
					<Browser />
					<Browser />
					<Browser />
					<Browser />
				</div>
				<Container maxWidth="xl">
					<Paper>
						<SearchPage />
					</Paper>
				</Container>
			</div>
		</React.Fragment>
	);
}

