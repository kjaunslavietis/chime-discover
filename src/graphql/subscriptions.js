/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const subscribeToGiveRoom = /* GraphQL */ `
  subscription SubscribeToGiveRoom($roomID: ID!) {
    subscribeToGiveRoom(roomID: $roomID) {
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
export const subscribeToRoomGettingAttendees = /* GraphQL */ `
  subscription SubscribeToRoomGettingAttendees($id: ID!) {
    subscribeToRoomGettingAttendees(id: $id) {
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
      attendeesNames
    }
  }
`;
export const subscribeToAttendeeJoinsRoom = /* GraphQL */ `
  subscription SubscribeToAttendeeJoinsRoom($roomID: ID!) {
    subscribeToAttendeeJoinsRoom(roomID: $roomID) {
      id
      roomID
      attendeesName
    }
  }
`;
export const subscribeToAttendeeLeavesRoom = /* GraphQL */ `
  subscription SubscribeToAttendeeLeavesRoom($roomID: ID!) {
    subscribeToAttendeeLeavesRoom(roomID: $roomID) {
      id
      roomID
      attendeesName
    }
  }
`;
export const onCreateChatMessage = /* GraphQL */ `
  subscription OnCreateChatMessage {
    onCreateChatMessage {
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
export const onUpdateChatMessage = /* GraphQL */ `
  subscription OnUpdateChatMessage {
    onUpdateChatMessage {
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
export const onDeleteChatMessage = /* GraphQL */ `
  subscription OnDeleteChatMessage {
    onDeleteChatMessage {
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
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory {
    onCreateCategory {
      id
      name
    }
  }
`;
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory {
    onUpdateCategory {
      id
      name
    }
  }
`;
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory {
    onDeleteCategory {
      id
      name
    }
  }
`;
export const onCreateRoomAttendee = /* GraphQL */ `
  subscription OnCreateRoomAttendee {
    onCreateRoomAttendee {
      id
      roomID
      attendeesName
    }
  }
`;
export const onUpdateRoomAttendee = /* GraphQL */ `
  subscription OnUpdateRoomAttendee {
    onUpdateRoomAttendee {
      id
      roomID
      attendeesName
    }
  }
`;
export const onDeleteRoomAttendee = /* GraphQL */ `
  subscription OnDeleteRoomAttendee {
    onDeleteRoomAttendee {
      id
      roomID
      attendeesName
    }
  }
`;
export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom {
    onCreateRoom {
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
      attendeesNames
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom {
    onUpdateRoom {
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
      attendeesNames
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom {
    onDeleteRoom {
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
      attendeesNames
    }
  }
`;
