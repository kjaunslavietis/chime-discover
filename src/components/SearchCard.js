import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import PersonIcon from '@material-ui/icons/Person';
import HearingIcon from '@material-ui/icons/Hearing';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import './search.css';

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
    personIcon: {
        color: 'rgba(0, 0, 0, 0.54)', 
        fontSize: 30,
    },
    customWidth: {
        maxWidth: 200,
    },
}));

export default function SearchCard(props) {
    const classes = useStyles();
    const { conversation, handleClickOnChip, handleJoinRoom } = props;
    const { name, description, category, keywords, meetingId, numberOfUsers, image } = conversation;

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={image ? image : "https://source.unsplash.com/random"}
                title={name}
            />
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
                        classes={{tooltip: classes.customWidth}}
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
            <CardActions disableSpacing>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <PersonIcon className={classes.personIcon} />
                <Typography>{numberOfUsers}</Typography>
                <div style={{ marginLeft: "80px" }}>
                    <Button size="small" color="primary" onClick={() => handleJoinRoom(meetingId)}>Join Room</Button>
                </div>
            </CardActions>
        </Card>
    );
}