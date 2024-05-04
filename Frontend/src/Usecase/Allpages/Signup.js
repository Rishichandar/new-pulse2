import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
function Signup(){
  const Email=useSelector((state)=>state.auth.user.Email)
  const location = useLocation();
  const email = location.state?.email; // Access email from location state

    function callalert(){
        alert ("Task added successfully")
    }
    // for date getting
    const [taskDetails, setTaskDetails] = useState('');
    const [emailid, setEmail] = useState(Email); //  forAdd email state
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
          });
          console.log(response.data);
          alert("Task added successfully");
          taskDetailsInput.value = '';
        } catch (error) {
          console.error('Error:', error);
        }
      };
    //   console.log(taskDetails);
    return <>
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
          <input className="btn-sub" type="submit" />
          </div>
          </div>
         </form>
         {/* {error && <p style={{ color: 'red' }}>{error}</p>} Display error message if error state is set */}
         </div>
        
    </div>
    
   
    
     
 
 
     </>
 
 }
 export default Signup;