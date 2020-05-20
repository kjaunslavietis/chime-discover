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
      let meetingAndAttendeeInfo = await API.graphql(graphqlOperation(getOrCreateMeeting, {meetingId: desiredMeetingId, userId: userName}));
      const meetingResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.meeting;
      const attendeeResponse = meetingAndAttendeeInfo.data.getOrCreateMeeting.attendee;
      const attendeesList = meetingAndAttendeeInfo.data.getOrCreateMeeting.attendees;
      const meetingId = meetingResponse.MeetingId;
      if(desiredMeetingId != meetingId) {
        isCreated = true;
        await conversationService.updateConversation(oldId, meetingId)
      }
      console.log(attendeeResponse);
      console.log(meetingResponse);
      console.log('Attendees: ',attendeesList);
      console.log("New meeting was created:", isCreated);
      //The rest of the function needs to be executed in HTTPS, it will return errors in HTTP
      const logger = new ConsoleLogger('SDK', LogLevel.OFF);
      const deviceController = new DefaultDeviceController(logger);
      const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);
      const meetingSession = new DefaultMeetingSession(
        configuration,
        logger,
        deviceController
      );
      return {
        meeting: meetingSession, 
        meetingId: meetingId,
        attendees: attendeesList
      };
    } catch(err) {
      console.error(err);
    }
  }

