import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap'
import { userContext } from '../ContextAPI/userContext'
import profilePic from '../Assets/Profiles-Pics/user-1.png'
import Notifications from './Messages/Notifications'

function Navbar() {
  
  const {user , logoutUser } = useContext(userContext)
  
  return (
    <nav >
         <Link to='/'>
            <Image className='w-16 h-16 m-4'  alt='logo' src='/icons8-chat.gif' ></Image>
         </Link>

      <ul className='flex absolute right-5 top-0 gap-10 mt-2 '>

         {user ? <> 
                    <Notifications /> 
                    <Link className='logout-btn text-white' onClick={logoutUser} to='/'>Logout</Link>
                    <div>
                        <Image width={100} roundedCircle fluid src={profilePic} alt='profile-pic' />
                        <h3 className='text-center text-white'>{user?.name} </h3>
                    </div> 
                 </> : 
         <>
            <Link className='text-white' to='/Login'>Login</Link>  
            <Link className='text-white' to='/Register'>SignUp</Link> 
         </> }
       </ul>  
    </nav>
  )
}

export default Navbar