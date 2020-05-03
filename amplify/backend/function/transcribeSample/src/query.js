module.exports = {
    mutation: `mutation updateRoom($input: UpdateRoomInput!) {
      updateRoom(input: $input) {
        id
        keywords
      }
    }
    `
}