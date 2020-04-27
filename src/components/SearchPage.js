import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import SearchBar from './SearchBar';
import SearchCard from './SearchCard';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    mainContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    searchBar: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
}));

const scoreForEachType = [0.5, 0.1, 1, 0.5];

function extractWordsToScore(names, descriptions, categories, keywords) {
    const wordsToScore = 
        names.flatMap((name, index) => name.split(" ").map((word) => ({id: index, score: scoreForEachType[0], word: word.toLowerCase()})))
            .concat(descriptions.flatMap((description, index) => description.split(" ").map((word) => ({id: index, score: scoreForEachType[1], word: word.toLowerCase()}))))
            .concat(categories.flatMap((category, index) => category.split(" ").map((word) => ({id: index, score: scoreForEachType[2], word: word.toLowerCase()}))))
            .concat(keywords.flatMap((keyword, index) => keyword.split(" ").map((word) => ({id: index, score: scoreForEachType[3], word: word.toLowerCase()}))));
    const scoreMap = new Map();
    wordsToScore.forEach(wordToScore => {
        const wordInMap = scoreMap.get(wordToScore.word);
        if (wordInMap) {
            wordInMap.push(wordToScore);
        } else {
            scoreMap.set(wordToScore.word, [wordToScore]);
        }
    })
    return scoreMap;
}

export default function SearchPage(props) {
    const classes = useStyles();
    const [displayedRooms, setDisplayedRooms] = useState([...Array(rooms.length).keys()]);
    const { conversations, handleJoinRoom } = props; // TODO : replace mock object "rooms" by conversations
    // handleJoinRoom will return one param (meetingId) when users clicks on Join room button


    const categories = rooms.map(room => room.category);
    const scoreMap = extractWordsToScore(
        rooms.map(room => room.name),
        rooms.map(room => room.description),
        categories,
        rooms.map(room => room.keywords.definedKeywords.concat(room.keywords.extractedKeywords).join(" ")));    

    const onSearch = (ids) => {
        setDisplayedRooms(ids);
    }

    const handleClickOnChip = (e) => {
        console.log("click on chip : " + e.target.lastChild.data);
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <div className={classes.mainContent}>
                    <Container maxWidth="lg">
                        <Typography component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
                            Find new communities on Chime Discover
                        </Typography>
                        <div className={classes.searchBar}>
                            <SearchBar
                                categories={categories}
                                onSearch={onSearch}
                                scoreMap={scoreMap}
                                nbRooms={rooms.length}
                            />
                        </div>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                        {rooms.filter((room, index) => displayedRooms.includes(index)).map((room) => (
                            <Grid item key={room.meetingId} xs={12} sm={6} md={4}>
                                <SearchCard conversation={room} handleClickOnChip={handleClickOnChip} handleJoinRoom={handleJoinRoom} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    );
}

const rooms = [
    {
        name: "World War II",
        description: "This room is dedicated to discuss the Second World War.",
        category: "History",
        meetingId: "532",
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
        meetingId: "533",
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
        meetingId: "534",
        numberOfUsers: 10,
        keywords: {
            definedKeywords: ["Theory", "Futurology"],
            extractedKeywords: ["Celestial", "Cool"]
        },
    },
];