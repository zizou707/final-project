import React, { useContext, useState } from 'react'
import { messagesContext } from '../../ContextAPI/messagesContext';
import { userContext } from '../../ContextAPI/userContext';
import { unreadNotifiactionsFunc } from '../../utils/services';

function Notifications() {
    const [isOpen,setIsOpen] = useState(false);
    const { user } = useContext(userContext)
    const { notifiactions , allUsers } = useContext(messagesContext);
  
      const unreadNotifiactions = unreadNotifiactionsFunc(notifiactions);
    const modifiedNotifications = unreadNotifiactionsFunc(notifiactions)?.map((n)=>{
      const sender = allUsers.find(user => user._id === n.senderId)
      return ({
        ...n,
        senderName : sender?.name
      })
    }) 
  
  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={()=>setIsOpen(!isOpen)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bell-fill mt-4" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
      </svg>
      {modifiedNotifications?.length > 0 ?  (
         <span className='notification-count'>
           <span> {modifiedNotifications?.length} </span>
         </span>
      ):null}
      </div>
     {isOpen ? (<div className="notifications-box">
        <div className="notifications-header ">
            <h3>not</h3>
            <div className="mark-as-read">
              mark all as read
            </div>
        </div>
      </div>) : null}
    </div>
  )
}

export default Notifications