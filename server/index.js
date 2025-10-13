const express = require('express');
const app = express();


//we have to do http handshake for socket io
const http = require('http');
const express_server = http.createServer(app);


//socket.io server programming starts here 
//setup cors 
const cors = require('cors');
app.use(cors());

//setting up socket.io
const { Server } = require('socket.io');

const io = new Server(express_server, {
    cors:{
        origin:"*", //we'll use * for now but in production we should use our client url example http://amazon.com or http://myapp.com 
        methods:["GET", "POST"]
    }
})

//listen on every connection
//event handlers -> emit, on 
//predefined events -> connection, disconnect
io.on("connection",
    (socket)=>{
        console.log(`User connected: ${socket.id}`);

        //Join a room
        socket.on("join_room", (room)=>{
            socket.join(room);
            console.log(`User with ID: ${socket.id} joined room: ${room}`);
        })


        //Recieve the 'message' from the client
        socket.on('message', (data)=>{

            const msg = `Message from ${socket.id} : ${data.message} for ${data.reciever}`;
            console.log(msg);
            //Broadcast the message to all the clients except the sender
            // socket.broadcast.emit('message', msg)
            

            
            //Send to specific client
            if(data.reciever){
                socket.to(data.reciever).emit('message', data.message);
            }else{
                socket.broadcast.emit('message', data.message)
            }
        })


    }
)

app.get("/", (req, res)=>{
    res.send("Hello World");
})


express_server.listen(3000, () => {
  console.log('Server is running on port 3000');
});