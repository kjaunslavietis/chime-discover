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
  
export async function joinMeeting(oldId, desiredMeetingId) {
    try {
      let isCreated = false;
      let conversationService = new ConversationService();
      console.log(desiredMeetingId);
      let meetingAndAttendeeInfo = await API.graphql(graphqlOperation(getOrCreateMeeting, {meetingId: desiredMeetingId}));
      const meetingResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.meeting;
      const attendeeResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.attendee;
      if(desiredMeetingId != meetingResponse.MeetingId) {
        isCreated = true;
        await conversationService.updateConversation(oldId, meetingResponse.MeetingId)
      }
      console.log(attendeeResponse);
      console.log(meetingResponse);
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
      console.log(meetingSession);
      return meetingSession;
    } catch(err) {
      console.error(err);
    }
  }

