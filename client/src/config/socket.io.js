import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    withCredentials: true,
    auth: {
        token: "access_token"
    },
    autoConnect: false
});

// socket.on("connect_error", async (err) => {
//     if (err.message === "Unauthorized") {
//         try {
//             await axios.post("/api/auth/refresh", {}, {
//                 withCredentials: true,
//             });

//             socket.connect();
//         } catch {
//             console.log("User needs to login again");
//         }
//     }
// });

export default socket;