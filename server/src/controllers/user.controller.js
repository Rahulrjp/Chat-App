import ConversationModel from "../models/conversation.model.js";
import UserModel from "../models/user.model.js";
import { hashPassword, verifyPassword } from "../services/auth.services.js";
import { getUserByEmail, getUserById } from "../services/user.services.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const getUser = async (req, res) => {

    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const userData = await getUserById(user._id);
        return res.status(200).json({ user: userData });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword, user } = req.body
    try {
        const currentUser = await getUserById(user._id)
        console.log("Get User", currentUser)
        console.log("is Matched ? : ", await verifyPassword(oldPassword, currentUser.password))
        if (await verifyPassword(oldPassword, currentUser.password)) {
            const updated = await UserModel.updateOne({ email: currentUser.email }, { $set: { password: await hashPassword(newPassword) } });
            console.log("Updated : ", updated)
            return res.status(200).json({ message: "Password changed successfully" })
        }
        return res.status(400).json({ message: "Incorrect old password" })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

export const changeName = async (req, res) => {
    const { firstName, lastName, user } = req.body
    try {
        const getUser = await getUserById(user._id)
        console.log("getUser : ", getUser)
        const updated = await UserModel.updateOne({ email: getUser.email }, { $set: { firstName: firstName, lastName: lastName } });
        return res.status(200).json({ message: 'Name changed successfully' })
    } catch (error) {
        return res.status(400).json({ message: error })
    }
}

export const getConversations = async (req, res) => {
    const { _id } = req.user;
    try {
        const conversations = await ConversationModel.find({ members: { $in: [_id] } })
            .populate("members", "name email avatar status lastseen")
            .sort({ updatedAt: -1 });
        console.log("Conversations : ", conversations);
        res.status(200).json({ conversations });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const searchUser = async (req, res) => {
    const { query } = req.query;
    console.log("Query : ", query);

    const isEmail = query.includes("@");
    console.log("Is Email : ", isEmail);
    try {
        const user = isEmail
            ? [await getUserByEmail(query)]
            : await UserModel.find({
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { email: { $regex: query, $options: "i" } }
                ]
            }).select("-password");

        console.log("User : ", user);
        return res.status(200).json({ message: "user found", user });
    } catch (error) {
        return res.status(400).json({ message: 'No user found' });
    }
}

export const createConversation = async (req, res) => {
    const { id } = req.body;
    const { _id } = req.user;
    console.log("ADD to chad user", _id)
    try {

        const conversation = ConversationModel.create({
            members: [_id, id],
            isGroup: false,
            // lastMessage: "",
        });

        return res.status(200).json({ message: 'chat added successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'chat adding failed' })
    }
}

export const updateAvatar = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const currentUser = await UserModel.findById(user._id);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer, "avatars");

        if (currentUser.avatar && currentUser.avatar.publicId) {
            try {
                await deleteFromCloudinary(currentUser.avatar.publicId, currentUser.avatar.url);
            } catch (err) {
                console.error("Failed to delete old avatar from Cloudinary:", err);
            }
        }

        currentUser.avatar = {
            url: uploadResult.url,
            publicId: uploadResult.publicId
        };
        await currentUser.save();

        return res.status(200).json({
            message: "Avatar updated successfully",
            avatar: currentUser.avatar
        });
    } catch (error) {
        console.error("Update avatar error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteAvatar = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const currentUser = await UserModel.findById(user._id);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (currentUser.avatar && currentUser.avatar.publicId) {
            try {
                await deleteFromCloudinary(currentUser.avatar.publicId, currentUser.avatar.url);
            } catch (err) {
                console.error("Failed to delete avatar from Cloudinary:", err);
            }
        }

        currentUser.avatar = {
            url: "",
            publicId: ""
        };
        await currentUser.save();

        return res.status(200).json({
            message: "Avatar deleted successfully",
            avatar: currentUser.avatar
        });
    } catch (error) {
        console.error("Delete avatar error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
