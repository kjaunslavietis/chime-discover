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
  query GetRoom($meetingID: String!) {
    getRoom(meetingID: $meetingID) {
      id
      meetingID
      name
      description
      category
      imageUrl
      createdAt
      lastActiveDate
      canBeAnalyzed
      keywords
    }
  }
`;
export const listRooms = /* GraphQL */ `
  query ListRooms(
    $meetingID: String
    $filter: ModelRoomFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listRooms(
      meetingID: $meetingID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        meetingID
        name
        description
        category
        imageUrl
        createdAt
        lastActiveDate
        canBeAnalyzed
        keywords
      }
      nextToken
    }
  }
`;
