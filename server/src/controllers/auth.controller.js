import { createSession } from "../services/session.services.js";
import { createAccessToken, createRefreshToken } from "../services/token.services.js";
import { getUserByEmail, getUserbyPhoneNumber } from "../services/user.services.js";
import { createSessionId } from "../utils/random.js";
import UserModel from "../models/user.model.js";
import { hashPassword, verifyPassword } from "../services/auth.services.js";

export const createUser = async (req, res) => {
    console.log("createUser req.body : ", req.body)
    const { name, email, password, phoneNumber } = req.body;
    try {
        const userExist = await getUserByEmail(email);

        console.log("User exist : ", userExist)
        if (!userExist) {
            const user = await UserModel.create({ name, email: email.toLowerCase(), password: await hashPassword(password), phoneNumber })
            console.log("User created successfully : ", user)
            await authenticateUser(req, res, user);
            return res.status(201).json({ message: "User created successfully", user: user })
        }
        return res.status(400).json({ message: "User already exists" })
    }
    catch (error) {
        console.log("Error creating user : ", error);
        return res.status(500).json({ errors: error })
    }
}

export const loginUser = async (req, res) => {
    if (req.user) {
        return res.status(200).json({ message: "User already logged in", user: req.user })
    }

    console.log("Login controller req.body : ", req.body)
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!(await verifyPassword(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const accessToken = await authenticateUser(req, res, user);
    req.user = user;
    console.log("Running : ", accessToken);
    return res.status(200).json({ message: "Logged in successfully", user, accessToken })
}

export const logout = async (req, res) => {
    const baseConfig = { httpOnly: true, secure: true }
    // await clearSession(req.user.sessionId)
    res.clearCookie('access_token', { ...baseConfig })
    res.clearCookie('refresh_token', { ...baseConfig })
    res.status(200).json({ message: 'logout successfully' })
}

export const verifyAuth = async (req, res) => {
    console.log("verifyAuth req.user : ", req.user)
    if (req.user) {
        return res.status(200).json({ isLoggedIn: true, user: req.user });
    }
    return res.status(401).json({ isLoggedIn: false, message: "User not authenticated" });
}

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export const sendOtp = async (req, res) => {
    // const { phone } = req.body;
    // try {
    //     const verification = await client.verify.v2.services(process.env.VERIFY_SERVICE_SID)
    //         .verifications
    //         .create({ to: phone, channel: 'sms' });
    //     return res.status(200).json({ message: "otp sent successfully", verification })
    // } catch (error) {
    //     res.status(500).json({ message: 'failed to send otp', error: error.message })
    // }
}

export const verifyOtp = async (req, res) => {
    // const { phone, otp, user } = req.body;

    // try {
    //     const verificationCheck = await client.verify.v2.services(process.env.VERIFY_SERVICE_SID)
    //         .verificationChecks
    //         .create({ to: phone, code: otp })
    //     await UserModel.updateOne({ _id: user._id }, { $set: { phone: Number(phone) } })
    //     return res.status(200).json({ message: 'verified successfully', verificationCheck })
    // } catch (error) {
    //     return res.status(500).json({ message: 'verification failed', error: error.message })
    // }
}

export const authenticateUser = async (req, res, user) => {
    const session = await createSession({
        sessionId: createSessionId(),
        email: user.email,
        userAgent: req.headers['user-agent'],
        ip: req.clientIp || req.ip
    })


    const accessToken = createAccessToken({
        _id: user._id,
        name: user.name,
        email: user.email,
        sessionId: session.sessionId
    })

    const refreshToken = createRefreshToken({
        sessionId: session?.sessionId
    })

    const baseConfig = { httpOnly: true, secure: false, sameSite: "None" } // secure is false for local development, must be true in production

    res.cookie('access_token', accessToken, {
        ...baseConfig,
        maxAge: 15 * 60 * 1000     //15min
    })

    res.cookie('refresh_token', refreshToken, {
        ...baseConfig,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return accessToken;
}