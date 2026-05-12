import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken, verifyJwtToken } from "./token.services.js";
import { findSessionById } from "./session.services.js";
import { getUserByEmail } from "./user.services.js";

export const hashPassword = async (pass) => {
    return bcrypt.hash(pass, 12)
}

export const verifyPassword = async (pass, hashedPass) => {
    return bcrypt.compare(pass, hashedPass)
}

export const refreshTokens = async (refreshToken) => {
    try {
        const decodedToken = verifyJwtToken(refreshToken)
        const currentSession = await findSessionById(decodedToken.sessionId)

        if (!currentSession) {
            throw new Error("Invalid session")
        }

        const user = await getUserByEmail(currentSession.email)

        if (!user) throw new Error("Invalid user");

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            sessionId: currentSession.sessionId,
        }

        const newAccessToken = createAccessToken(userData)
        const newRefreshToken = createRefreshToken({ sessionId: currentSession.sessionId })

        return { newAccessToken, newRefreshToken, user: userData }

    }
    catch (error) {
        throw new Error("Error generating new tokens: ", error);
    }
}