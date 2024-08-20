import axios from 'axios'
export const baseUrl = "http://localhost:4000/users"

export const postRequest =async (url,body)=>{
  try {
    const response = await axios.post(url,body);
    
   const data = response.data;
   return data
  } catch (error) {
    if (error?.response?.data){
     let message = error.response.data 
     return { error: true, message }; }
     else if (error) { 
      let message = error.message ;
       return { error: true, message };
      }
  }
} 

export const getRequest = async (url)=>{
  try {
    const response = await axios.get(url);
    
    const data = response.data
   
    
    return data
  } catch (error) {
    if (error?.response?.data){
     let message = error.response.data 
     return { error: true, message }; }
     else if (error) { 
      let message = error.message ;
       return { error: true, message };
      }
  }
  }

  export const getUserById =async (id)=>{
    
    
  }
    
       

  export const unreadNotifiactionsFunc = (not)=>{
    return not?.filter(n=> n.isRead === false)
  }
