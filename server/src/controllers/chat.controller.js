import ChatModel from "../models/chat.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

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

export const getMessages = async (req, res) => {
    try {
        const messages = await ChatModel.find();
        // console.log("Messeges : ", messages);
        return res.status(200).json({ message: "Messages fetched successfully", messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const getUserChat = async (req, res) => {
    const userId = req.params.id;
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

export const uploadAttachment = async (req, res) => {
    try {
        const files = req.files || (req.file ? [req.file] : []);
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files provided" });
        }

        if (files.length > 5) {
            return res.status(400).json({ message: "You can upload up to 5 files only" });
        }

        // Upload all buffers in parallel to Cloudinary
        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer));
        const uploadResults = await Promise.all(uploadPromises);

        const attachments = uploadResults.map(result => ({
            url: result.url,
            publicId: result.publicId
        }));

        return res.status(200).json({
            message: "Files uploaded successfully",
            attachments,
            // Fallback properties for older client versions
            url: attachments[0]?.url,
            publicId: attachments[0]?.publicId
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ message: "File upload failed", error: error.message });
    }
}

export const deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const message = await ChatModel.findById(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Delete attachments from Cloudinary if they exist
        if (message.attachments && message.attachments.length > 0) {
            for (const att of message.attachments) {
                if (att.publicId) {
                    try {
                        await deleteFromCloudinary(att.publicId, att.url);
                    } catch (err) {
                        console.error("Failed to delete attachment from Cloudinary:", err);
                    }
                }
            }
        }

        await ChatModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Message deleted successfully", messageId: id });
    } catch (error) {
        console.error("Error deleting message:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const deleteMultipleMessages = async (req, res) => {
    const { messageIds } = req.body;
    try {
        if (!Array.isArray(messageIds) || messageIds.length === 0) {
            return res.status(400).json({ message: "Invalid message IDs provided" });
        }

        // Find messages to delete their attachments
        const messages = await ChatModel.find({ _id: { $in: messageIds } });
        for (const msg of messages) {
            if (msg.attachments && msg.attachments.length > 0) {
                for (const att of msg.attachments) {
                    if (att.publicId) {
                        try {
                            await deleteFromCloudinary(att.publicId, att.url);
                        } catch (err) {
                            console.error("Failed to delete attachment from Cloudinary:", err);
                        }
                    }
                }
            }
        }

        await ChatModel.deleteMany({ _id: { $in: messageIds } });
        return res.status(200).json({ message: "Messages deleted successfully", messageIds });
    } catch (error) {
        console.error("Error deleting multiple messages:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const clearChat = async (req, res) => {
    const { conversationId } = req.params;
    try {
        // Find messages to delete their attachments
        const messages = await ChatModel.find({ conversationId });
        for (const msg of messages) {
            if (msg.attachments && msg.attachments.length > 0) {
                for (const att of msg.attachments) {
                    if (att.publicId) {
                        try {
                            await deleteFromCloudinary(att.publicId, att.url);
                        } catch (err) {
                            console.error("Failed to delete attachment from Cloudinary:", err);
                        }
                    }
                }
            }
        }

        await ChatModel.deleteMany({ conversationId });
        return res.status(200).json({ message: "Chat cleared successfully", conversationId });
    } catch (error) {
        console.error("Error clearing chat:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}