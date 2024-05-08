import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";

export const UsecaseReadEdit = () => {
    const location = useLocation();
    const title = location.state?.title;
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedTeamMember, setEditedTeamMember] = useState({});

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/usecases/${title}`);
                const data = response.data;
                setTeamMembers(data);
                setIsLoading(false);
            } catch (error) {
                console.log('Error fetching team members:', error);
                setIsLoading(false);
                alert('Failed to fetch team members. Please try again later.');
            }
        };

        if (title) {
            fetchTeamMembers();
        }
    }, [title]);

    const handleEditClick = (member) => {
        setEditMode(true);
        setEditedTeamMember(member);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedTeamMember(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        // Update teamMembers with edited data if edit mode was active
        if (editMode) {
            setTeamMembers(prevTeamMembers =>
                prevTeamMembers.map(member =>
                    member.id === editedTeamMember.id ? editedTeamMember : member
                )
            );
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:8000/usecases/${title}`, editedTeamMember);
            toast.success('Use cases updated successfully!');
            setEditMode(false);
            // Update teamMembers with edited data
            setTeamMembers(prevTeamMembers =>
                prevTeamMembers.map(member =>
                    member.id === editedTeamMember.id ? editedTeamMember : member
                )
            );
        } catch (error) {
            console.log('Error updating use cases:', error);
            toast.error('Failed to update use cases. Please try again later.');
        }
    };

    return (
        <>
            <span id='titlee2'>{title}</span>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
                    {/* Render container for each team member */}
                    {teamMembers.map((member, index) => (
                        <div key={index} className='team-member-container'>
                            <div className='team-member' style={{ background: '#5fe27c', padding: '10px', marginTop: '100px', width: "260px", height: "250px", borderRadius: "10px", display: "inline-block" }}>
                                {editMode && editedTeamMember.id === member.id ? (
                                    <div>
                                        <span style={{ display: "block", color: "white", fontSize: "20px", fontWeight: "600", textAlign: "center", marginBottom: "10px" }}>{member.team_members}</span>
                                        <input  id='edit-input' type="text" name="usecases" value={editedTeamMember.usecases} onChange={handleInputChange} />
                                        <button id='edit-submit' onClick={handleSubmit}>Submit</button>
                                        <span id='edit-cancel' onClick={handleCancelEdit}><IoClose size={24} /></span>
                                    </div>
                                ) : (
                                    <div>
                                        <span style={{ display: "block", color: "white", fontSize: "20px", fontWeight: "600", textAlign: "center", marginBottom: "10px" }}>{member.team_members}</span>
                                        <p className='usecase1' style={{ marginBottom: '5px', textAlign: 'center' }}>{member.usecases}</p>
                                        <span onClick={() => handleEditClick(member)} id='usecase-edit'><MdEdit  size={20}/></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
