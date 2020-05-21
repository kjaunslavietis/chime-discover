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
    }
  }
`;
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
      id
      name
    }
  }
`;
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
      id
      name
    }
  }
`;
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
      id
      name
    }
  }
`;
export const createRoomAttendee = /* GraphQL */ `
  mutation CreateRoomAttendee(
    $input: CreateRoomAttendeeInput!
    $condition: ModelRoomAttendeeConditionInput
  ) {
    createRoomAttendee(input: $input, condition: $condition) {
      roomID
      attendeeName
    }
  }
`;
export const updateRoomAttendee = /* GraphQL */ `
  mutation UpdateRoomAttendee(
    $input: UpdateRoomAttendeeInput!
    $condition: ModelRoomAttendeeConditionInput
  ) {
    updateRoomAttendee(input: $input, condition: $condition) {
      roomID
      attendeeName
    }
  }
`;
export const deleteRoomAttendee = /* GraphQL */ `
  mutation DeleteRoomAttendee(
    $input: DeleteRoomAttendeeInput!
    $condition: ModelRoomAttendeeConditionInput
  ) {
    deleteRoomAttendee(input: $input, condition: $condition) {
      roomID
      attendeeName
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
      attendeesNames
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
      attendeesNames
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
      attendeesNames
    }
  }
`;
