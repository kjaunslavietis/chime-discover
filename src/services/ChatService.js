import { listChatMessages } from './../graphql/queries';
import { onCreateChatMessage } from './../graphql/subscriptions';
import { createChatMessage,} from './../graphql/mutations';



import { API, graphqlOperation } from 'aws-amplify'

const { v4: uuid } = require('uuid');

class ChatService {
    constructor(subsriptionCallBack, conversationId, senderName) {
        this.mockMessages = {
            0: [
                {
                    author: uuid(),
                    message: 'hello1', 
                    timestamp: 3124112123412
                },
                {
                    author: uuid(),
                    message: 'hello2', 
                    timestamp: 312412417
                },
                {
                    author: uuid(),
                    message: 'hello3', 
                    timestamp: 312531244123412
                },
                {
                    author: uuid(),
                    message: 'hello4', 
                    timestamp: 31241243462
                },
                {
                    author: uuid(),
                    message: 'hello5', 
                    timestamp: 3124756345636346
                },
                {
                    author: uuid(),
                    message: 'hello6', 
                    timestamp: 31241123123123123123
                },
            ]
        }
        this.conversationId = conversationId;
        this.senderName = senderName;
        this.subsriptionCallBack = subsriptionCallBack;
        const subscription = API.graphql(
            graphqlOperation(onCreateChatMessage)
        ).subscribe({
            next: (chatMessage) => {
                console.log("==> chat messages" + JSON.stringify(chatMessage))
                if (chatMessage.value.data.onCreateChatMessage.roomID === this.conversationId &&
                    chatMessage.value.data.onCreateChatMessage.senderName !== this.senderName)
                    subsriptionCallBack(chatMessage.value.data.onCreateChatMessage)
            },
            error: (error) => {
                console.log(error)
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
            console.log("==>nexttoke "+ nextToken)
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
        console.log("==>filtered" + JSON.stringify(filteredAndSortedMessages))
        return filteredAndSortedMessages
    }

    async createMessage(message) {
        await API.graphql(graphqlOperation(createChatMessage, {input: message}));
    }
}

export default ChatService;