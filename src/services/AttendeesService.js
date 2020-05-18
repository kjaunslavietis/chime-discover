import { subscribeToRoomGettingAttendees } from './../graphql/subscriptions';
import { updateRoom,} from './../graphql/mutations';
import { API, graphqlOperation, JS } from 'aws-amplify'

class AttendeesService {
    constructor(subsriptionCallBack, conversationId) {
        this.conversationId = conversationId;
        this.subsriptionCallBack = subsriptionCallBack;
        const subscription = API.graphql(
            graphqlOperation(subscribeToRoomGettingAttendees, {id: conversationId})
        ).subscribe({
            next: (room) => {
                subsriptionCallBack(room.value.data.subscribeToRoomGettingAttendees.attendeesNames)
            },
            error: (error) => {
                console.log("==>err:" + JSON.stringify(error))
            }
        });
    }

    async updateRoomAttendeesNames(attendeesNames) {
        await API.graphql(graphqlOperation(updateRoom, {input: {id: this.conversationId, attendeesNames: attendeesNames}}));
    }
}

export default AttendeesService;

