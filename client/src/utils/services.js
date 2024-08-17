import axios from 'axios'
export const baseUrl = "http://localhost:4000/users"

export const postRequest =async (url,body)=>{
  try {
    const response = await axios.post(url,body);
    
   const data = response.data;
   return data
  } catch (error) {
    let message = "An Error Occurred...";
    
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    return { error: true, message };
  }
} 

export const getRequest = async (url)=>{
  try {
    const response = await axios.get(url);
    
    const data = response.data
   
    
    return data
  } catch (error) {
    let message = "An Error Occurred...";
    
    
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    return { error: true, message };
  }
};
