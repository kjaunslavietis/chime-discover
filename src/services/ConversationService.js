import { API, graphqlOperation } from 'aws-amplify'
import { listRooms, getRoom} from './../graphql/queries'
import { createRoom, updateRoom} from './../graphql/mutations'
import { onCreateRoom, onUpdateRoom, onDeleteRoom } from './../graphql/subscriptions';

class ConversationService {
    constructor() {
        this.mockConvos = [
            {
              id: "1",
              name: "Conversation 1",
              description: "Conversation 1 description",
              category: "Conversation 1 category",
              meetingId: "e5102622-6672-4969-b2ca-f689c85d0be1",
              keywords: ["supernatural", "world war two"]
            },
            {
              id: "2",
              name: "Conversation 2",
              description: "Conversation 2 description",
              category: "Conversation 2 category",
              meetingId: "439589bf-8dac-4082-b4db-f584cf25d747",
              keywords: ["bigfoot"]
            },
            {
              id: "3",
              name: "Conversation 3",
              description: "Conversation 3 description",
              category: "Conversation 3 category",
              meetingId: "439589bf-8dac-4082-b4db-f584cf25d747",
              keywords: []
            },
            {
              id: "4",
              name: "Conversation 4",
              description: "Conversationm 4 description",
              category: "Conversation 4 category",
              meetingId: "f073d4c1-bb52-4bcc-90e4-4d2662773bdd",
              keywords: []
            },
            {
              id: "5",
              name: "Conversation 5",
              description: "Conversation 5 description",
              category: "Conversation 5 category",
              meetingId: "f29f4436-9f81-484e-9b1e-14eb0dd06728",
              keywords: ["spongebob", "religion", "mumbai"]
            },
          ];

          this.mockAttendees = [
            {
              id: "1",
              name:"Lorena Wendler"
            },
            {
              id: "2",
              name:"Liane Mao"
            },  
            {
              id: "3",
              name:"Emmie Nau"
            },  
            {
              id: "4",
              name:"Bernie Janes"
            },  
            {
              id: "5",
              name:"Rubin Mcclung"
            },  
            {
              id: "6",
              name:"Vina Elzy"
            },  
            {
              id: "7",
              name:"Rana Raasch"
            },  
            {
              id: "8",
              name:"Tyrell Wahlstrom"
            },  
            {
              id: "9",
              name:"Tillie Dixon"
            },  
            {
              id: "10",
              name:"Carolann Holtzclaw"
            },  
            {
              id: "11",
              name:"Lorena Wendler"
            },
            {
              id: "12",
              name:"Liane Mao"
            },  
            {
              id: "13",
              name:"Emmie Nau"
            },  
            {
              id: "14",
              name:"Bernie Janes"
            },  
            {
              id: "15",
              name:"Rubin Mcclung"
            },  
            {
              id: "16",
              name:"Vina Elzy"
            },  
            {
              id: "17",
              name:"Rana Raasch"
            },  
            {
              id: "18",
              name:"Tyrell Wahlstrom"
            },  
            {
              id: "19",
              name:"Tillie Dixon"
            },  
            {
              id: "20",
              name:"Carolann Holtzclaw"
            },  
          ];
    }

    subscribeToUpdates(callback) {
      const subscription = API.graphql(
          graphqlOperation(onUpdateRoom)
      ).subscribe({
        next: (updateData) => callback(updateData.value.data.onUpdateRoom)
      });

      return subscription;
    }

    subscribeToDeletes(callback) {
      const subscription = API.graphql(
          graphqlOperation(onDeleteRoom)
      ).subscribe({
        next: (deleteData) => callback(deleteData.value.data.onDeleteRoom)
      });

      return subscription;
    }

    subscribeToCreates(callback) {
      const subscription = API.graphql(
          graphqlOperation(onCreateRoom)
      ).subscribe({
          next: (createData) => callback(createData.value.data.onCreateRoom)
      });

      return subscription;
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
        let conversations = await API.graphql(graphqlOperation(listRooms));
        let nextToken ;
        let allConversations = []
        do {
            allConversations = allConversations.concat(conversations.data.listRooms.items)
            nextToken = conversations.data.listRooms.nextToken;
            console.log("==>nexttoke "+ nextToken)
            conversations = await API.graphql(graphqlOperation(listRooms, {nextToken}));
            
        } while (nextToken)

        return allConversations;

        } catch (err) {
            console.log("==>err:" + JSON.stringify(err))
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
      try{ 
        await API.graphql(graphqlOperation(createRoom, 
          {input: {
            name: conversation.name,
            description: conversation.description,
            canBeAnalyzed: conversation.canBeAnalyzed,
            keywords: conversation.keywords,
            category: conversation.category,
            meetingID: "blank"
          }}
        ));
      } catch(err) {
        console.error(err);
      }
    }

    getAttendees(roomId) {
      //TODO Connect with the list of room attendees
      return this.mockAttendees;
    }
}

export default ConversationService;
