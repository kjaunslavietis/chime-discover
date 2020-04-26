import { API, graphqlOperation } from 'aws-amplify'
import { getOrCreateMeeting} from './../graphql/queries'
import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration
} from 'amazon-chime-sdk-js';
  

export async function createMeeting() {
    try {
      const desiredMeetingId = null;
      let meetingAndAttendeeInfo = await API.graphql(graphqlOperation(getOrCreateMeeting, {meetingId: desiredMeetingId}));
      console.log(JSON.stringify(meetingAndAttendeeInfo));
    } catch(err) {
      console.error(JSON.stringify(err));
    }
  }
  
export async function joinMeeting(desiredMeetingId) {
    try {
      console.log(desiredMeetingId);
      let meetingAndAttendeeInfo = await API.graphql(graphqlOperation(getOrCreateMeeting, {meetingId: desiredMeetingId}));
      console.log(JSON.stringify(meetingAndAttendeeInfo));
      const meetingResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.meeting;
      const attendeeResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.attendee;
      console.log(attendeeResponse);
      console.log(meetingResponse);
      const logger = new ConsoleLogger('SDK', LogLevel.INFO);
      console.log(logger);
      const deviceController = new DefaultDeviceController(logger);
      console.log(deviceController);
      // You need responses from server-side Chime API. See below for details.
      const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);
      console.log(configuration);

      // In the usage examples below, you will use this meetingSession object.
      const meetingSession = new DefaultMeetingSession(
        configuration,
        logger,
        deviceController
      );
      console.log(meetingSession);
      return meetingSession;
    } catch(err) {
      console.error(err);
    }
  }

