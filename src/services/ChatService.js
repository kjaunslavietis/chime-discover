import { listChatMessages } from './../graphql/queries';
import { onCreateChatMessage } from './../graphql/subscriptions';
import { createChatMessage,} from './../graphql/mutations';



import { API, graphqlOperation } from 'aws-amplify'

const { v4: uuid } = require('uuid');

class ChatService {
    constructor(subsriptionCallBack, conversationId) {
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
        this.subsriptionCallBack = subsriptionCallBack;
        const subscription = API.graphql(
            graphqlOperation(onCreateChatMessage)
        ).subscribe({
            next: (chatMessage) => {
                console.log("==> chat messages" + JSON.stringify(chatMessage))
                if (chatMessage.value.data.onCreateChatMessage.roomID !== conversationId)
                    subsriptionCallBack(chatMessage.value.data.onCreateChatMessage)
            },
            error: (error) => {
                console.log(error)
            }
        });
    }

    async getMessagesForConversation(conversationId) {
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
        return allMessages;
        } catch (err) {
            console.log("==>err:" + JSON.stringify(err))
        }
    }

    async createMessage(message) {
        await API.graphql(graphqlOperation(createChatMessage, {input: message}));
    }
}

export default ChatService;