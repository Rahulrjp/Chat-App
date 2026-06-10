import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import app from './app.js'
import ChatModel from './models/chat.model.js'
import ConversationModel from './models/conversation.model.js'

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
            data: message
        };

        try {
            const chat = await ChatModel.create({
                conversationId: payload.data.conversationId,
                sender: socket.userId,
                text: payload.data.text,
                attachments: payload.data.attachments && payload.data.attachments.length > 0
                    ? payload.data.attachments.map(att => ({
                        url: att.url,
                        publicId: att.publicId || "",
                        type: att.type
                    }))
                    : (payload.data.media ? [{
                        url: payload.data.media,
                        publicId: payload.data.publicId || "",
                        type: payload.data.type
                    }] : []),
                seenBy: [socket.userId],
                deliveredTo: [to]
            });

            await ConversationModel.findByIdAndUpdate(
                message.conversationId,
                {
                    $set: {
                        lastMessage: {
                            chatId: chat._id,
                            message: message.text ? message.text : payload.data?.attachments?.length === 1 ? payload.data.attachments[0].type === "video" ? "🎥 Video" : payload.data.attachments[0].type === "image" ? "📸 Photo" : "📎 Attachment" : `📎 ${payload.data.attachments?.length} attachments`,
                        }
                    },
                }
            );


            if (chat) {
                console.log("Message saved to database");

                const tempId = message.id;
                payload.data.id = chat._id;
                payload.data.tempId = tempId;
            } else {
                console.log("No chat found between users");
            }
        } catch (error) {
            console.log(error);
        }

        console.log('Received message from', payload.from, 'to', payload.to, ':', message);
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive_message', payload);
            console.log('Message is delivered');
        } else {
            console.log('Recipient not connected');
        }
        // Also emit to sender so they see their own message instantly
        socket.emit('receive_message', payload);
    });

    socket.on('delete_message', (data) => {
        const { to, messageId } = data;
        const targetSocketId = userSocketMap[to];
        if (targetSocketId) {
            io.to(targetSocketId).emit('message_deleted', { from: socket.userId, messageId });
        }
    });

    socket.on('delete_multiple_messages', (data) => {
        const { to, messageIds } = data;
        const targetSocketId = userSocketMap[to];
        if (targetSocketId) {
            io.to(targetSocketId).emit('multiple_messages_deleted', { from: socket.userId, messageIds });
        }
    });

    socket.on('clear_chat', (data) => {
        const { to, conversationId } = data;
        const targetSocketId = userSocketMap[to];
        if (targetSocketId) {
            io.to(targetSocketId).emit('chat_cleared', { from: socket.userId, conversationId });
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id, '\n');
        delete userSocketMap[socket.userId];
    });
});
const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} 🎉🎉`)
})