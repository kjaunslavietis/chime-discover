const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');

// You must use "us-east-1" as the region for Chime API and set the endpoint.
const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

exports.handler = async (event) => {
    let meetingId = event.meetingId;

    let meetingResponse;
    let createNewMeeting = false;

    if(!meetingId) {
        createNewMeeting = true;
    } else {
        let params = {
            MeetingId: meetingId /* required */
        };

        try {
            meetingResponse = await chime.getMeeting(params).promise();
        } catch(err) {
            console.log(`GetMeeting error: ${err} \n ${err.stack}`); // an error occurred
            createNewMeeting = true;
        }
    }

    if(createNewMeeting) {
        try {
            meetingResponse = await chime.createMeeting({
                ClientRequestToken: uuid(),
                MediaRegion: 'eu-central-1' // Specify the region in which to create the meeting.
            }).promise();
        } catch(err) {
            console.log(`CreateMeeting error: ${err} \n ${err.stack}`); // an error occurred
            return {
                statusCode: 500,
                error: err
            };
        }
    }

    let attendeeResponse;
    try {
        attendeeResponse = await chime.createAttendee({
            MeetingId: meetingResponse.Meeting.MeetingId,
            ExternalUserId: uuid() // Link the attendee to an identity managed by your application.
        }).promise();
    } catch(err) {
        console.log(`CreateAttendee error: ${err} \n ${err.stack}`); // an error occurred
        return {
            statusCode: 500,
            error: err
        };
    }

    // meetingResponse.Meeting.ID = uuid();
    // meetingResponse.Meeting.MediaPlacement.ID = uuid();
    // attendeeResponse.Attendee.ID = uuid();

    // TODO implement
    const response = {
        ID: uuid(),
        statusCode: 200,
        meeting: meetingResponse.Meeting,
        attendee: attendeeResponse.Attendee
    };
    return response;
};
