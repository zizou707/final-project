import React, { useContext, useEffect, useRef, useState } from 'react'
import { userContext } from '../../ContextAPI/userContext'
import { messagesContext } from '../../ContextAPI/messagesContext';
import { useFetchRecipient } from '../../hooks/useFetchRecipient';
import { Alert, Stack } from 'react-bootstrap';
import moment from 'moment'
import InputEmoji from 'react-input-emoji'
import { baseUrl } from '../../utils/services';
import axios from 'axios';

function MessagesBox() {
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [isEditMessage,setIsEditMessage] = useState(false)
    const [myMessages , setMyMessages] = useState([])
    const [isFileUploadInput,setIsFileUploadInput] = useState(false)
    const [files ,setFiles] = useState(null)
    const [msg ,setMsg] = useState(null)
    const [progress ,setProgress] = useState({started : false , pc : 0})

    const { user } = useContext(userContext);
    const { currentChat, messages,getMessages, isMessagesLoading, sendMessage,updateMessage,sendMessageTextError,errorDeletingMessage,deleteMessage } = useContext(messagesContext);
    const { recipientUser } =useFetchRecipient(currentChat,user);
    const [messageText,setMessageText] = useState('');
    const scroll = useRef();

 // filtering my messages
 useEffect(()=>{
   const result = messages?.filter(m => 
     m?.senderId === user?._id
    )
    
    setMyMessages( result ) 
    
 },[messages,user?._id])
    
 useEffect(()=>{
  
   scroll.current?.scrollIntoView({behaviour:"smooth"})

 },[messages])  
 // getting messages from db
useEffect(()=>{
  getMessages()
},[getMessages])
// Handler to toggle the edit/delete options for a specific message and selecting the id
const handleEditDeleteClick = (messageId) => {
  setSelectedMessageId(messageId);
};
// know when user want to update message or not
const toggleIsEditMessage = (messageText) => {
  setIsEditMessage(!isEditMessage)
  
  setMessageText(messageText); 
} 

// early check if there is no recipient user show empty msgs box or if msgs is being loaded from db
    if (!recipientUser) { return <h5 style={{textAlign:"center",width:"100%"}}>Select a conversation to display here...</h5>}
    if (isMessagesLoading) { return <h5 style={{textAlign:"center",width:"100%"}}>Loading...</h5>}

    // upload files function
 const handleUpload = () => {
   if (!files) { setMsg("No File Selected."); return; }

   const fd = new FormData();
   for (let i=0 ; i < files.length ; i++) {
      fd.append(`file${i+1}`,files[i])
   }

   setMsg("Uploading...")
   setProgress(prev => {return {...prev,started : true}})
   axios.post(`${baseUrl}/upload` , fd , {
     onUploadProgress:(progressEvent) => { setProgress(prev => {
      return {...prev , pc: progressEvent.progress*100}
     })},
     'headers' : {
        "Custom-Header" : "value",
        'Access-Control-Allow-Origin' : true
     }
   })
   .then((res)=> {
    setMsg("Upload Successful")
    console.log(res.data)})
   .catch(err => {
    setMsg("Upload Failed")
    console.log(err)})
 } 
  
  return (<>
            { !sendMessageTextError ? (
                  <Stack  gap={4} className='chat-box'>
                  <div className="chat-header">
                      <strong>{recipientUser?.name[0].toUpperCase()+recipientUser?.name.slice(1) } </strong>
                  </div>
                  <Stack gap={3} className='messages'>
                    {messages && !errorDeletingMessage && messages.map((m,index)=>
                   
                    <Stack ref={scroll} key={index} className={`${m?.senderId === user._id ? "my-messages" : "others-messages"}`}>
                          <div onClick={() => handleEditDeleteClick(m._id)} className='edit-delete-btn' id={`${index}`} > 
                           {myMessages.map((myMsg,i) => {
                            if (myMsg?._id === m?._id) {
                              return <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-three-dots-vertical cursor-pointer " viewBox="0 0 16 16">
                                         <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                     </svg>
                            } return null
                           }) }
                      
                              {selectedMessageId === m?._id && (
                            <div className="message-edit-delete">
                              <div className="edit-deletle-func -mt-2" >
                                <button className="delete-msg" onClick={() => { deleteMessage(m._id); setSelectedMessageId(null); }}>
                                  Delete
                                </button>
                                <button onClick={()=>toggleIsEditMessage(m.messageText)} className="edit-msg">
                                  Edit
                                </button>
                              </div> 
                            </div>)} 
                        </div>
                            <span >{m?.messageText} </span>
                            <span className='messages-footer'>{moment(m?.updatedAt).format("ddd, ha:m")} </span>
          {isEditMessage && selectedMessageId === m._id ? ( <>
                               <input onChange={(e)=> setMessageText(e.target.value)} style={{color:'black'}} />
                               <span className='messages-footer'>{moment(m?.updatedAt).format("ddd, ha:m")} </span>
                               <button onClick={()=> {updateMessage(m._id,currentChat._id,user._id,user.name,recipientUser._id,messageText,setMessageText); setSelectedMessageId(null); setIsEditMessage(false) }}>Update</button>
                             </>) : null}
                    </Stack>
                    ) }                            
                    {errorDeletingMessage && <Alert>An Error Occur during deleting...{errorDeletingMessage.message} </Alert>}
                  </Stack>
                  <Stack  direction='horizontal' gap={3} className='chat-input flex-grow-0'>
                    <InputEmoji  onEnter={()=> {sendMessage(currentChat._id,user._id,user.name,recipientUser._id,messageText,setMessageText)}}  value={messageText} onChange={setMessageText} borderColor='rgba(72,112,223,0.2)' />
                      <div className='upload '  >
                        <svg onClick={()=>setIsFileUploadInput(!isFileUploadInput)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-paperclip cursor-pointer" viewBox="0 0 16 16">
                          <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"/>
                        </svg>
                      </div>
                      {isFileUploadInput && 
                      <>
                      <input className='upload-input' onChange={ e => { setFiles(e.target.files )}} type='file' multiple>
                         
                      </input> 
                      <button className='flex flex-row gap-2 bg-slate-500 p-2 rounded' onClick={ handleUpload }>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cloud-arrow-up-fill " viewBox="0 0 16 16">
                            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
                          </svg>
                        Upload
                      </button>
                      </>}
                     { progress.started && <progress max='100' value={progress.pc}></progress>} 
                     { msg && <span > {msg} </span>} 
                    <button className='send-btn' onClick={()=>{sendMessage(currentChat._id,user._id,user.name,recipientUser._id,messageText,setMessageText)}} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                    </svg>
                    </button>
                  </Stack> 
              </Stack>) :<Alert className='w-full h-full bg-red-500' >{JSON.stringify(sendMessageTextError.message)}</Alert>}
          </>
  )
}

export default MessagesBox