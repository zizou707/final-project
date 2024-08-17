
import { useContext} from "react"
import {userContext} from "../ContextAPI/userContext";

function Login() {
  const { loginUser, loginInfo, loginError, isLoginLoading, updateLoginInfo } = useContext(userContext);
  
  return (
    <div className="login-form-container" >
      <form onSubmit={loginUser} className='flex flex-col w-1/2 gap-3 justify-center items-center'> 
        
        <label className="mt-4">
          Email 
        </label>
        <input className='w-full h-6 pl-2 text-black' type='email'  onChange={(e)=>updateLoginInfo({...loginInfo,email:e.target.value})}/>
        <label>
          Password 
        </label>
        <input className='w-full h-6 pl-2 text-black' type='password'  onChange={(e)=>updateLoginInfo({...loginInfo,password:e.target.value})}/>

        <button disabled={isLoginLoading } type="submit" className='mb-5 mt-4 bg-green-500 p-1 w-full'>{isLoginLoading? "Loading..." : "Login"}</button>
        {loginError?.error && <div><p role="alert">{loginError.error}</p></div> }
      </form>
    </div>
  )
}

export default Login