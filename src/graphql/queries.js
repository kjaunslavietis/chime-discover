/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOrCreateMeeting = /* GraphQL */ `
  query GetOrCreateMeeting($meetingId: String) {
    getOrCreateMeeting(meetingId: $meetingId) {
      meeting {
        ExternalMeetingId
        MediaRegion
        MeetingId
      }
      attendee {
        AttendeeId
        ExternalUserId
        JoinToken
      }
      statusCode
      error
    }
  }
`;
export const getDemoResponse = /* GraphQL */ `
  query GetDemoResponse($input: Int) {
    getDemoResponse(input: $input) {
      result
      statusCode
      body
    }
  }
`;
