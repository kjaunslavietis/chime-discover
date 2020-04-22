/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRoom = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      name
      description
      originalTags
      autoTags
      isAutoTagEnabled
      createdOn
      lastActivity
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
        name
        description
        originalTags
        autoTags
        isAutoTagEnabled
        createdOn
        lastActivity
      }
      nextToken
    }
  }
`;
