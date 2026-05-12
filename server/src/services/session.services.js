import SessionModel from '../models/session.model.js';

export const createSession = async ({ sessionId, email, userAgent, ip }) => {
    const session = await SessionModel.create({ sessionId, email, userAgent, ip })
    return session;
}

export const findSessionById = async (sessionId) => {
    const session = await SessionModel.findOne({ sessionId: sessionId });
    return session;
}

export const clearSession = async (sessionId) => {
    return SessionModel.deleteMany({ sessionId: sessionId })
};