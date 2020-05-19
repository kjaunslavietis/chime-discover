import { API, graphqlOperation } from 'aws-amplify'
import { listRooms, getRoom} from './../graphql/queries'
import { createRoom, updateRoom} from './../graphql/mutations'
import { onCreateRoom, onUpdateRoom, onDeleteRoom } from './../graphql/subscriptions';

class ConversationService {
    constructor() {
    }

    subscribeToUpdates(callback) {
      const subscription = API.graphql(
          graphqlOperation(onUpdateRoom)
      ).subscribe({
        next: (updateData) => {
          console.log(`updateData: ${JSON.stringify(updateData)}`)
          callback(updateData.value.data.onUpdateRoom)
        }
        
      });

      return subscription;
    }

    subscribeToDeletes(callback) {
      const subscription = API.graphql(
          graphqlOperation(onDeleteRoom)
      ).subscribe({
        next: (deleteData) => {
          console.log(`deleteData: ${JSON.stringify(deleteData)}`)
          callback(deleteData.value.data.onDeleteRoom)
        }
      });

      return subscription;
    }

    subscribeToCreates(callback) {
      const subscription = API.graphql(
          graphqlOperation(onCreateRoom)
      ).subscribe({
          next: (createData) => {
            console.log(`createData: ${JSON.stringify(createData)}`)
            callback(createData.value.data.onCreateRoom)
          }
      });

      return subscription;
    }

    async getConversation(id) {
      //TODO test
      try { 
        const conversation = await API.graphql(graphqlOperation(getRoom, {id: id}));
        return conversation.data.getRoom;
      } catch(err) {
        console.error(err);
        return null;
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
            imageUrl: conversation.imageUrl,
            meetingID: "blank",
            ExternalUserId: []
          }}
        ));
      } catch(err) {
        console.error(err);
      }
    }
}

export default ConversationService;
