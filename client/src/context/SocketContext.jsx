/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import socket from "../config/socket.io";

// SocketContext.jsx
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            console.log("Connecting socket...");
            socket.connect();
        } else {
            console.log("Disconnecting socket...");
            socket.disconnect();
        }

        return () => {
            socket.off("receive_message");
        };
    }, [user]);

    useEffect(() => {
        const handleMessage = (msg) => {
            console.log("Message:", msg);
        };

        socket.on("receive_message", handleMessage);

        return () => {
            socket.off("receive_message", handleMessage);
        };
    }, []);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
