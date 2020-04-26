const { v4: uuid } = require('uuid');
import uuid from 'uuid';

class ChatService {
    constructor(props) {
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
            ],
            1:  [
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
            ],
            2:  [
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
            ],
            3:  [
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
            ],
            4:  [
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
            ],
            5:  [
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
    }

    getMessagesForConversation(conversationId) {
        return this.mockMessages[conversationId] ? this.mockMessages[conversationId] : [];
    }

    sendMessage(conversationId, user, message) {
        if(this.mockMessages[conversationId]) {
            this.mockMessages[conversationId].push({
                author: user,
                message: message,
                timestamp: Date.now()
            })
        } else {
            this.mockMessages[conversationId] = [{
                author: user,
                message: message,
                timestamp: Date.now()
            }]
        }
    }
}