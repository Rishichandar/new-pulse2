import React from 'react';
import { Link } from 'react-router-dom'
import{FaHome,} from "react-icons/fa";
import { MdOutlineRoundaboutRight } from "react-icons/md";
import { PiSignOutFill } from "react-icons/pi";
import { RiAdminFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { BiTask } from "react-icons/bi";
function Navbar(){

    return <>
     <nav className="navbar">
        {/* <h4 className='logo'>Project management</h4> */}
        <ul className='nav-links'>
           
            <Link to='/home' className="Home">
            <li><div id='icons'><FaHome/>{"\t"}Home</div></li>
             </Link>
             <Link to='/admin' className="Admin">
                <li><div id='icons'><RiAdminFill />{"\t"}Admin</div></li>
             </Link>
             <Link to='/user' className="user">
                <li><div id='icons'><FaUserCircle />{"\t"}User</div></li>
             </Link>
             {/* <Link to='/usecase' className="usecase">
                <li><div id='icons'><BiTask />{"\t"}Usecase</div></li>
             </Link> */}
             {/* <Link to='/task' className="Signout">
                <li><div id='icons'><BiTask />{"\t"}Task Details</div></li>
             </Link> */}
                
            
             
        </ul>
        

     </nav>
     
 
 
     </>
 
 }
 export default Navbar;