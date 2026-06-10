import api from "../config/api.config"

export const getMessages = async () => {
    const res = await api.get("/chat");
    return res.data;
}

export const uploadAttachmentService = async (formData) => {
    const res = await api.post("/chat/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

export const deleteMessageService = async (messageId) => {
    const res = await api.delete(`/chat/message/${messageId}`);
    return res.data;
};

export const deleteMultipleMessagesService = async (messageIds) => {
    const res = await api.post(`/chat/delete-multiple`, { messageIds });
    return res.data;
};

export const clearChatService = async (conversationId) => {
    const res = await api.delete(`/chat/clear/${conversationId}`);
    return res.data;
};