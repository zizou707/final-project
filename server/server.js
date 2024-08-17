const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes')
const { default: mongoose } = require('mongoose');
const { Server } = require('socket.io')
const cors = require('cors')

const app = express();

const PORT = process.env.PORT || 4000 ;

// middleware
app.use(express.json());
app.use(cors())
app.use(express.static('./client/Assets'));


  app.use(express.urlencoded({extended: true}))
app.use((req, res, next) => {
    next()
  }) 

  // routes

app.use('/users', userRoutes)
app.use('/users/chats', chatRoutes)
app.use('/users/messages',messageRoutes)

// connect to db

try {
  mongoose.connect(process.env.MONGO_URI)
 var server = app.listen(PORT,()=>console.log(`Connected to DB & server is running at port : ${PORT}`))
} catch (error) {
   console.log(error);
}

// init socket
var io =new Server({cors:  "http://localhost:4000/" })


let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new connection " , socket.id);

// listen to a connection  
  socket.on("addNewUser",(userId)=>{
    !onlineUsers.some(user => user.userId === userId ) &&
       onlineUsers.push({
          userId,
          socketId:socket.id
       })
       console.log("onlineUsers : " , onlineUsers);
   io.emit("getOnlineUsers",onlineUsers)    
  })
// add message
socket.on("sendMessage",(message)=>{
  
  /* const user =  onlineUsers.find((u) => u.userId === message.recipientId )
  console.log(user); 
  
    if (user) {  */
      io.sockets.emit("getMessage",message)
          io.sockets.emit("getNotification",{
         senderId : message.senderId,
         isRead : false,
         date: new Date()
      }) 

  }  
 )   
  socket.on('disconnect',()=>{
     onlineUsers = onlineUsers.filter(u=>u.socketId !== socket.id)
     io.emit("getOnlineUsers",onlineUsers)
  })
})
io.listen(8080)