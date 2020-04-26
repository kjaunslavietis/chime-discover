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
export const getRoom = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      meetingID
      name
      description
      category
      imageUrl
      createdAt
      updatedAt
    }
  }
`;
export const listRooms = /* GraphQL */ `
  query ListRooms(
    $filter: ModelRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        meetingID
        name
        description
        category
        imageUrl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
