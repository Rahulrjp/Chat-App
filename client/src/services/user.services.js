import api from "../config/api.config"

export const getCurrentUser = async () => {
    const res = await api.get('/user');
    return res.data;
}

export const getConversations = async (data) => {
    const res = await api.get('/user/conversations');
    return res.data;
}

export const createConversation = async (data) => {
    const res = await api.post('/user/conversations', data);
    return res.data;
}

export const searchUser = async (query) => {
    console.log("Searching....", query);
    const res = await api.get(`/user/search?query=${query}`);
    return res.data;
}