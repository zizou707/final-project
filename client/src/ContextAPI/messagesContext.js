import { createContext , useCallback, useContext, useEffect, useState } from "react";
import { baseUrl , getRequest , postRequest } from "../utils/services";
import { io } from 'socket.io-client' 
import { chatContext } from "./chatContext";

export const messagesContext = createContext();

export default function  MessagesGlobaleState ({children,user}) {
   const [currentChat,setCurrentChat] = useState(null);
   const [messages,setMessages] = useState([]);
   const [isMessagesLoading,setIsMessagesLoading] = useState(false);
   const [messagesError,setMessagesError] = useState(null);
   const [sendMessageTextError,setSendMessageTextError] = useState(null);
   const [newMessage,setNewMessage] = useState(null);
   const [socket,setSocket] = useState(null);
   const [onlineUsers,setOnlineUsers] = useState([]);
   const [notifications,setNotifications] = useState([]);


const { userChats } = useContext(chatContext)
console.log("notifications",notifications);
console.log('currentChat',currentChat);

// initialization socket
useEffect(()=>{
   const newSocket = io("http://localhost:8080/",);
   
   setSocket(newSocket)

  return ()=>newSocket.disconnect()
},[user])

// add Online Users
useEffect(()=>{
   if (socket === null) return
   socket.emit("addNewUser",user?._id)
   socket.on("getOnlineUsers",(res)=>{
      setOnlineUsers(prev=>[...prev,res])
   });
   return ()=>{
      socket.off('getOnlineUsers');
   }
},[socket])

// send messages
useEffect(()=>{
   if (socket === null) return
    
   if (currentChat){
   const recipientId = currentChat?.members.find(id => id !== user?._id)
   socket.emit('sendMessage',{...newMessage,recipientId})
   }
},[newMessage])

// recieve message and notification
useEffect(()=>{
   if (socket === null) return
  
 socket.on("getMessage", res => {

   console.log(res);
   
   if (currentChat?._id !== res.chatId ) return ;

   setMessages(prev => [...prev, res])
 })

 socket.on("getNotification", res => {
  const recieverId = currentChat?.members.find(id=>id !== res.senderId)
  const isChatOpen = onlineUsers.some((u)=>u.userId === recieverId)
        
     if (isChatOpen) { 
      setNotifications(prev => [{...res,isRead:true}, ...prev])
   }else {
      setNotifications(prev => [res, ...prev])
   } 
 }) 

return ()=>{
   socket.off("getMessage");
   socket.off("getNotification")
}   
  
},[socket,currentChat])

   useEffect(()=>{
    const getMessages = async()=>{
             if (currentChat) {
            setIsMessagesLoading(true)
            setMessagesError(null);
                   
            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
            
            setIsMessagesLoading(false)  
               
            if (response.error){ return setMessagesError(response)}

            localStorage.setItem('Messages',JSON.stringify(response))
           
            setMessages(response)  
        
    }}
    getMessages();
  },[currentChat]) 

 /*  const createMessages = useCallback(async(chatId,senderId,recieverId,messageText)=>{

   const response = await postRequest(`${baseUrl}/messages`,({chatId,senderId,recieverId,messageText}))

   if (response.error) { return console.log("Error creating chat... ", response);
   }

   setMessages(prev=>[...prev,response])
},[]) */

const sendMessage = useCallback(
   async(messageText,sender,currentChatId,setMessageText)=>{
   if (!messageText) { return alert("You cant send empty message.")}
 const response =await postRequest(`${baseUrl}/messages`,({chatId:currentChatId,
                                                                    senderId:sender,
                                                                    messageText
                                                                  }))     
  if (response.error) { return setSendMessageTextError(response)}

  setNewMessage(response);
  setMessages(prev=>[...prev,response])
  setMessageText('');
},[])

  const updateCurrentChat = useCallback((chat)=>{
       setCurrentChat(chat)
  },[])
  
   return (<messagesContext.Provider 
    value={{
       messages,isMessagesLoading,messagesError,
       updateCurrentChat,currentChat,
       sendMessage,onlineUsers,
       notifications
    }}
   >
  {children}
   </messagesContext.Provider>)
}
