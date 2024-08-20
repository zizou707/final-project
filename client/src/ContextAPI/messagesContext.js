import { createContext , useCallback, useContext, useEffect, useState } from "react";
import { baseUrl , getRequest , postRequest } from "../utils/services";
import { io } from 'socket.io-client' 
import { chatContext } from "./chatContext";

export const messagesContext = createContext();

export default function  MessagesGlobaleState ({children,user}) {
   const [allUsers , setAllUsers] = useState([]);
   const [currentChat,setCurrentChat] = useState(null);
   const [messages,setMessages] = useState([]);
   const [isMessagesLoading,setIsMessagesLoading] = useState(false);
   const [messagesError,setMessagesError] = useState(null);
   const [sendMessageTextError,setSendMessageTextError] = useState(null);
   const [newMessage,setNewMessage] = useState(null);
   const [socket,setSocket] = useState(null);
   const [onlineUsers,setOnlineUsers] = useState([]);
   const [notifications,setNotifications] = useState([]);

console.log("notifications : " , notifications);
console.log("messages : " , messages);

const { userChats } = useContext(chatContext)

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
      
      setOnlineUsers(res)
   });
   return ()=>{
      socket.off('getOnlineUsers');
   }
},[socket,user?._id])

// send messages
useEffect(() => {
   if (socket === null || !currentChat) return;
 
   const recipientId = currentChat?.members.find(id => id !== user?._id);
 
   if (recipientId) {
     socket.emit('sendMessage', { ...newMessage, recipientId });
   }
 }, [newMessage, currentChat, socket, user?._id]);

// recieve message and notification
useEffect(()=>{
   if (socket === null) return
  
 socket.on("getMessage", res => {
   
   if (currentChat?._id !== res.chatId ) return ;

   setMessages(prev => [...prev, res])
 })

 socket.on("getNotification", (res) => {
  const recieverId = currentChat?.members.find(id=>id !== res.senderId)
  const isChatOpen = onlineUsers.some((u)=>u.userId === recieverId)
  console.log("ischat open ? : " , isChatOpen); 
  
     if (isChatOpen) {  
        setNotifications(prev => [{...res,isRead:true}, ...prev])
         localStorage.setItem("Notifications",JSON.stringify(notifications))
   }else if (isChatOpen && !recieverId)  { 
      setNotifications(prev => [res, ...prev])
      localStorage.setItem("Notifications",JSON.stringify(notifications))
}}) 
 
return ()=>{
   socket.off("getMessage");
   socket.off("getNotification")
}   
  
},[socket,currentChat,newMessage,notifications,onlineUsers])

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
   // function to send messages
   async(messageText,currentChatId,sender,authorName,setMessageText)=>{
   if (!messageText) { return alert("You cant send empty message.")}
 const response =await postRequest(`${baseUrl}/messages`,({ 
                                                           messageText,
                                                           chatId:currentChatId,
                                                           senderId:sender,
                                                           authorName
                                                                  }))     
           console.log(response);                                                   
  if (response.error) {
   return setSendMessageTextError(response)}

  setNewMessage(response);
  setMessages(prev=>[...prev,response])
  setMessageText('');
},[])
 // function to send notifications
const sendNotifications = useCallback( 
 async(chatId,senderId,recieverId,message,date)=>{
    
   const response =await postRequest(`${baseUrl}/notifications/${senderId}/${recieverId}`,
                                        ({chatId,
                                           message,
                                           isRead:false,
                                           date
                                          }))     
     setNotifications(prev=>[...prev,response])
                                          
 },[])

  const updateCurrentChat = useCallback((chat)=>{
       setCurrentChat(chat)
  },[])
  // get all users
  useEffect(()=>{
   const getUsers =async ()=>{
   try {   
      const response =await getRequest(`${baseUrl}/`)
      setAllUsers(prev=>[...prev,response])
   } catch (error) {
      console.log(error);
   }}
   getUsers();
  },[])
  
   return (<messagesContext.Provider 
    value={{
       messages,isMessagesLoading,messagesError,
       updateCurrentChat,currentChat,
       sendMessage,sendMessageTextError,onlineUsers,
       notifications,allUsers,
       sendNotifications
    }}
   >
  {children}
   </messagesContext.Provider>)
}
