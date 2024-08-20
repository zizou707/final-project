import { useContext} from "react"
import {userContext} from "../ContextAPI/userContext";

function Register() {
  const {registerInfo,updateRegisterInfo,registerUser,registerError,isRegisterLoading}=useContext(userContext);  
  console.log(registerError);
  
  return (
    <div className="register-form-container" style={{marginLeft:"30%"}}>
      <form onSubmit={registerUser} className='flex flex-col w-1/2 gap-3 justify-center items-center'> 
        <label className='mt-2'>
          Name 
        </label>
        <input className='w-full h-6 pl-2 text-black' type='text'  onChange={(e)=>updateRegisterInfo({...registerInfo,name:e.target.value})}/>
        <label>
          Email 
        </label>
        <input className='w-full h-6 pl-2 text-black' type='email'  onChange={(e)=>updateRegisterInfo({...registerInfo,email:e.target.value})}/>
        <label>
          Password 
        </label>
        <input className='w-full h-6 pl-2 text-black' type='password'  onChange={(e)=>updateRegisterInfo({...registerInfo,password:e.target.value})}/>
        <label>
          Phone 
        </label>
        <input  className='w-full h-6 border-black-500 text-center text-black' type='number' onChange={(e)=>updateRegisterInfo({...registerInfo,phone:e.target.value})}/>
        <button disabled={isRegisterLoading } type="submit" className='mb-5 mt-4 bg-green-500 p-1 w-full'>{isRegisterLoading? "Loading..." : "Register"}</button>
        {registerError && <div className="-mt-10 mb-2 bg-red-500 p-2 "><p role="alert">{registerError.message.error}</p></div> }
      </form>
    </div>
  )
}

export default Register