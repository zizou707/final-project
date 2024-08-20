const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const { default: mongoose } = require('mongoose');
const { Server } = require('socket.io')
const cors = require('cors');
const requireAuth = require('./middleware.js/requireAuth');

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
app.use('/users/notifications',notificationRoutes)

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
// add message and notifications
socket.on("sendMessage",(message)=>{
  async function socketIo(){ 
const user = await onlineUsers.find((u) => u.userId === message.recipientId )
  
    if (user) {  
      io.to(user.socketId).emit("getMessage",message)
      io.to(user.socketId).emit("getNotification",{
                  senderId : message.senderId,
                  recieverId : message.recipientId,
                  message : message.messageText,
                  isRead : false,
                  date: new Date()
                })   
  }  } socketIo();
})  
  socket.on('disconnect',()=>{
     onlineUsers = onlineUsers.filter(u=>u.socketId !== socket.id)
     io.emit("getOnlineUsers",onlineUsers)
  })
} )

io.listen(8080)