import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import HearingIcon from '@material-ui/icons/Hearing';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MicIcon from '@material-ui/icons/Mic';

import './RoomCard.css';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 325,
        minWidth: 300,
        margin: '5px',
    },
    focus: {
        maxWidth: 325,
        minWidth: 300,
        margin: '5px',
        marginLeft: '25px',
        backgroundColor: "#c4c4c41f"
    },
    personIcon: {
        color: 'rgba(6, 100, 21, 0.78)',
        fontSize: 26,
        marginRight: "4px"
    },
    cardActions: {
        display: "flex",
        justifyContent: "space-between",
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <Card className={focus ? classes.focus : classes.root} >
            <CardActionArea onClick={() => handleClickOnCard(conversation)}>
                <CardHeader
                    action={
                        <React.Fragment>
                            <IconButton aria-label="settings" onClick={handleClick}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleClose}
                            >
                                {options.map((option) => (
                                    <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </React.Fragment>
                    }
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
                    <div className={classes.nbUsers}>
                        <PersonIcon className={classes.personIcon} />
                        <Typography>{conversation.numberOfUsers} online</Typography>
                    </div>
                    {audioActivated ? <MicIcon /> : null}
                </CardActions>
            </CardActionArea>
        </Card>
    );
}