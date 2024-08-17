import React, { useContext } from 'react'
import { chatContext } from '../../ContextAPI/chatContext'
import { userContext } from '../../ContextAPI/userContext';
import { messagesContext } from '../../ContextAPI/messagesContext';

function PotentialChats() {
    const {user} = useContext(userContext);
    const {potentialChats,createChat} = useContext(chatContext);
    const {onlineUsers} = useContext(messagesContext);

    
  return (
   <> 
   <div className="all-users">
        {potentialChats && potentialChats.map((u,index)=>{
            return(
            <div className="single-user" key={index} onClick={()=>createChat(user._id,u._id)}>
            {u.name}
            <span className={onlineUsers?.some((user)=>user?.userId === u._id) ? "user-online" : ""}></span>
            </div>
        )})}
   </div>
   </>
  )
}

export default PotentialChats