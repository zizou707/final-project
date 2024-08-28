import React, { useContext} from 'react'
import { chatContext } from '../../ContextAPI/chatContext';
import { Container , Stack } from 'react-bootstrap'
import UserChat from './UserChat';
import { userContext } from '../../ContextAPI/userContext';
import PotentialChats from './PotentialChats';
import { messagesContext } from '../../ContextAPI/messagesContext';
import MessagesBox from '../Messages/MessagesBox';

function Chat() {
const { user } = useContext(userContext)
const { isUserChatsLoading ,userChats, userChatsError , creatingChatError } = useContext(chatContext);
 const { updateCurrentChat } = useContext(messagesContext)

 
  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? null : 
       <Stack direction='horizontal' gap={4} className='align-items-start'>
        <Stack className='messages-box flex-grow-0 pe-3'>
          {isUserChatsLoading && <p>Loading Chats...</p> }
           {userChats && userChats?.map((chat,index)=>{
            return ( <div key={index}   onClick={()=>updateCurrentChat(chat)}  >
                      <UserChat chat={chat} user={user} />
                     </div>)
           }) } 
        </Stack>
        <MessagesBox />
       </Stack>}
        {userChatsError && <div className="-mt-10 mb-2 bg-red-500 p-2"><p role="alert">{userChatsError.message}</p></div> }
        {creatingChatError && <div className="-mt-10 mb-2 bg-red-500 p-2"><p role="alert">{creatingChatError.message}</p></div> }
    </Container>
  )
}

export default Chat