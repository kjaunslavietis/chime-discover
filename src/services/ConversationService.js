class ConversationService {
    constructor() {
        this.mockConvos = [
            {
              name: "Conversation 1",
              description: "Conversation 1 description",
              category: "Conversation 1 category",
              meetingId: "",
              keywords: ["supernatural", "world war two"]
            },
            {
              name: "Conversation 2",
              description: "Conversation 2 description",
              category: "Conversation 2 category",
              meetingId: "AS1Q23EWDS",
              keywords: ["bigfoot"]
            },
            {
              name: "Conversation 3",
              description: "Conversation 3 description",
              category: "Conversation 3 category",
              meetingId: "AWE12QWDSA",
              keywords: []
            },
            {
              name: "Conversation 4",
              description: "Conversationm 4 description",
              category: "Conversation 4 category",
              meetingId: "123EWDQSAXC123",
              keywords: []
            },
            {
              name: "Conversation 5",
              description: "Conversation 5 description",
              category: "Conversation 5 category",
              meetingId: "1234MM1234123",
              keywords: ["spongebob", "religion", "mumbai"]
            },
          ]
    }

    getAllConversations() {
        return this.mockConvos;
    }
    
    createConversation(conversation) {
        this.mockConvos.push(conversation);
    }
}

export default ConversationService;
