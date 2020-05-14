import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import HearingIcon from '@material-ui/icons/Hearing';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MicIcon from '@material-ui/icons/Mic';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';

import './RoomCard.css';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 325,
        minWidth: 300,
        margin: '5px',
        overflow: 'visible',
        direction: 'ltr'
    },
    focus: {
        maxWidth: 325,
        minWidth: 300,
        margin: '5px',
        backgroundColor: "#6868681f",
        overflow: 'visible',
        direction: 'ltr'
    },
    personIcon: {
        color: 'rgba(6, 100, 21, 0.78)',
        // fontSize: 26,
        marginRight: "4px"
    },
    cardActions: {
        display: "flex",
        justifyContent: "space-between",
        paddingRight: "15px",
    },
    nbUsers: {
        display: "flex",
        alignItems: "center",
    },
    themeChips: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    browserCardContent: {
        padding: '0px 5px 5px 5px',
    },
    browserCardHeader: {
        paddingBottom: '0px',
    },
    customWidth: {
        maxWidth: 200,
    },
}));

const options = [
    'Share',
    'Leave Room'
];

export default function RoomCard(props) {
    const classes = useStyles();
    const { focus, audioActivated, conversation, handleClickOnCard } = props;
    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleOpen = (e) => {
        setOpen(true);
        navigator.clipboard.writeText("So sorry, I lied ¯\\_(ツ)_/¯");
    };

    return (
        <Card className={focus ? classes.focus : classes.root} >
            <CardActionArea onClick={() => handleClickOnCard(conversation)}>
                <CardHeader
                    // action={
                    //     <React.Fragment>
                    //         <IconButton aria-label="settings" onClick={handleClick}>
                    //             <MoreVertIcon />
                    //         </IconButton>
                    //         <Menu
                    //             id="long-menu"
                    //             anchorEl={anchorEl}
                    //             keepMounted
                    //             open={open}
                    //             onClose={handleClose}
                    //         >
                    //             {options.map((option) => (
                    //                 <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                    //                     {option}
                    //                 </MenuItem>
                    //             ))}
                    //         </Menu>
                    //     </React.Fragment>
                    // }
                    title={conversation.name}
                    className={classes.browserCardHeader}
                />
                <CardContent className={classes.browserCardContent}>
                    <div className={classes.themeChips}>
                        <Chip
                            avatar={<Avatar>C</Avatar>}
                            label={conversation.category}
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                        {/* {conversation.keywords.definedKeywords.map((keyword) => (
                            <Chip
                                label={keyword}
                                variant="outlined"
                                size="small"
                            />
                        ))} */}
                        {conversation.keywords.map((keyword) => (
                            <Tooltip
                                title="This keyword has been extracted from the current conversation. Join now if you are interested!"
                                classes={{ tooltip: classes.customWidth }}
                            >
                                <Chip
                                    label={keyword}
                                    variant="outlined"
                                    size="small"
                                    icon={<HearingIcon />}
                                />
                            </Tooltip>
                        ))}
                    </div>
                </CardContent>
                <CardActions disableSpacing className={classes.cardActions}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <IconButton aria-label="share" onClick={handleOpen}>
                            <ShareIcon />
                        </IconButton>
                        {
                            conversation.canBeAnalyzed 
                            ?
                            <Tooltip title="Voice snippets from this room will be used to categorize conversation topic">
                                    <RecordVoiceOverIcon />
                            </Tooltip>
                            :
                            null
                        }
                    </div>
                    <div className={classes.nbUsers}>
                        <PersonIcon className={classes.personIcon} />
                        <Typography>{conversation.attendees.length} online</Typography>
                    </div>
                    {audioActivated ? <MicIcon /> : null}
                </CardActions>
                    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Room link copied to clipboard!
                    </Alert>
                </Snackbar>
            </CardActionArea>
        </Card>
    );
}