"use client"
import React, { useContext, useEffect } from 'react'
import { useFetchRecipient } from '../../hooks/useFetchRecipient'
import { Image, Stack } from 'react-bootstrap';
import imgFriend from '../../Assets/Profiles-Pics/user-2.png'
import { messagesContext } from '../../ContextAPI/messagesContext';
import { getAllUsersExceptLoggedIn } from '../../utils/services';

function UserChat({chat,user}) {
  const {recipientUser} = useFetchRecipient(chat,user);
  const { onlineUsers,notifications } = useContext(messagesContext)
    console.log(recipientUser);
    
  return (
    <Stack direction='horizontal' gap={3} className='user-card items-center p-2 justify-center' role='button'>
       <div className="d-flex ">
         <div className="me-2">
           <Image src={imgFriend} alt='friend-img' className='w-2/5 ' roundedCircle fluid ></Image>
         </div>
         <div className="text-content">
           <div className="name"> {recipientUser?.name[0].toUpperCase()+recipientUser?.name.slice(1)} </div>
           <div className="text"> message </div>
         </div>
       </div>
       <div className="d-flex flex-col items-end ">
             <div className="date">00/00/0000</div>
             <div className="this-user-notification"> {notifications?.length} </div>
             <span className={onlineUsers?.some((user)=>user?.userId === recipientUser?._id) ? "user-online-recipientUser" : ""}></span>
       </div>
    </Stack>
  )
}

export default UserChat