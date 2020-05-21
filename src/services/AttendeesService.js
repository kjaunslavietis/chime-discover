import { subscribeToAttendeeJoinsRoom, subscribeToAttendeeLeavesRoom } from '../graphql/subscriptions';
import { deleteRoomAttendee, createRoomAttendee, updateRoom} from '../graphql/mutations';
import { listRoomAttendees} from '../graphql/queries';
import { API, graphqlOperation, JS } from 'aws-amplify'

class AttendeesService {
    constructor(joinigSubsriptionCallBack, leavingubsriptionCallBack, conversationId) {
        this.conversationId = conversationId;
        this.joinigSubsriptionCallBack = joinigSubsriptionCallBack;
        this.leavingubsriptionCallBack = leavingubsriptionCallBack;
    }

    subscribe() {
        this.subscribeToAttendeeJoinsRoom()
        this.subscribeToAttendeeLeavesRoom()
    }
    unsubscribe() {
        this.joinigSubscription.unsubscribe()
        this.leavingSubscription.unsubscribe()
    }

    subscribeToAttendeeJoinsRoom() {
        if (this.joinigSubscription) {
            this.joinigSubscription.unsubscribe() // unsubscribe to old room events ßif exits
        }
        this.joinigSubscription = API.graphql(
            graphqlOperation(subscribeToAttendeeJoinsRoom, {roomID: this.conversationId})
        ).subscribe({
            next: (room) => {
                this.joinigSubsriptionCallBack(room.value.data.subscribeToAttendeeJoinsRoom.attendeeName)
            },
            error: (error) => {
                console.log("==>err:" + JSON.stringify(error))
            }
        });
    }

    subscribeToAttendeeLeavesRoom() {
        if (this.leavingSubscription) {
            this.leavingSubscription.unsubscribe() // unsubscribe to old room events ßif exits
        }
        this.leavingSubscription = API.graphql(
            graphqlOperation(subscribeToAttendeeLeavesRoom, {roomID: this.conversationId})
        ).subscribe({
            next: (room) => {
                this.leavingubsriptionCallBack(room.value.data.subscribeToAttendeeLeavesRoom.attendeeName)
            },
            error: (error) => {
                console.log("==>err:" + JSON.stringify(error))
            }
        });
    }

    async makeAttendeeLeaveMeeting(attendeeName) {
        await API.graphql(graphqlOperation(deleteRoomAttendee, {input: {attendeeName: attendeeName}}));
    }

    async makeAttendeeJoinMeeting(attendeeName) {
        try {
        await API.graphql(graphqlOperation(deleteRoomAttendee, {input: {attendeeName: attendeeName}}));
        } catch(err) {
            console.log("the attendee was not in a room previously")
        }
        await API.graphql(graphqlOperation(createRoomAttendee, {input: {roomID: this.conversationId, attendeeName: attendeeName}}));
    }

    async gettAttendees() {
        try {
        let data = await API.graphql(graphqlOperation(listRoomAttendees, {filter: {
            roomID: {
                eq: this.conversationId
            }
        }}));
        let nextToken ;
        let allRoomAttendees = []
        
        do {
            allRoomAttendees = allRoomAttendees.concat(data.data.listRoomAttendees.items)
            nextToken = data.data.listRoomAttendees.nextToken;
            data = await API.graphql(graphqlOperation(listRoomAttendees, 
                {
                    filter: {
                        roomID: {
                            eq: this.conversationId
                        }
                    }, 
                    nextToken: nextToken
                }
                ));
            
        } while (nextToken)
        return this.mapAttendeesNames(allRoomAttendees);
        } catch (err) {
            console.log("==>err:" + JSON.stringify(err))
            return []
        }
    }

    mapAttendeesNames(allRoomAttendees) {
        const arr = allRoomAttendees.map(e => {return e.attendeeName})
        return arr
    }

    updateConversationId(newId) {
        console.log("roomId in AttendeesService updated to: ",newId);
        this.conversationId = newId;
        this.subscribeToAttendeeJoinsRoom()
        this.subscribeToAttendeeLeavesRoom()
    }

    async updateRoomAttendeesNames(attendeesNames) {
        if (attendeesNames.length > 0) {
            await API.graphql(graphqlOperation(updateRoom, {input: {id: this.conversationId, attendeesNames: attendeesNames}}));
        } else {
            await API.graphql(graphqlOperation(updateRoom, {input: {id: this.conversationId, attendeesNames: []}}));
        }
        
    }
}

export default AttendeesService;

