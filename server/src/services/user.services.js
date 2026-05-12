import UserModel from "../models/user.model.js";

export const getUserByEmail = async (email) => {
    const userExist = await UserModel.findOne({ email: email })
    return userExist;
}

export const getUserById = async (userId) => {
    const userExist = await UserModel.findOne({ _id: userId }).select("-password");
    return userExist;
}

export const getUserbyPhoneNumber = async (phoneNumber) => {
    const userExist = await UserModel.findOne({ phoneNumber: phoneNumber });
    return userExist;
}