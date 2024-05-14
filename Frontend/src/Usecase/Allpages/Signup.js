import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
function Signup(){
  const navigate = useNavigate();
  const Email=useSelector((state)=>state.auth.user.Email)

  console.log(Email)
  const location = useLocation();
  const { state } = location;
  const { title,summary } = state;

  console.log("title",title)
  // const summary = location.state?.summary; // Access email from location state
  console.log("summary ",summary);

    function callalert(){
      toast.success("Task added successfully")
    }
    // for date getting
    const [taskDetails, setTaskDetails] = useState('');
    const [emailid, setEmail] = useState(Email); //  forAdd email state
    const [Title, settitle] = useState(title); //  forAdd email state
    //for storing a change values in taskdetails
    console.log(Email);
    // const handleInputChange = (e) => {
    //     setTaskDetails(e.target.value);
    //   }; 
    const handleInputChange = (e) => {
      setTaskDetails(e.target.value);
    };
    //   //passing  task details to backend
      const handleSubmit = async (e) => {
        e.preventDefault();
        const taskDetailsInput = document.getElementById('task-details'); // Get the input element by ID
        const taskDetails = taskDetailsInput.value; // Get the value of the input
        try {
          const response = await axios.post('http://localhost:8000/taskdetails', {
            taskDetails,
            emailid,
            Title,
            summary,
          });
          console.log(response.data);
          toast.success("Task added successfully")
          taskDetailsInput.value = '';
        } catch (error) {
          console.error('Error:', error);
        }
      };
    //   console.log(taskDetails);
    const handleClick = () => {
      // Check if submitted is true
    
          // Navigate to the task page after 3 seconds
        setTimeout(() => {
              navigate('/user');
          }, 2000); // 3000 milliseconds = 3 seconds
    
  };
  const back=()=>{
    navigate("/user")

  }
    return <>
    <Stack spacing={2} direction="row">
      <Button id='back-btn' variant="outlined" onClick={back}>Back</Button>
    </Stack>
   
    <div id="task-container">
        <div id="tot-form">
        {/* <h1>Welcome to the task page, {email}!</h1> */}
       
       <div id="quotes">
       <span id="h4">TASK DETAILS</span>
       <br></br>
         <span id="tag-line1">Every task detail is a step closer to project perfection.</span><span id="tag-line2"> Let's craft a masterpiece together.</span>

        </div>
        
         <form onSubmit={handleSubmit}>
         <div id="task-form">
           
            <div id="fields">
           
            {/* <h6 id="note">Please enter the task details</h6> */}
            {/* <button className="date1" onClick={TodayDate}>Date</button> */}
          <br></br>
          <br></br>
          <input id="task-details" className="field" type="text" placeholder="Enter task details" onChange={handleInputChange} required/>
          <br></br>
          <br></br>
          <input className="btn-sub"onClick={handleClick} type="submit" />
          </div>
          </div>
         </form>
         {/* {error && <p style={{ color: 'red' }}>{error}</p>} Display error message if error state is set */}
         </div>
        
    </div>
    
   
    
     
 
 
     </>
 
 }
 export default Signup;