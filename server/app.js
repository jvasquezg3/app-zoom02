const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    options: {
        cors: '*'
    }
});

const port = 3000;

//Este evento se va discparar cuando detecte que un dispositivo se conecto a socket
io.on('connection', (socket) => {
    socket.on('join', (data) => {// cuando el dispositivo se conecte le decimos que este pendiente cuando se emita un evento join 
        const roomName = data.roomName;
        socket.join(roomName);
        socket.to(roomName).broadcast.emit('new-user', data)//informa que un nuevo usuario se unio

        socket.on('disconnect', () => {
            socket.to(roomName).broadcast.emit('bye-user', data)
        })
    })
})

server.listen(port, () => {
    console.log(`Server running port ${port}`)
});
