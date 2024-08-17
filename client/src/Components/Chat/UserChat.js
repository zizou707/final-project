"use client"
import React, { useContext } from 'react'
import { useFetchRecipient } from '../../hooks/useFetchRecipient'
import { Image, Stack } from 'react-bootstrap';
import imgFriend from '../../Assets/Profiles-Pics/user-3.png'
import { messagesContext } from '../../ContextAPI/messagesContext';

function UserChat({chat,user}) {
  const {recipientUser} = useFetchRecipient(chat,user);
  const { onlineUsers } = useContext(messagesContext)
    
  return (
    <Stack direction='horizontal' gap={3} className='user-card items-center p-2 justify-center' role='button'>
       <div className="d-flex ">
         <div className="me-2">
           <Image src={imgFriend} alt='friend-img' className='w-2/5 rounded-full ' ></Image>
         </div>
         <div className="text-content">
           <div className="name"> {recipientUser?.name} </div>
           <div className="text"> message </div>
         </div>
       </div>
       <div className="d-flex flex-col items-end ">
             <div className="date">00/00/0000</div>
             <div className="this-user-notification">3</div>
             <span className={onlineUsers?.some((user)=>user?.userId === recipientUser?._id) ? "user-online-recipientUser" : ""}></span>
       </div>
    </Stack>
  )
}

export default UserChat