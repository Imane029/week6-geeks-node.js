const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;


app.use(express.static(path.join(__dirname, 'public')));


const activeUsers = {}; 


io.on('connection', (socket) => {
    console.log(`[USER CONNECTED]: ${socket.id}`);


    socket.on('joinRoom', ({ username, room }) => {
        
        if (activeUsers[socket.id]) return;

        socket.join(room);

       
        activeUsers[socket.id] = { username, room };

        
        socket.emit('message', {
            username: 'System',
            text: `Welcome to the ${room} chat room, ${username}!`,
            timestamp: new Date().toLocaleTimeString(),
            isSystem: true
        });

        
        socket.to(room).emit('message', {
            username: 'System',
            text: `${username} has joined the chat.`,
            timestamp: new Date().toLocaleTimeString(),
            isSystem: true
        });

        
        updateRoomUsers(room);
    });

    
    socket.on('chatMessage', (msg) => {
        const user = activeUsers[socket.id];
        if (user) {
           
            io.to(user.room).emit('message', {
                username: user.username,
                text: msg,
                timestamp: new Date().toLocaleTimeString(),
                isSystem: false,
                isSelf: false 
            });
        }
    });

   
    socket.on('disconnect', () => {
        const user = activeUsers[socket.id];

        if (user) {
            const { username, room } = user;
            
            
            delete activeUsers[socket.id];
            
           
            io.to(room).emit('message', {
                username: 'System',
                text: `${username} has left the chat.`,
                timestamp: new Date().toLocaleTimeString(),
                isSystem: true
            });

            
            updateRoomUsers(room);
        }
        console.log(`[USER DISCONNECTED]: ${socket.id}`);
    });
});

/**
 * Sends an updated list of active users to all clients in a specific room.
 * @param {string} room The room name.
 */
function updateRoomUsers(room) {
    const usersInRoom = Object.values(activeUsers)
        .filter(user => user.room === room)
        .map(user => user.username);
        
    io.to(room).emit('roomUsers', usersInRoom);
}


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/entry.html to start!`);
});