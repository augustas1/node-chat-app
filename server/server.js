const path = require('path');
const http = require('http');
const express = require("express");
const socketIO = require("socket.io");
const Chat = require("./utils/chat").Chat;
const isRealString = require("./utils/validation").isRealString;
const {generateMessage, generateLocationMessage} = require("./utils/message");

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const chat = new Chat();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connection');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        chat.removeUser(socket.id);
        chat.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', chat.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room)
            .emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        const user = chat.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback('');
    });

    socket.on('createLocationMessage', (coords) => {
        const user = chat.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        const user = chat.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', chat.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});