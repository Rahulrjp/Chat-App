import jwt from 'jsonwebtoken';

export const createAccessToken = ({ _id, name, email, sessionId }) => {
    return jwt.sign({ _id, name, email, sessionId }, process.env.JWT_SECRET, {
        expiresIn: '15m'
    })
}

export const createRefreshToken = ({ sessionId }) => {
    return jwt.sign({ sessionId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

export const verifyJwtToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}