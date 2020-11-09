const express = require('express');
const cors = require('cors');
const app = express();
const connect = require("./dbconnect");
const bodyParser = require("body-parser");
const chatRouter = require("./routes");
const http = require('http');
const server = http.Server(app);
const Chats = require("./schemas/ChatModel");
const socketIO = require('socket.io');
const Users = require('./schemas/UserModel');
const Chat = require('./schemas/ChatModel');
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

//routes
app.use("/chats", chatRouter);

const users = [];

let currentId = 0;

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on("message", function(msg) {
        console.log(
          "LOG:: message from UserId: " + msg.userId + " --> " + msg.text
        );
        /*const message = {
          ...msg,
          timestamp: new Date()
        };
        messages.push(message);*/
        connect.then(db => {
          console.log("connected to the server");

          let chatMessage = new Chat({ message: msg.text, sender: "Anonymous"});
          chatMessage.save();
        })
        io.emit("message", JSON.stringify(msg));
      });
    
      socket.on("user name added", function(name) {
        console.log("LOG:: user '" + name + "' entered the room");
        
        connect.then(db  =>  {
          Chats.find({}).sort({_id:-1}).limit(1024).then(chat  =>  {
              const messages = chat;      
              socket.emit("get messages history", JSON.stringify(messages));
              console.log(messages)
        });})
        socket.emit("get users list", JSON.stringify(users));
        const newUser = {
          name,
          id: ++currentId,
          isCurrent: false
        };
    
        users.push(newUser);
        socket.emit("my user added", JSON.stringify(newUser));
        io.emit("user name added", JSON.stringify(newUser));
      });
    
      socket.on("disconnect", function(data) {
        console.log("LOG:: user disconnected", socket.username);
      });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});