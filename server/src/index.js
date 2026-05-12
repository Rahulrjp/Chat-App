import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import app from './app.js'

dotenv.config()

const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true
    }
})

const userSocketMap = {}; // userId -> socket.id

io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || '');
    const token = cookies.access_token;

    if (!token) {
        return next(new Error('No access token'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded._id;
        next();
    } catch (err) {
        console.log("Invalid token");
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Map userId to socket.id
    userSocketMap[socket.userId] = socket.id;

    console.log("Online Users : ", io.engine.clientsCount, '\n');
    socket.on('send_message', async (data) => {
        const { to, message } = data;
        const targetSocketId = userSocketMap[to];
        const payload = {
            from: socket.userId,
            to: to,
            text: message
        };

        console.log('Received message from', payload.from, 'to', payload.to, ':', message);
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive_message', payload);
            io.to(socket.id).emit('receive_message', payload);
        } else {
            console.log('Recipient not connected');
        }
        // Also emit to sender so they see their own message instantly
        socket.emit('receive_message', payload);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id, '\n');
        delete userSocketMap[socket.userId];
    });
});
const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} 🎉🎉`)
})