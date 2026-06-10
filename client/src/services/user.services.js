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
    const res = await api.get(`/user/search?query=${query}`);
    return res.data;
}

export const updateAvatarService = async (formData) => {
    const res = await api.patch('/user/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const deleteAvatarService = async () => {
    const res = await api.delete('/user/avatar');
    return res.data;
};