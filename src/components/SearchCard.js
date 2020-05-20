import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import PersonIcon from '@material-ui/icons/Person';
import HearingIcon from '@material-ui/icons/Hearing';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Chip from '@material-ui/core/Chip';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Storage } from 'aws-amplify';

import './search.css';
import { mergeClasses } from '@material-ui/styles';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
    media: {
        height: 140,
    },
    themeChips: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    nbUsers: {
        display: "flex",
        alignItems: "center",
    },
    personIcon: {
        color: 'rgba(6, 100, 21, 0.78)',
        marginRight: "4px",
        // fontSize: 30,
    },
    recordingIcon: {
        // marginRight: "4px",
        // fontSize: 26,
    },
    customWidth: {
        maxWidth: 200,
    },
    cardActions: {
        justifyContent: 'space-between',
        paddingBottom: '0px'
    },
    loadingSpinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // margin: theme.spacing(5),
        height: 140,
    }
}));

export default function SearchCard(props) {
    const classes = useStyles();
    const { conversation, handleClickOnChip, handleJoinRoom } = props;
    const { name, description, category, keywords, meetingId, imageUrl, attendeesNames, canBeAnalyzed } = conversation;
    const [open, setOpen] = React.useState(false);

    const [isLoading, setIsLoading] = React.useState(false);
    const [image, setImage] = React.useState(null);

    React.useEffect(() => {
        setIsLoading(true);
        if(imageUrl) {
            Storage.get(imageUrl)
                .then(downloadUrl => tryGettingImage(downloadUrl, 1000, 3));
        } else {
            tryGettingImage('https://source.unsplash.com/random', 1000, 3);
        }
    }, [imageUrl])

    const tryGettingImage = async (url, nextTimeoutMs, retriesLeft) => {
        try {
            let imageResponse = await fetch(url);
            if (!imageResponse.ok) {
                throw new Error();
            }
            let imageBlob = await imageResponse.blob();
            let imageBase64 = URL.createObjectURL(imageBlob);
            setImage(imageBase64);
        } catch(err) {
            if(retriesLeft > 0) {
                console.log(`Error loading image for conversation ${conversation.id}, retrying in ${nextTimeoutMs} ms`)
                setTimeout(() => tryGettingImage(url, nextTimeoutMs * 2, retriesLeft - 1), nextTimeoutMs);
            } else {
                console.log(`Error loading image for conversation ${conversation.id} and not retrying`);
                setImage('https://source.unsplash.com/random');
            }
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const getSpinner = () => {
        return (
            <div className={classes.loadingSpinner}>
                <CircularProgress />
            </div>
        )
    }

    const handleOpen = (e) => {
        setOpen(true);
        navigator.clipboard.writeText("So sorry, I lied ¯\\_(ツ)_/¯");
    };

    return (
        <Card className={classes.root}>
            {
                image ?
                    <CardMedia
                        className={classes.media}
                        image={image}
                        title={name}
                    />
                    :        
                    <CardMedia
                        component={getSpinner}
                    />
            }
            <CardContent className={classes.cardContent}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {name}
                </Typography>

                <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
                    {description}
                </Typography>

            </CardContent>
            <div className={classes.themeChips}>
                <Chip
                    avatar={<Avatar>C</Avatar>}
                    label={category}
                    onClick={handleClickOnChip}
                    color="primary"
                    variant="outlined"
                    size="small"
                />
                {keywords.map((keyword) => (
                    <Tooltip
                        title="This keyword has been extracted from the current conversation. Join now if you are interested!"
                        classes={{ tooltip: classes.customWidth }}
                    >
                        <Chip
                            label={keyword}
                            onClick={handleClickOnChip}
                            variant="outlined"
                            size="small"
                            icon={<HearingIcon />}
                        />
                    </Tooltip>
                ))}
            </div>
            <CardActions disableSpacing className={classes.cardActions}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        {
                            canBeAnalyzed 
                            ?
                            <Tooltip title="Voice snippets from this room will be used to categorize conversation topic">
                                    <RecordVoiceOverIcon />
                            </Tooltip>
                            :
                            null
                        }
                        <IconButton aria-label="share" onClick={handleOpen}>
                            <ShareIcon />
                        </IconButton>
                        <div className={classes.nbUsers}>
                            <PersonIcon className={classes.personIcon} />
                            <Typography variant="body2">{attendeesNames ? attendeesNames.length : 0} online</Typography>
                        </div>
                    </div>
                    <div>
                        <Button size="small" color="primary" onClick={() => handleJoinRoom(meetingId)}>Join Room</Button>
                    </div>
            </CardActions>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Room link copied to clipboard!
                </Alert>
            </Snackbar>
        </Card>
    );
}