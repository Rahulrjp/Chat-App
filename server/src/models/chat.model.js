import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: String,
    attachments: [{
        url: String,
        publicId: String // file URLs (images, videos, etc.)
    }],
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    deliveredTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;
