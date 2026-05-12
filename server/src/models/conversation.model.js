import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    isGroup: {
        type: Boolean,
        default: false,
    },
    groupName: String,
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
})

const ConversationModel = mongoose.model("Conversation", conversationSchema);

export default ConversationModel;