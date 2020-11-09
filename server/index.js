const express = require('express');
const cors = require('cors');
const app = express();

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server, {     
    cors: {
        origin: "http://localhost:4200",
        credentials: true
      }
});

const port = process.env.PORT || 3000;

app.use(cors());

// Will be in db in real world
const users = [];
const messages = [];
let currentId = 0;

io.on('connection', (socket) => {
    console.log('user connected');
    socket.emit("get users list", JSON.stringify(users));
    socket.emit("get messages history", JSON.stringify(messages));

    socket.on("message", function(msg) {
        console.log(
          "LOG:: message from UserId: " + msg.userId + " --> " + msg.text
        );
        const message = {
          ...msg,
          timestamp: new Date()
        };
        messages.push(message);
        io.emit("message", JSON.stringify(message));
      });
    
      socket.on("user name added", function(name) {
        console.log("LOG:: user '" + name + "' entered the room");
        const newUser = {
          name,
          id: ++currentId,
          isCurrent: false
        };
    
        users.push(newUser);
        socket.emit("my user added", JSON.stringify(newUser));
        io.emit("user name added", JSON.stringify(newUser));
      });
    
      socket.on("disconnect", function() {
        console.log("LOG:: user disconnected");
      });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});