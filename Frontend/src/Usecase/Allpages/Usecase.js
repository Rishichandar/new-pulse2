
///new

import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Usecase() {
  const navigate = useNavigate();
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

  // State to track if all use cases are filled
  const [allUseCasesFilled, setAllUseCasesFilled] = useState(false);

  // Check if all use cases are filled whenever memberData changes
  useEffect(() => {
    const isFilled = memberData.every(data => data.trim() !== '');
    setAllUseCasesFilled(isFilled);
  }, [memberData]);

  //for post method
  // const handleSubmit = async () => {
  //   if (!allUseCasesFilled) {
  //     toast.error("Fill all team member use cases");
  //     return;
  //   }
  //   try {
  //     // Send data to the backend for each team member
  //     for (let i = 0; i < teamMemberCount; i++) {
  //       await axios.post('http://localhost:8000/usecases', {
  //         title: title,
  //         teamMember: teamMembersArray[i],
  //         usecase: memberData[i]
  //       });
  //     }
  //     toast.success("Submitted successfully");
  //     setMemberData(Array(teamMemberCount).fill(''));
  //   } catch (error) {
  //     console.error('Error submitting data:', error);
  //     alert('Failed to submit data. Please try again later.');
  //   }
  // };
  const handleSubmit = async () => {
    if (!allUseCasesFilled) {
      toast.error("Fill all team member use cases");
      return;
    }
    try {
      // Send data to the backend for each team member
      for (let i = 0; i < teamMemberCount; i++) {
        await axios.post('http://localhost:8000/usecases', {
          title: title,
          teamMember:teamMembersArray[i],
          usecase: memberData[i],
          
        });
      }
      console.log(memberData[1])
      toast.success("Submitted successfully");
      setMemberData(Array(teamMemberCount).fill(''));
      // Navigate to /user after 2 seconds
      setTimeout(() => {
        navigate("/user");
      }, 2000);
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
    }, 3000);

    // Clear the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <span style={{ marginLeft: "70px" }} id='title1'> {title}</span>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
        {/* Render each team member's div with input field for additional data */}
        {teamMembersArray.map((member, index) => (
          <div key={index} id='div-box' style={{ background: '#5fe27c', padding: '10px', margin: '5px', width: "260px", height: "250px", marginLeft: "100px", marginTop: "120px", borderRadius: "10px" }}
            className="slide-In">
            <span   style={{ marginLeft: "90px",color: "white", fontSize: "16px", fontWeight: "600" }}> {member}</span>
            <input
              id='div-input'
              style={{ marginLeft: "10px", height: "50px", marginTop: "15px", textAlign: "center", border: "none", borderRadius: "5px" }}
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
