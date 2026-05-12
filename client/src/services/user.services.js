import api from "../config/api.config"

export const getCurrentUser = async () => {
    const res = await api.get('/user');
    return res.data;
}

export const getChattedUser = async (data) => {
    const res = await api.get('/user/chatted');
    return res.data;
}