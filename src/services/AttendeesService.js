import { subscribeToRoomGettingAttendees } from './../graphql/subscriptions';
import { updateRoom,} from './../graphql/mutations';
import { API, graphqlOperation, JS } from 'aws-amplify'

class AttendeesService {
    constructor(subsriptionCallBack, conversationId) {
        this.conversationId = conversationId;
        this.subsriptionCallBack = subsriptionCallBack;
        this.subscribeToRoom()
    }

    subscribeToRoom() {
        if (this.subscription) {
            this.subscription.unsubscribe() // unsubscribe to old room events ßif exits
        }
        this.subscription = API.graphql(
            graphqlOperation(subscribeToRoomGettingAttendees, {id: this.conversationId})
        ).subscribe({
            next: (room) => {
                this.subsriptionCallBack(room.value.data.subscribeToRoomGettingAttendees.attendeesNames)
            },
            error: (error) => {
                console.log("==>err:" + JSON.stringify(error))
            }
        });
    }

    async updateRoomAttendeesNames(attendeesNames) {
        await API.graphql(graphqlOperation(updateRoom, {input: {id: this.conversationId, attendeesNames: attendeesNames}}));
    }

    updateConversationId(newId) {
        console.log("roomId in AttendeesService updated to: ",newId);
        this.conversationId = newId;
        this.subscribeToRoom()
    }
}

export default AttendeesService;

