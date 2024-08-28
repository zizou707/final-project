 import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const chatContext = createContext();

export default function ChatGlobalState ({children,user}) {
    
    const [userChats,setUserChats] = useState([]);
    const [isUserChatsLoading,setIsUserChatsLoading] = useState(false);
    const [userChatsError,setUserChatsError] = useState(null);
    const [creatingChatError, setCreatingChatError] = useState(null)
    const [potentialChats,setPotentialChats] = useState([]);
    const [potentialChatsError,setPotentialChatsError] = useState(null);
    const [allUsers , setAllUsers] = useState([]);
    
 // creating a chat in database   
    const createChat = useCallback(async(senderId,recieverId)=>{      
        try {
           const response = await postRequest(`${baseUrl}/chats`,({senderId,recieverId}))
      
        setUserChats(prev=>[...prev,response])
       } catch (error) {
         console.log(error);
         setCreatingChatError(error)
       }
    },[]) 

 // getting all users from db then filtering the potential chat withe removing the current user 
 // and find is that user is already have a chat with the current logged in user   
    useEffect(()=>{
        const getUsers =async ()=>{
            try {
                const response = await getRequest(`${baseUrl}`);
        
                const pChats = response.filter((u)=>{
                  let isChatCreated = false
                  if (user?._id === u._id) { return false}
      
                 if (userChats) {
                  isChatCreated = userChats?.some((chat)=>{ 
                      return (
                             chat.members[0] === u._id  || chat.members[1] === u._id
                   ); })
                 }
                 return !isChatCreated
                })
                setPotentialChats(pChats) 
                setAllUsers(response)
            } catch (error) {
                setPotentialChatsError(error)
            }}
        getUsers()
    },[user,userChats])
    
// get User chats whenever the user changes
    useEffect(()=>{
        const getUserChats = async()=>{
            if (user?._id) { 
              
                setIsUserChatsLoading(true)
                setUserChatsError(null);
                       
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)
                
                setIsUserChatsLoading(false)  
                   
                if (response.error){ return setUserChatsError(response)}
                
                setUserChats(response) 
             
            }
        }
        getUserChats();
    },[user])

    
    return (
        <chatContext.Provider value={{
          userChats,
          isUserChatsLoading,
          userChatsError,
          potentialChats,
          createChat,
          allUsers,
          creatingChatError,
          potentialChatsError
        }}>
           {children}
        </chatContext.Provider>
    )
} 