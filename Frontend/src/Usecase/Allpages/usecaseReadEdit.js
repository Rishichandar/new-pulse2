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
    // const email = location.state?.email;
    const [usecases, setUsecases] = useState([]);
    const [editModeId, setEditModeId] = useState(null); // State to track edit mode for a specific row
    const [editedUsecase, setEditedUsecase] = useState({});
    const navigate = useNavigate();

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

    const handleEditClick = (id) => {
        setEditModeId(id);
        const usecaseToEdit = usecases.find(usecase => usecase.id === id);
        setEditedUsecase(usecaseToEdit);
        toast.success("Edit mode on");
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
            setEditModeId(null); // Turn off edit mode after submission
            setEditedUsecase({});
            toast.success("Updated successfully");
            const response = await axios.get(`http://localhost:8000/usecases?title=${encodeURIComponent(title)}`);
            setUsecases(response.data);
        } catch (error) {
            console.error('Error updating use case:', error);
        }
    };

    const back = () => {
        navigate("/user");
    }
    const totask = (title,summary) => {
  
      navigate("/task", { state: { title: title,summary:summary} });
    };
    return (
      <>
      <Stack spacing={2} direction="row">
          <Button id='back-btn' variant="outlined" onClick={back}>Back</Button>
      </Stack>

      <table id='usecase-table'>
          <thead>
              <tr>
                  <th>Title</th>
                  <th>Summary</th>
                  <th>Description</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th>End Date</th>
                  <th colSpan="3">Actions</th>
              </tr>
          </thead>
          <tbody>
              {usecases.length === 0 ? (
                  <tr>
                      <td>Doesn't add usecase</td>
                  </tr>
              ) : (
                  usecases.map((usecase) => (
                      // Inside the map function where you render each usecase
                      <tr key={usecase.id}>
                          {/* Render use case details */}
                          <td>{title}</td>
                          <td>
                              {editModeId === usecase.id ?
                                  <input id='edit-input' type="text" name="summary" value={editedUsecase.summary} onChange={handleInputChange} />
                                  : usecase.summary}
                          </td>
                          <td>
                              {editModeId === usecase.id ?
                                  <input id='edit-input' type="text" name="description" value={editedUsecase.description} onChange={handleInputChange} />
                                  : usecase.description}
                          </td>
                          <td>
                              {editModeId === usecase.id ?
                                  <input id='edit-input' type="text" name="team" value={editedUsecase.team} onChange={handleInputChange} />
                                  : (Array.isArray(usecase.team) ? usecase.team.join(', ') : usecase.team)}
                          </td>
                          <td>
                              {editModeId === usecase.id ?
                                  <input id='edit-input' type="text" name="status" value={editedUsecase.status} onChange={handleInputChange} />
                                  : usecase.status}
                          </td>
                          <td>
                              {editModeId === usecase.id ?
                                  <input id='edit-input' type="date" name="enddate" value={editedUsecase.enddate} onChange={handleInputChange} />
                                  : new Date(usecase.enddate).toLocaleDateString()}
                          </td>
                          <td>
                              {editModeId === usecase.id ?
                                  <button id='edit-submit' onClick={handleSubmit}>Submit</button>
                                  : null}
                          </td>
                          <td>
                              {editModeId === usecase.id ?
                                  <button id='edit-cancel' onClick={() => setEditModeId(null)}><IoClose size={20} /></button>
                                  :
                                  <span onClick={() => handleEditClick(usecase.id)} id='usecase-edit'><MdEdit /></span>}
                          </td>
                          {/* Move the task button mapping outside of this use case mapping */}
                          <td>
                              <span className="task1" onClick={() => totask(title, usecase.summary)} id='taskdetails'size={23}><MdOutlineTask /></span>
                          </td>
                      </tr>
                  ))
              )}
          </tbody>
      </table>

      {/* Task button mapping
      {usecases.map((usecase) => (
          <div key={usecase.id}>
              <span id='taskdetails' className="task1" onClick={() => totask(title, usecase.summary)}>
                  <MdOutlineTask size={20} />
              </span>
          </div>
      ))} */}

  </>
    );
};
