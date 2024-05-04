import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import  { useEffect } from 'react';
import axios from 'axios';
function Usecase() {
  const location = useLocation();
  const title = location.state?.title;
  const teamMember = location.state?.teamMember;
  const teamMembersArray = teamMember.split(',');
  const teamMemberCount = teamMembersArray.length;

  // State to store additional data for each team member
  const [memberData, setMemberData] = useState(Array(teamMemberCount).fill(''));

  // Handler function to update additional data for a specific team member
  const handleDataChange = (index, newData) => {
    const newMemberData = [...memberData];
    newMemberData[index] = newData;
    setMemberData(newMemberData);
  };
  const [divPosition, setDivPosition] = useState('hidden');
  useEffect(() => {
      // After the component mounts, set a timeout to display the image after a delay
      const timeoutId = setTimeout(() => {
        setDivPosition('visible');
      }, 500); // Delay in milliseconds (adjust as needed)
  
      // Cleanup function to clear the timeout if the component unmounts before it fires
      return () => clearTimeout(timeoutId);
    }, []);
  ///for post method
    const handleSubmit = async () => {
        try {
          // Send data to the backend
          await axios.post('http://localhost:8000/usecases', {
            title: title,
            teamMembers: teamMembersArray,
            usecases: memberData
          });
          alert('Data submitted successfully!');
          setMemberData(Array(teamMemberCount).fill(''));
        } catch (error) {
          console.error('Error submitting data:', error);
          alert('Failed to submit data. Please try again later.');
        }
      };
      //for submit button
      const [showSubmitButton, setShowSubmitButton] = useState(false);
      useEffect(() => {
        // Delay the rendering of the submit button by 4 seconds
        const timeoutId = setTimeout(() => {
          setShowSubmitButton(true);
        }, 4000);
    
        // Clear the timeout to avoid memory leaks
        return () => clearTimeout(timeoutId);
      }, []);
  return (
    <>
      <span style={{ marginLeft: "70px" }} id='title1'> {title}</span>
      {/* <h3 style={{ marginLeft: "70px" }}>Team: {teamMember}</h3> */}
      {/* <h3 style={{ marginLeft: "70px" }}>Number of Members: {teamMemberCount}</h3> */}
      <div  style={{ display: 'flex', flexDirection: 'row',justifyContent:"space-evenly"}}>
        {/* Render each team member's div with input field for additional data */}
        {teamMembersArray.map((member, index) => (
          <div key={index} id='div-box' style={{ background: 'lightgreen', padding: '10px', margin: '5px' ,width:"260px",height:"250px",marginLeft:"100px",marginTop:"120px",borderRadius:"10px"}}
          className={divPosition === 'visible' ? 'slide-In' : 'hidden1'} >
            <span style={{marginLeft:"90px",fontSize:"14px",fontWeight:"600"}}> {member}</span>
            <input
            id='div-input'
            style={{marginLeft:"10px",height:"50px",marginTop:"15px",textAlign:"center",border:"none",borderRadius:"5px"}}
              type="text"
              value={memberData[index]}
              onChange={(e) => handleDataChange(index, e.target.value)}
              placeholder="Enter usecase"
            />
          </div>
        ))}
        
      </div>
      {showSubmitButton && (
        <button id='sub-usecase' onClick={handleSubmit}>Submit</button>
      )}
    
    </>
  );
}

export default Usecase;
