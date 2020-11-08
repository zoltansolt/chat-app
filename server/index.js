const express = require('express');
const cors = require('cors');
const app = express();

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server, {     
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});

const port = process.env.PORT || 3000;

app.use(cors());
io.on('connection', (socket) => {
    console.log('user connected');
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

io.on('new-message', (message) => {
    io.emit(message);
});