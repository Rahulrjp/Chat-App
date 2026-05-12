import { createServer } from 'http';
import { Server } from 'socket.io';
import app from '../app.js';

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });
});

//Not used anywhere yet, but can be used in future for scaling the app with socket.io-redis adapter