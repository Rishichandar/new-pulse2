// import React, { useState, useEffect } from 'react';
// import { useLocation } from "react-router-dom";
// import axios from 'axios';
// import { toast } from "react-toastify";

// export const UsecaseReadEdit = () => {
//     const location = useLocation();
//     const title = location.state?.title;
//     const [teamMembers, setTeamMembers] = useState([]);
//     const [useCases, setUseCases] = useState([]);
// console.log(useCases)
//     useEffect(() => {
//         const fetchTeamMembers = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8000/usecases/${title}`);
//                 const data = response.data;

//                 // Parse team members and use cases from the response data
//                 const parsedTeamMembers = data.map(member => ({
//                     name: member.team_members ? JSON.parse(member.team_members) : []
//                 }));
//                 const parsedUseCases = data.map(member => ({
//                     usecases: member.usecases ? JSON.parse(member.usecases) : []
//                 }));

//                 // Set the state with team members and their corresponding use cases
//                 setTeamMembers(parsedTeamMembers);
//                 setUseCases(parsedUseCases);
//             } catch (error) {
//                 console.log('Error fetching team members:', error);
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
//             <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
//                 {/* Render container for each team member */}
//                 {teamMembers.map((member, index) => (
//                     <div key={index} className='team-member-container'>
//                         <div className='team-member' style={{ background: 'lightgreen', padding: '10px', marginTop: '100px', width: "260px", height: "250px", borderRadius: "10px", display: "inline-block" }}>
//                             <span style={{ display: "block", color: "black", fontSize: "14px", fontWeight: "600", textAlign: "center", marginBottom: "10px" }}>{member.name}</span>
//                             {/* <span style={{ display: "block", color: "black", fontSize: "14px", fontWeight: "600", textAlign: "center", marginBottom: "10px" ,marginBottom: "10px"}}>{member.usecases}</span> */}
//                             {Array.isArray(member.usecases) && member.usecases.length > 0 ? (
//                                 <ul style={{ listStyleType: 'none', padding: 0 }}>
//                                     {member.usecases.map((usecase, idx) => (
//                                         <li key={idx} style={{ marginBottom: '5px', textAlign: 'center' }}>{usecase}</li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p>No use cases found for this member.</p>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
           
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

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/usecases/${title}`);
                const data = response.data;

                // Parse team members and use cases from the response data
                const parsedData = data.map(member => ({
                    name: member.team_members ? JSON.parse(member.team_members) : [],
                    usecases: member.usecases ? JSON.parse(member.usecases) : []
                }));

                // Set the state with team members and their corresponding use cases
                setTeamMembers(parsedData);
            } catch (error) {
                console.log('Error fetching team members:', error);
                alert('Failed to fetch team members. Please try again later.');
            }
        };

        if (title) {
            fetchTeamMembers();
        }
    }, [title]);

    return (
        <>
            <span id='title2'>{title}</span>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
                {/* Render container for each team member */}
                {teamMembers.map((member, index) => (
                    <div key={index} className='team-member-container'>
                        <div className='team-member' style={{ background: 'lightgreen', padding: '10px', marginTop: '100px', width: "260px", height: "250px", borderRadius: "10px", display: "inline-block" }}>
                            <span style={{ display: "block", color: "black", fontSize: "14px", fontWeight: "600", textAlign: "center", marginBottom: "10px" }}>{member.name}</span>
                            {/* <span style={{ display: "block", color: "black", fontSize: "14px", fontWeight: "600", textAlign: "center", marginBottom: "10px" ,marginBottom: "10px"}}>{member.usecases}</span> */}
                            {Array.isArray(member.usecases) && member.usecases.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {member.usecases.map((usecase, idx) => (
                                        <li key={idx} style={{ marginBottom: '5px', textAlign: 'center' }}>{usecase}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No use cases found for this member.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
