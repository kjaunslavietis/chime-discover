import React, { useState, useEffect } from 'react';
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
    const { conversations, handleJoinRoom } = props;
    const [displayedRooms, setDisplayedRooms] = useState([...Array(conversations.length).keys()]);
    const [categories, setCategories] = useState([]);
    const [scoreMap, setScoreMap] = useState(new Map());

    console.log("updating Search Page");

    useEffect(() => {
        setDisplayedRooms([...Array(conversations.length).keys()]);
        const cat = conversations.map(room => room.category);
        setCategories(cat);
        setScoreMap(extractWordsToScore(
            conversations.map(room => room.name),
            conversations.map(room => room.description),
            cat,
            conversations.map(room => room.keywords.join(" "))));
      }, [conversations]);  

    const onSearch = (ids) => {
        setDisplayedRooms(ids);
        console.log("ids : " + ids);
    }

    const handleClickOnChip = (e) => {
        console.log("click on chip : " + e.target.lastChild.data);
    }

    return (
        <React.Fragment>
            <CssBaseline />
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
                                nbRooms={conversations.length}
                            />
                        </div>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                        {conversations.filter((room, index) => displayedRooms.includes(index)).map((room, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <SearchCard conversation={room} handleClickOnChip={handleClickOnChip} handleJoinRoom={() => handleJoinRoom(room)} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
        </React.Fragment>
    );
}