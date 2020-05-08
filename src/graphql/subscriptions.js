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
    }
  }
`;
