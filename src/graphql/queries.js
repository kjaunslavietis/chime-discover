/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOrCreateMeeting = /* GraphQL */ `
  query GetOrCreateMeeting($meetingId: String) {
    getOrCreateMeeting(meetingId: $meetingId) {
      meeting {
        ExternalMeetingId
        MediaPlacement {
          AudioFallbackUrl
          AudioHostUrl
          ScreenDataUrl
          ScreenSharingUrl
          ScreenViewingUrl
          SignalingUrl
          TurnControlUrl
        }
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
