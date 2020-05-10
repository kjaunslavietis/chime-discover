

const AWS = require('aws-sdk');

// You must use "us-east-1" as the region for Chime API and set the endpoint.
const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

exports.handler = async (event) => {
    let meetingId = event.arguments.meetingId;
    let allAttendeesResponse = {};
    let allAttendees = [];
    do {
        try {
            allAttendeesResponse = await chime.listAttendees({
                MeetingId: meetingId,
                NextToken: allAttendeesResponse.NextToken
            }).promise();
            allAttendees.push(allAttendeesResponse.Attendees);
        } catch (err) {
            console.log(`Listing Attendees error: ${err} \n ${err.stack}`);
            return {
                statusCode: 500,
                error: err
            };
        }
    } while (allAttendeesResponse.NextToken);

    const response = {
        statusCode: 200,
        attendees: allAttendees
    };
    return response;
};

