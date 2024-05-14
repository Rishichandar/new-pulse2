


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
import { MdOutlineTask } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
export const UsecaseReadEdit = () => {
    const location = useLocation();
  const title = location.state?.title;
  const email = location.state?.email;
  const [usecases, setUsecases] = useState([]);
  console.log("usecase",usecases.summary)
  const [editMode, setEditMode] = useState(false);
  const [editedUsecase, setEditedUsecase] = useState({});
  const navigate = useNavigate();
  console.log(editedUsecase);
  console.log(email);
//   useEffect(() => {
//     const fetchUsecases = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/usecases');
//         setUsecases(response.data);
//       } catch (error) {
//         console.error('Error fetching use cases:', error);
//       }
//     };

//     fetchUsecases();
//   }, []);
//for task page

const totask = (title,summary) => {
  
    navigate("/task", { state: { title: title,summary:summary} });
  };
//   , { state: { email: Email, title: title } }
//using email to fetch
  //   useEffect(() => {
  //   const fetchUsecases = async () => {
  //     try {
  //       // Send the email as a query parameter to fetch use cases for a specific user
  //       const response = await axios.get(`http://localhost:8000/usecases?title=${title}`);
  //       setUsecases(response.data);
  //     } catch (error) {
  //       console.error('Error fetching use cases:', error);
  //     }
  //   };

  //   if (title) {
  //     fetchUsecases();
  //   }
  // }, [title]);
  useEffect(() => {
    const fetchUsecases = async () => {
      try {
        if (!title) return; // No need to fetch if title is not provided
        const response = await axios.get(`http://localhost:8000/usecases?title=${encodeURIComponent(title)}`);
        setUsecases(response.data);
      } catch (error) {
        console.error('Error fetching use cases:', error);
      }
    };
  
    fetchUsecases();
  }, [title]);

  const handleEditClick = (usecase) => {
    setEditMode(true);
    setEditedUsecase(usecase);
    toast.success("Editmode on")
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUsecase(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:8000/usecases/${editedUsecase.id}`, editedUsecase);
      setEditMode(false);
      setEditedUsecase({});
      toast.success("updated successfully")
      // Refresh use case data after submitting changes
      const response = await axios.get(`http://localhost:8000/usecases?title=${encodeURIComponent(title)}`);
      setUsecases(response.data);
    } catch (error) {
      console.error('Error updating use case:', error);
    }
  };
  //for back
  const back=()=>{
    navigate("/user")

  }

  return <>
     <Stack spacing={2} direction="row">
      <Button id='back-btn' variant="outlined" onClick={back}>Back</Button>
    </Stack>
   
    <div id='details'>
 
      {usecases.length === 0 ? (
                <span id='title3'>Doesn't add usecase</span>
            ) : (
      usecases.map((usecase) => (
        
        <div key={usecase.id} id='datas'>
               <span id='title2'>Use Case Details</span>
               <br></br>  
          <span>Title:</span>{title}<br /> 
          <span>Summary:</span> {editMode && editedUsecase.id === usecase.id ? 
            <input id='edit-input' type="text" name="summary" value={editedUsecase.summary} onChange={handleInputChange} />
            : usecase.summary}<br />
          <span>Description:</span> {editMode && editedUsecase.id === usecase.id ? 
            <input id='edit-input' type="text" name="description" value={editedUsecase.description} onChange={handleInputChange} />
            : usecase.description}<br />
          <span>Team:</span> {editMode && editedUsecase.id === usecase.id ? 
            <input id='edit-input' type="text" name="team" value={editedUsecase.team} onChange={handleInputChange} />
            : (Array.isArray(usecase.team) ? usecase.team.join(', ') : usecase.team)}<br />
          <span>Status:</span> {editMode && editedUsecase.id === usecase.id ? 
            <input id='edit-input' type="text" name="status" value={editedUsecase.status} onChange={handleInputChange} />
            : usecase.status}<br />
          <span>End Date:</span> {editMode && editedUsecase.id === usecase.id ? 
            <input id='edit-input' type="date" name="enddate" value={editedUsecase.enddate} onChange={handleInputChange} />
            : new Date(usecase.enddate).toLocaleDateString()}<br />
          {editMode && editedUsecase.id === usecase.id ? 
            <>
              <button id='edit-submit' onClick={handleSubmit}>Submit</button>
              <span id='edit-cancel' onClick={() => setEditMode(false)}><IoClose size={25} /></span>
            </>
            :
            <span id="usecase-edit" onClick={() => handleEditClick(usecase)}><MdEdit /></span>}
            {usecases.map((usecase) => (
      <div key={usecase.id}>
         <span id='taskdetails' onClick={() => totask(title, usecase.summary)}>
              <MdOutlineTask size={20} />
              </span>
      </div>
    ))}

        </div>
        
      )))}
      
        
    </div>
    </>
};
