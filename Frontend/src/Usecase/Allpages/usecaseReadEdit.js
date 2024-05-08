
// import React, { useState, useEffect } from 'react';
// import { useLocation } from "react-router-dom";
// import axios from 'axios';
// import { toast } from "react-toastify";

// export const UsecaseReadEdit = () => {
//     const location = useLocation();
//     const title = location.state?.title;
//     const [teamMembers, setTeamMembers] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchTeamMembers = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8000/usecases/${title}`);
//                 const data = response.data;

//                 // Set the state with team members and their corresponding use cases
//                 setTeamMembers(data);
//                 setIsLoading(false);
//             } catch (error) {
//                 console.log('Error fetching team members:', error);
//                 setIsLoading(false);
//                 alert('Failed to fetch team members. Please try again later.');
//             }
//         };

//         if (title) {
//             fetchTeamMembers();
//         }
//     }, [title]);

//     return (
//         <>
//             <span id='title2'>{title}</span>
//             {isLoading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
//                     {/* Render container for each team member */}
//                     {teamMembers.map((member, index) => (
//                         <div key={index} className='team-member-container'>
//                             <div className='team-member' style={{ background: '#5fe27c', padding: '10px', marginTop: '100px', width: "260px", height: "250px", borderRadius: "10px", display: "inline-block" }}>
//                                 <span style={{ display: "block", color: "white", fontSize: "17px", fontWeight: "600", textAlign: "center", marginBottom: "10px" }}>{member.team_members}</span>
//                                 <p style={{ marginBottom: '5px', textAlign: 'center' }}>{member.usecases}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//             <button id='usecase-edit'>Edit</button>
//             <button id='usecase-submit'>Submit</button>
//         </>
//     );
// };
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";

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
        const { value } = event.target;
        setEditedTeamMember(prevState => ({
            ...prevState,
            usecases: value
        }));
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };
 console.log(title);
    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:8000/usecases/${title}`, editedTeamMember);
            toast.success('Use cases updated successfully!');
            setEditMode(false);
        } catch (error) {
            console.log('Error updating use cases:', error);
            toast.error('Failed to update use cases. Please try again later.');
        }
    };

    return (
        <>
            <span id='title2'>{title}</span>
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
                                        <p style={{ marginBottom: '5px', textAlign: 'center' }}>{member.team_members}</p>
                                        <input type="text" value={editedTeamMember.usecases} onChange={handleInputChange} />
                                        <button onClick={handleSubmit}>Submit</button>
                                        <button onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                        <span style={{ display: "block", color: "white", fontSize: "17px", fontWeight: "600", textAlign: "center", marginBottom: "10px" }}>{member.team_members}</span>
                                        <p style={{ marginBottom: '5px', textAlign: 'center' }}>{member.usecases}</p>
                                        <button onClick={() => handleEditClick(member)} id='usecase-edit'>Edit</button>
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
