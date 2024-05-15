import React from 'react';
import { Link } from 'react-router-dom'
import{FaHome,} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useState } from 'react';
import { logout } from '../../Redux/authSlice/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { Settings, ExitToApp, Person } from "@mui/icons-material";
import {
   Avatar,
   Modal,
   Box,
   Typography,
   List,
   ListItem,
   ListItemText,
   Divider,
   Button,
 } from "@mui/material";

function Navbar(){
   const navigate = useNavigate();
   const roleid=useSelector((state)=>state.auth.user.RoleId)
   console.log("roleid :",roleid);
   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);
   const [open, setOpen] = useState(false);
   const data = useSelector((state) => state.auth.user);
   const dispatch = useDispatch();
//for logout
   const handleLogout = () => {
      dispatch(logout());
      navigate("/");
    };
  //for register
    const register = () => {
      handleClose();
      navigate("/register");
    };
    return <>
     <nav className="navbar">
        {/* <h4 className='logo'>Project management</h4> */}
        <ul className='nav-links'>
           
            <Link to='/home' className="Home">
            <li><div id='icons'><FaHome/>{"\t"}Home</div></li>
             </Link>
             {/* <Link to='/admin' className="Admin">
                <li><div id='icons'><RiAdminFill />{"\t"}Admin</div></li>
             </Link> */}
             {roleid !== 2 && (
            <Link to='/admin' className="Admin">
              <li><div id='icons'><RiAdminFill />{"\t"}Admin</div></li>
            </Link>
          )}
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
        <Box mr={3}>
          <Avatar onClick={handleOpen} style={{ cursor: "pointer" }}></Avatar>
        </Box>
     
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "start",
          justifyContent: "flex-end",
        }}
      >
        <Box
          sx={{
            width: 300,
            height: "100%",
            bgcolor: "background.paper",
            p: 2,
            boxShadow: 24,
            mt: 8,
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            mb={5}
          >
            <Avatar
              onClick={handleOpen}
              style={{ cursor: "pointer", width: "100px", height: "100px" }}
            ></Avatar>

            <Typography variant="h6" component="h2" paddingTop={2}>
              {/* {data.RoleId}- */}
              {data.Email}
            </Typography>
            <Box
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-around"}
            >
              <Typography color={data.RoleId === 2 ? "green" : "red"}>
                {data.RoleId === 2 ? "User" : "Admin"}
              </Typography>
              <Button onClick={handleLogout}>
                <ExitToApp />
                Sign Out
              </Button>
            </Box>
          </Box>

          <Divider />
          <List>
            {data.RoleId === 2 ? (
              <Box>
                <p style={{ color: "red" }}>Updated soon!!</p>
              </Box>
            ) : (
              <ListItem button onClick={register}>
                <Person sx={{ mr: 2 }} />
                <ListItemText primary="Register" />
              </ListItem>
            )}

            <ListItem button>
              <Settings sx={{ mr: 2 }} />
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Modal>
        

     </nav>
     
 
 
     </>
 
 }
 export default Navbar;