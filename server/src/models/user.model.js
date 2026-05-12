import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        url: { type: String },
        publicId: { type: String }, //Cloudinary public id for image management
    },
    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },
    lastseen: {
        type: Date,
    },
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;