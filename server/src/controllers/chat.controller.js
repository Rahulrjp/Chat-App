import ChatModel from "../models/chat.model.js";

export const storeChatData = async (req, res) => {
    const { senderId, recieverId, message, sessionId, timestamp } = req.body;

    try {
        const chatData = await ChatModel.create({
            senderId,
            recieverId,
            message,
            sessionId,
            timestamp
        });

        return res.status(200).json({ message: "Chat data stored successfully", chatData });
    } catch (error) {
        console.error("Error storing chat data:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const getChatData = async (req, res) => {
    try {
        const chatData = await ChatModel.find();
        return res.status(200).json({ message: "Chat data fetched successfully", chatData });
    } catch (error) {
        console.error("Error fetching chat data:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const getUserChat = async (req, res) => {
    const userId = req.params.id
    console.log("User ID:", req.params);
    try {
        const userChat = await ChatModel.find({ senderId: userId });
        console.log("User chat data:", userChat);
        return res.status(200).json({ message: "User chat fetched successfully", userChat });
    }
    catch (error) {
        console.error("Error fetching user chat:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const deleteChats = async (req, res) => {
    const { user1, user2 } = req.body;
    try {
        await ChatModel.deleteMany({ senderId: user1._id, recieverId: user2.id });
        await ChatModel.deleteMany({ senderId: user2.id, recieverId: user1._id });
        return res.status(200).json({ message: 'chats deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting chats', error })
    }
}