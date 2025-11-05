const express = require('express');
const app = express();

const http = require('http');
const express_server = http.createServer(app);

const cors = require('cors');
app.use(cors());

const { Server } = require('socket.io');

const io = new Server(express_server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("message", (data) => {
    const msg = `Message from ${socket.id} : ${data.message} for ${data.reciever}`;
    console.log(msg);

    if (data.reciever) {
      socket.to(data.reciever).emit('message', data.message);
    } else {
      socket.broadcast.emit('message', data.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// ✅ FIX STARTS HERE
const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';

express_server.listen(PORT, HOST, () => {
  console.log(`✅ Server is running on http://${HOST}:${PORT}`);
});
