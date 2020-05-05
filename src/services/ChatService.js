import { listChatMessages } from './../graphql/queries';
import { subscribeToGiveRoom } from './../graphql/subscriptions';
import { createChatMessage,} from './../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify'

class ChatService {
    constructor(subsriptionCallBack, conversationId, senderName) {
        this.conversationId = conversationId;
        this.senderName = senderName;
        this.subsriptionCallBack = subsriptionCallBack;
        const subscription = API.graphql(
            graphqlOperation(subscribeToGiveRoom, {roomID: conversationId})
        ).subscribe({
            next: (chatMessage) => {
                if (chatMessage.value.data.subscribeToGiveRoom.senderName !== this.senderName)
                    subsriptionCallBack(chatMessage.value.data.subscribeToGiveRoom)
            },
            error: (error) => {
                console.log("==>err:" + JSON.stringify(error))
            }
        });
    }

    async getMessagesForConversation() {
        try {
        let messages = await API.graphql(graphqlOperation(listChatMessages));
        let nextToken ;
        let allMessages = []
        do {
            allMessages = allMessages.concat(messages.data.listChatMessages.items)
            nextToken = messages.data.listChatMessages.nextToken;
            messages = await API.graphql(graphqlOperation(listChatMessages, {nextToken}));
            
        } while (nextToken)
        return this.filterAndSort(allMessages);
        } catch (err) {
            console.log("==>err:" + JSON.stringify(err))
            return []
        }
    }

    filterAndSort(allMessages) {
        const filteredAndSortedMessages = allMessages.filter(element => element.roomID === this.conversationId).sort((a,b) => {
            var dateA = new Date(a.createdAt), dateB = new Date(b.createdAt);
            return dateA - dateB
        })
        return filteredAndSortedMessages
    }

    async createMessage(message) {
        await API.graphql(graphqlOperation(createChatMessage, {input: message}));
    }
}

export default ChatService;