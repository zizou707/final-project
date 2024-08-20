import React, { useContext, useEffect, useRef, useState } from 'react'
import { userContext } from '../../ContextAPI/userContext'
import { messagesContext } from '../../ContextAPI/messagesContext';
import { useFetchRecipient } from '../../hooks/useFetchRecipient';
import { Alert, Stack } from 'react-bootstrap';
import moment from 'moment'
import InputEmoji from 'react-input-emoji'
import { baseUrl, getRequest } from '../../utils/services';

function MessagesBox() {
    const [recipientName,setRecipientName] = useState("")
    const { user } = useContext(userContext);
    const { currentChat, messages, isMessagesLoading, sendMessage,sendMessageTextError,sendNotifications, allUsers } = useContext(messagesContext);
    const { recipientUser } =useFetchRecipient(currentChat,user);
    const [messageText,setMessageText] = useState('');
    const scroll = useRef();

 useEffect(()=>{
  
   scroll.current?.scrollIntoView({behaviour:"smooth"})

 },[messages])   

    if (!recipientUser) { return <h5 style={{textAlign:"center",width:"100%"}}>Select a conversation to display here...</h5>}
    if (isMessagesLoading) { return <h5 style={{textAlign:"center",width:"100%"}}>Loading...</h5>}
  let date = new Date();
    console.log(messages,user.name);
    
  return (<>
            { !sendMessageTextError ? (
                  <Stack gap={4} className='chat-box'>
                  <div className="chat-header">
                      <strong>{recipientUser?.name[0].toUpperCase()+recipientUser?.name.slice(1)} </strong>
                  </div>
                  <Stack gap={3} className='messages'>
                    {messages && messages.map((m,index)=>
                    <Stack ref={scroll} key={index} className={`${m?.authorName === user.name ? "my-messages" : "others-messages"}`}>
                          <span >{m.messageText} </span>
                          <span className='messages-footer'>{moment(m.createdAt).format("ddd, hA")} </span>
                    </Stack>)}
                  </Stack>
                  <Stack  direction='horizontal' gap={3} className='chat-input flex-grow-0'>
                    <InputEmoji  onEnter={()=> sendMessage(messageText,currentChat._id,user._id,user.name,setMessageText)}   value={messageText} onChange={setMessageText} borderColor='rgba(72,112,223,0.2)' />
                    <button className='send-btn' onClick={()=>{sendMessage(messageText,currentChat._id,user._id,user.name,setMessageText);sendNotifications(currentChat._id,user._id,recipientUser._id,messageText,date)}} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                    </svg>
                    </button>
                  </Stack> 
              </Stack>) :<Alert className='w-full h-full bg-red-500' >{sendMessageTextError.message}</Alert>}
          </>
  )
}

export default MessagesBox