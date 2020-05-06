import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';

import './search.css';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 2px',
        display: 'flex',
        alignItems: 'center',
        width: 600,
        marginTop: '4px',
        height: 59,
        marginLeft: '30px'
    },
    categoryButton: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 250,
        marginTop: '5px',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
}));

function extractScoreStrictButFaster(scoreMap, searchedWords) {
    const idToScoreMap = new Map();
    searchedWords.forEach((searchedWord => {
        const wordInScoreMap = scoreMap.get(searchedWord);
        if (wordInScoreMap) {
            wordInScoreMap.forEach(scoreMap => {
                const idCurrentScore = idToScoreMap.get(scoreMap.id);
                if (idCurrentScore) {
                    idToScoreMap.set(scoreMap.id, idCurrentScore + scoreMap.score);
                } else {
                    idToScoreMap.set(scoreMap.id, scoreMap.score);
                }
            })
        }
    }));
    return idToScoreMap;
}

function extractScore(scoreMap, searchedWords) {
    const idToScoreMap = new Map();
    searchedWords.forEach((searchedWord => {
        scoreMap.forEach((value, key) => {
            if (key.startsWith(searchedWord)) {
                value.forEach(scoreMap => {
                    const idCurrentScore = idToScoreMap.get(scoreMap.id);
                    if (idCurrentScore) {
                        idToScoreMap.set(scoreMap.id, idCurrentScore + scoreMap.score);
                    } else {
                        idToScoreMap.set(scoreMap.id, scoreMap.score);
                    }
                })
            }
        });
    }));
    return idToScoreMap;
}

export default function SearchBar(props) {
    const classes = useStyles();
    const { categories, onSearch, scoreMap, nbRooms } = props;
    const fullMap = new Map();
    [...Array(nbRooms).keys()].forEach((value) => fullMap.set(value, 1));
    const [idMap, setIdMap] = useState(fullMap);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchFieldIsEmpty, setSearchFieldIsEmpty] = useState(true);

    const options = [...new Set(categories)].map((category) => {
        const firstLetter = category[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            title: category,
        };
    });

    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        const sortedIdMap = searchFieldIsEmpty ? new Map([...fullMap.entries()].sort((a, b) => b[1] - a[1])) : new Map([...idMap.entries()].sort((a, b) => b[1] - a[1]));
        if (selectedCategory) {
            sortedIdMap.forEach((value, key, map) => {
                if (categories[key].toLowerCase() !== selectedCategory.toLowerCase()) {
                    map.delete(key);
                }
            });
        }
        onSearch(Array.from(sortedIdMap.keys()));
    }, [idMap, selectedCategory]);

    useEffect(() => {
        if (searchTerm.length === 0) {
            setIdMap(fullMap);
            setSearchFieldIsEmpty(true);
        } else {
            setSearchFieldIsEmpty(false);
            setIdMap(extractScore(scoreMap, searchTerm.toLowerCase().split(" ").filter(Boolean)));
        }
    }, [scoreMap, searchTerm])

    return (
        <Grid container spacing={2} justify="center">
            <Grid item>
                <form className={classes.root} noValidate autoComplete="off">
                    <Paper component="form" className={classes.root}>
                        <IconButton className={classes.iconButton} aria-label="menu">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            className={classes.input}
                            placeholder="Search a room you would like to join"
                            onChange={onSearchChange}
                        />
                    </Paper>
                </form>
            </Grid>
            <Grid item>
                <Autocomplete
                    disableUnderline={true}
                    id="grouped-demo"
                    options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.title}
                    style={{ width: 300 }}
                    inputValue={selectedCategory}
                    onInputChange={(event, newInputValue) => {
                        setSelectedCategory(newInputValue);
                    }}
                    renderInput={(params) => 
                        <Paper component="form" className={classes.categoryButton}>
                            <TextField {...params} label="Browse Categories" variant="outlined" />
                        </Paper>
                    }
                />
            </Grid>
        </Grid>
    );
}