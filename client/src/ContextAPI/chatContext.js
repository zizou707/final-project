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

    const createChat = useCallback(async(senderId,recieverId)=>{      
        try {
           const response = await postRequest(`${baseUrl}/chats`,({senderId,recieverId}))
        console.log(response);
        setUserChats(prev=>[...prev,response])
       } catch (error) {
         console.log(error);
         setCreatingChatError(error)
       }
    },[])

    useEffect(()=>{
        const getPotentialChatUsers =async ()=>{
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
            } catch (error) {
                setPotentialChatsError(error)
            }}
        getPotentialChatUsers()
    },[userChats,user])
    
    
    
    useEffect(()=>{
        const getUserChats = async()=>{
            if (user?._id) { 
              
                setIsUserChatsLoading(true)
                setUserChatsError(null);
                       
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)
                
                setIsUserChatsLoading(false)  
                   
                if (response.error){ return setUserChatsError(response)}

                localStorage.setItem('UserChats',JSON.stringify(response))
                
                setUserChats(response) 
                console.log("userChats",userChats);
                 
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
          createChat
        }}>
           {children}
        </chatContext.Provider>
    )
} 