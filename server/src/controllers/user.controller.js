import UserModel from "../models/user.model.js";
import { hashPassword, verifyPassword } from "../services/auth.services.js";
import { getUserByEmail, getUserById } from "../services/user.services.js";

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

export const getChattedUser = async (req, res) => {
    const { userIds } = req.body;

    try {
        const users = await Promise.all(
            userIds?.map(async (userId) => {
                const user = await getUserById(userId);
                return {
                    id: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                };
            })
        );

        res.status(200).json({ chattedWith: users });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const searchUser = async (req, res) => {
    const { email } = req.body
    const user = await getUserByEmail(email)
    if (user) return res.status(200).json({ message: "user found", user })
    return res.status(400).json({ message: 'user not found' })
}

export const addToChattedUser = async (req, res) => {
    const { user, searchedUser, chattedUsers } = req.body;
    console.log("ADD to chad user", user)
    try {
        const op1 = await UserModel.updateOne({ email: user.email }, { $set: { chattingWith: chattedUsers } })
        const x = searchedUser?.chattingWith
        x.push(user._id)
        const op2 = await UserModel.updateOne({ email: searchedUser.email }, { $set: { chattingWith: x } })
        console.log(op1)
        console.log(op2)
        return res.status(200).json({ message: 'chat added successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'chat adding failed' })
    }
}
