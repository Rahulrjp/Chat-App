import api from "../config/api.config"

export const registerUser = async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
}

export const loginUser = async (data) => {
    const res = await api.post('/auth/login', data);
    console.log("Login Api : ", res.data);
    return res.data;
}

export const verifyUser = async () => {
    const res = await api.get('/auth/verify');
    return res.data;
}

export const logoutUser = async () => {
    const res = await api.get('/auth/logout');
    return res.data;
}