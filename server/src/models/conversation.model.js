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
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        },
        message: {
            type: String,
        }
    },
}, { timestamps: true });

const ConversationModel = mongoose.model("Conversation", conversationSchema);

export default ConversationModel;