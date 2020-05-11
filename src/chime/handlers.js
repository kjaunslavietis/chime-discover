import { API, graphqlOperation } from 'aws-amplify'
import { getOrCreateMeeting} from './../graphql/queries'
import ConversationService from './../services/ConversationService';

import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration
} from 'amazon-chime-sdk-js';
  
export async function joinMeeting(oldId, desiredMeetingId, userName) {
    try {
      let isCreated = false;
      let conversationService = new ConversationService();
      console.log(desiredMeetingId);
      console.log(userName);
      let meetingAndAttendeeInfo = await API.graphql(graphqlOperation(getOrCreateMeeting, {meetingId: desiredMeetingId, userId: userName}));
      const meetingResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.meeting;
      const attendeeResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.attendee;
      const attendeesList = meetingAndAttendeeInfo.data.getOrCreateMeeting.attendees;
      if(desiredMeetingId != meetingResponse.MeetingId) {
        isCreated = true;
        await conversationService.updateConversation(oldId, meetingResponse.MeetingId)
      }
      console.log(attendeeResponse);
      console.log(meetingResponse);
      console.log('Attendees: ',attendeesList);
      console.log("New meeting was created:", isCreated);
      
      const logger = new ConsoleLogger('SDK', LogLevel.INFO);
      const deviceController = new DefaultDeviceController(logger);
      // You need responses from server-side Chime API. See below for details.
      const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);

      // In the usage examples below, you will use this meetingSession object.
      const meetingSession = new DefaultMeetingSession(
        configuration,
        logger,
        deviceController
      );
      return {
        meeting: meetingSession, 
        attendees: attendeesList
      };
    } catch(err) {
      console.error(err);
    }
  }

