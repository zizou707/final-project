import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const userContext = createContext(null);

export default function UserGlobalState ({children}){
  const [user,setUser] = useState(null);
  const [registerError,setRegisterError] = useState(null);
  const [isRegisterLoading,setIsRegisterLoading] = useState(false);
  const [registerInfo,setRegisterInfo] = useState({
    name:"",
    email:"",
    password:"",
    phone:undefined
  })
  const [loginError,setLoginError] = useState(null);
  const [isLoginLoading,setIsLoginLoading] = useState(false);
  const [loginInfo,setLoginInfo] = useState({
    email:"",
    password:""
  });


  const updateRegisterInfo = useCallback((info)=>{
    setRegisterInfo(info)
  },[])

  const updateLoginInfo = useCallback((info)=>{
    setLoginInfo(info)
  },[])

  const registerUser =useCallback(async(e) => {
      e.preventDefault();
    setIsRegisterLoading(true);
    setRegisterError(null);

   const response = await postRequest(`${baseUrl}/signUp`,(registerInfo));
   setIsRegisterLoading(false)
   
   if (response?.error){ return setRegisterError(response)}
   
   localStorage.setItem('User',JSON.stringify(response))
   setUser(response)
  },[registerInfo])

  const logoutUser = useCallback(async()=>{
     localStorage.removeItem('User')
     setUser(null)
  },[])

  useEffect(()=>{
    const user = localStorage.getItem('User');
    setUser(JSON.parse(user))
  },[])

  const loginUser = useCallback(async(e)=>{
        e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);
    const response = await postRequest(`${baseUrl}/login`,(loginInfo));
     setIsLoginLoading(false);
    if (response.error){ return setLoginError(response) }

    localStorage.setItem('User',JSON.stringify(response.user))
    
     setUser(response.user);
  },[loginInfo])

  return (
  <userContext.Provider value={{
    user,logoutUser,
    registerInfo,
    updateRegisterInfo,isRegisterLoading,
    registerUser,registerError,
    loginUser,loginInfo,
    loginError,isLoginLoading,
    updateLoginInfo
  }}>
     {children}
  </userContext.Provider>)
}