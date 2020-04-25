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
  
export async function joinMeeting() {
    try {
      const desiredMeetingId = "random";
      let meetingAndAttendeeInfo = await API.graphql(graphqlOperation(getOrCreateMeeting, {meetingId: desiredMeetingId}));
      console.log(JSON.stringify(meetingAndAttendeeInfo));
      const logger = new ConsoleLogger('SDK', LogLevel.INFO);
      console.log(logger);
      const deviceController = new DefaultDeviceController(logger);
      console.log(deviceController);
      // You need responses from server-side Chime API. See below for details.
      const meetingResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.meeting;
      const attendeeResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.attendee;
      const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);
      console.log(JSON.stringify(configuration));
      console.log(meetingResponse);
      console.log(attendeeResponse);
      // In the usage examples below, you will use this meetingSession object.
    //   const meetingSession = new DefaultMeetingSession(
    //     configuration,
    //     logger,
    //     deviceController
    //   );
    //   console.log(meetingSession);
    } catch(err) {
      console.error(err);
    }
  }

