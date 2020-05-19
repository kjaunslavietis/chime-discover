import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import PersonIcon from '@material-ui/icons/Person';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Chip from '@material-ui/core/Chip';

import './search.css';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        // height: '100%',
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

export default function PreviewCard(props) {
    const classes = useStyles();
    const { name, description, category, image, canBeAnalyzed } = props;

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={image}
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
                    color="primary"
                    variant="outlined"
                    size="small"
                />
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
                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>
                        <div className={classes.nbUsers}>
                            <PersonIcon className={classes.personIcon} />
                            <Typography variant="body2">0 online</Typography>
                        </div>
                    </div>
                    <div>
                        <Button size="small" color="primary">Join Room</Button>
                    </div>
            </CardActions>
        </Card>
    );
}