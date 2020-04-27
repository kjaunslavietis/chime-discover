/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createChatMessage = /* GraphQL */ `
  mutation CreateChatMessage(
    $input: CreateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    createChatMessage(input: $input, condition: $condition) {
      id
      roomID
      content
      senderName
      mediaUrl
      mediaThumbnail
      createdAt
      updatedAt
    }
  }
`;
export const updateChatMessage = /* GraphQL */ `
  mutation UpdateChatMessage(
    $input: UpdateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    updateChatMessage(input: $input, condition: $condition) {
      id
      roomID
      content
      senderName
      mediaUrl
      mediaThumbnail
      createdAt
      updatedAt
    }
  }
`;
export const deleteChatMessage = /* GraphQL */ `
  mutation DeleteChatMessage(
    $input: DeleteChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    deleteChatMessage(input: $input, condition: $condition) {
      id
      roomID
      content
      senderName
      mediaUrl
      mediaThumbnail
      createdAt
      updatedAt
    }
  }
`;
export const createRoom = /* GraphQL */ `
  mutation CreateRoom(
    $input: CreateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    createRoom(input: $input, condition: $condition) {
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
export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom(
    $input: UpdateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    updateRoom(input: $input, condition: $condition) {
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
export const deleteRoom = /* GraphQL */ `
  mutation DeleteRoom(
    $input: DeleteRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    deleteRoom(input: $input, condition: $condition) {
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
