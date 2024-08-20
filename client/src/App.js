import React , {useContext} from 'react'
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import ChatGlobalState from "./ContextAPI/chatContext";
import {userContext} from "./ContextAPI/userContext";
import Chat from './Components/Chat/Chat';
import MessagesGlobaleState from './ContextAPI/messagesContext';
import Navbar from './Components/Navbar';

function App() {
  const { user } = useContext(userContext)

  return (  
      <ChatGlobalState user={user} >
        <MessagesGlobaleState user={user} >
            <Navbar />
            <Routes>
              <Route path="/" element={user ? <Chat /> : <Login />} />
              <Route path="/register" element={user ? <Chat /> : <Register />} />
              <Route path="/login" element={user ? <Chat /> : <Login />}/>
              <Route path="/*" element={ <Navigate to='/'/>}/>
            </Routes> 
        </MessagesGlobaleState>   
      </ChatGlobalState> 
  );
}

export default App;

