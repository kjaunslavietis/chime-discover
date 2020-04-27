import { API, graphqlOperation } from 'aws-amplify'
import { listRooms, getRoom} from './../graphql/queries'
import { createRoom, updateRoom} from './../graphql/mutations'

class ConversationService {
    constructor() {
        this.mockConvos = [
            {
              name: "Conversation 1",
              description: "Conversation 1 description",
              category: "Conversation 1 category",
              meetingId: "e5102622-6672-4969-b2ca-f689c85d0be1",
              keywords: ["supernatural", "world war two"]
            },
            {
              name: "Conversation 2",
              description: "Conversation 2 description",
              category: "Conversation 2 category",
              meetingId: "439589bf-8dac-4082-b4db-f584cf25d747",
              keywords: ["bigfoot"]
            },
            {
              name: "Conversation 3",
              description: "Conversation 3 description",
              category: "Conversation 3 category",
              meetingId: "439589bf-8dac-4082-b4db-f584cf25d747",
              keywords: []
            },
            {
              name: "Conversation 4",
              description: "Conversationm 4 description",
              category: "Conversation 4 category",
              meetingId: "f073d4c1-bb52-4bcc-90e4-4d2662773bdd",
              keywords: []
            },
            {
              name: "Conversation 5",
              description: "Conversation 5 description",
              category: "Conversation 5 category",
              meetingId: "f29f4436-9f81-484e-9b1e-14eb0dd06728",
              keywords: ["spongebob", "religion", "mumbai"]
            },
          ]
    }
    async getConversation(meetingId) {
      //TODO test
      try { 
        const conversation = await API.graphql(graphqlOperation(getRoom, {meetingID: meetingId}));
        return conversation;
      } catch(err) {
        console.error(err);
      }
    }
    async getAllConversations() {
      try {
      const conversations = await API.graphql(graphqlOperation(listRooms));
      return conversations.data.listRooms.items;
      } catch(err) {
        console.error(err);
      }
    }
    async updateConversation(oldId, newMeetingId) {
      try{ 
        await API.graphql(graphqlOperation(updateRoom, 
          {input: {
            id: oldId,
            meetingID: newMeetingId}}
        ));
      } catch(err) {
        console.error(err);
      }
    }
    async createConversation(conversation) {
        console.log('creating convo');
        const newConversation = await API.graphql(graphqlOperation(createRoom,  {input: conversation}))
        // .then(response => console.log('new convo : ${newConversation}'))
        // .catch(error => console.log(error.message));;
        
        console.log(newConversation);
        this.mockConvos.push(conversation);
    }
}

export default ConversationService;
