import { refreshTokens } from "../services/auth.services.js";
import { verifyJwtToken } from "../services/token.services.js";


export const verifyAuthentication = async (req, res, next) => {
    const accessToken = req.cookies.access_token
    const refreshToken = req.cookies.refresh_token
    req.user = null

    if (!accessToken && !refreshToken) {
        return next();
    }
    if (accessToken) {
        const decodedToken = verifyJwtToken(accessToken)
        req.user = decodedToken;
        return next();
    }
    if (refreshToken) {
        try {
            const { newAccessToken, newRefreshToken, user } = await refreshTokens(refreshToken);

            req.user = user

            const baseConfig = { httpOnly: true, secure: true }

            res.cookie('access_token', newAccessToken, {
                ...baseConfig,
                maxAge: 15 * 60 * 1000     //15min
            })
            res.cookie('refresh_token', newRefreshToken, {
                ...baseConfig,
                maxAge: 10 * 24 * 60 * 60 * 1000
            })
            return next()
        }
        catch (error) {
            console.log(error)
        }
    }
    return next()
}
// export const verifyAuthentication = async (req, res, next) => {
//     const accessToken = req.cookies.access_token
//     const refreshToken = req.cookies.refresh_token
//     req.user = null

//     if (!accessToken && !refreshToken) {
//         return next();
//     }
//     if (accessToken) {
//         const decodedToken = verifyJwtToken(accessToken);
//         console.log("Decoded token from access token: ", decodedToken);
//         req.user = decodedToken;
//         return next();
//     }

//     console.log(req.user)

//     return next();
// }