const express = require('express');
const cors = require('cors');
const app = express();
const randomColor = require('randomcolor');
const connect = require('./dbconnect');
const bodyParser = require('body-parser');
const http = require('http');
const server = http.Server(app);
const Chats = require('./schemas/ChatModel');
const socketIO = require('socket.io');
const io = socketIO(server, {     
    cors: {
        origin: "http://localhost:4200",
        credentials: true
      }
});

const port = process.env.PORT || 3000;

app.use(cors());
//bodyparser middleware
app.use(bodyParser.json());

const users = [];
let currentId = 0;

io.on('connection', (socket) => {
    console.log('user connected');
    const color = randomColor();
    socket.username = 'Anonymous';
    socket.color = color;

    socket.on('user added', (user) => {
      console.log(user.name + ' entered the room');
      socket.username = user.name + '@' + user.ip + ':' + user.os + '~' + user.browser;
      socket.id = currentId++;
      users.push({ id: socket.id, username: socket.username, color: socket.color });
      connect.then(db  =>  {
        Chats.find({}).sort({createdAt: 1}).limit(1024).then(chat  =>  {
            const messages = chat;      
            socket.emit('get history', JSON.stringify(messages));
      });})
      io.emit('get users', JSON.stringify(users));
    });

    socket.on('message', msg => {      
      const chatMessage = new Chats({ message: msg, sender: socket.username, color: socket.color });
      connect.then(db => {
        chatMessage.save();
      });
      io.emit('message', JSON.stringify(chatMessage));
    });
  
    socket.on('disconnect', data => {
      const index = users.map(user => { return user.id }).indexOf(socket.id);
      users.splice(index, 1);
      io.emit('get users', JSON.stringify(users));
    });
});

server.listen(port, () => {
    console.log(`server started on port: ${port}`);
});