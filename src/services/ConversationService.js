class ConversationService {
    constructor() {
        this.mockConvos = [
            {
              name: "Conversation 1",
              description: "Conversation 1 description",
              category: "Conversation 1 category",
              meetingId: "e5102622-6672-4969-b2ca-f689c85d0be1",
              keywords: ["supernatural", "world war two"]
            },
            {
              name: "Conversation 2",
              description: "Conversation 2 description",
              category: "Conversation 2 category",
              meetingId: "439589bf-8dac-4082-b4db-f584cf25d747",
              keywords: ["bigfoot"]
            },
            {
              name: "Conversation 3",
              description: "Conversation 3 description",
              category: "Conversation 3 category",
              meetingId: "439589bf-8dac-4082-b4db-f584cf25d747",
              keywords: []
            },
            {
              name: "Conversation 4",
              description: "Conversationm 4 description",
              category: "Conversation 4 category",
              meetingId: "f073d4c1-bb52-4bcc-90e4-4d2662773bdd",
              keywords: []
            },
            {
              name: "Conversation 5",
              description: "Conversation 5 description",
              category: "Conversation 5 category",
              meetingId: "f29f4436-9f81-484e-9b1e-14eb0dd06728",
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
