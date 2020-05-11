/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOrCreateMeeting = /* GraphQL */ `
  query GetOrCreateMeeting($meetingId: String, $userId: String) {
    getOrCreateMeeting(meetingId: $meetingId, userId: $userId) {
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
      attendees {
        AttendeeId
        ExternalUserId
        JoinToken
      }
    }
  }
`;
export const pushMeetingRecording = /* GraphQL */ `
  query PushMeetingRecording($base64: String) {
    pushMeetingRecording(base64: $base64)
  }
`;
export const listMeetingAttendees = /* GraphQL */ `
  query ListMeetingAttendees($meetingId: String) {
    listMeetingAttendees(meetingId: $meetingId) {
      statusCode
      error
      attendees {
        AttendeeId
        ExternalUserId
        JoinToken
      }
    }
  }
`;
export const getChatMessage = /* GraphQL */ `
  query GetChatMessage($id: ID!) {
    getChatMessage(id: $id) {
      id
      roomID
      content
      senderName
      mediaUrl
      mediaThumbnail
      createdAt
    }
  }
`;
export const listChatMessages = /* GraphQL */ `
  query ListChatMessages(
    $filter: ModelChatMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        roomID
        content
        senderName
        mediaUrl
        mediaThumbnail
        createdAt
      }
      nextToken
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
      lastActiveDate
      canBeAnalyzed
      keywords
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
        lastActiveDate
        canBeAnalyzed
        keywords
      }
      nextToken
    }
  }
`;
