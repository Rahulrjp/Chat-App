import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}/api`,
    withCredentials: true,
})

// let isRefreshing = false;

// api.interceptors.response.use(
//     (res) => res,
//     async (err) => {
//         const originalRequest = err.config;

//         if (err.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 if (!isRefreshing) {
//                     isRefreshing = true;

//                     await api.post("/api/auth/refresh");

//                     // reconnect socket
//                     if (socket.connected) socket.disconnect();
//                     socket.connect();

//                     isRefreshing = false;
//                 }

//                 return api(originalRequest); // retry original request

//             } catch (refreshErr) {
//                 isRefreshing = false;
//                 console.log("Refresh failed");
//             }
//         }

//         return Promise.reject(err);
//     }
// );

export default api;