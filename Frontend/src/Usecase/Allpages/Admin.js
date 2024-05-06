 // App.jsx
 import axios from 'axios';
import React, { useState,useEffect,useCallback} from "react";
import { BsDownload } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Zoom }  from 'react-toastify';    
import { IoCloudDownloadOutline } from "react-icons/io5";
import { BsCloudDownload } from "react-icons/bs";
import { RiTaskFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
const Admin = () => {
	//for project details 
	const[data,setData]=useState([])
	useEffect(()=>{

		fetchData1();

	}, [])
		//   const nonDeletedProjects = response.data.filter(project => !project.is_deleted);
	const fetchData1 = async () => {
		try {
		  const response = await fetch('http://localhost:8000/project_info');
		  const jsonData = await response.json();
		//   const nonDeletedProjects = jsonData.filter(project => !project.is_deleted);
		  setData(jsonData);
		  setActivationStates(Array(jsonData.length).fill(true));
		} catch (error) {
		  console.error('Error fetching data: ', error);
		}
	  };
	  //for dailytask details

	  
	  useEffect(()=>{
  
		  fetchData2();
  
	  }, [])
		
	  const fetchData2 = async () => {
		  try {
			const response = await fetch('http://localhost:8000/project_info1');
			const jsonData = await response.json();
		 
			setTaskData(jsonData);
			
		  } catch (error) {
			console.error('Error fetching data: ', error);
		  }
		};
	//   for clicking to change button color 
	const [activationStates, setActivationStates] = useState([]);
	//for soft delete
	const handleSoftDelete = async (Projectid,index) => {
		try {
		  await axios.put(`http://localhost:8000/api/project_info/delete/${Projectid}`);
		const newActivationStates = [...activationStates];
		newActivationStates[index] = false; // Deactivate button clicked, hide it for this row
		setActivationStates(newActivationStates);
		//   alert("Deactivated successfully")
		  // Handle success, e.g., show a message or update UI
		  const tr = document.getElementsByTagName('tr')[index];
		  if (!tr) return; // Check if the row exists
		   const tds = document.getElementsByTagName('td');
		   if (!activationStates) {
		  //   document. document.getElementsByTagName('td').style.backgroundColor = 'green'; // Set background color to gray for deactivated data
			 for (let i = 0; i < tds.length; i++) {
			  tds[i].style.filter = 'blur(2px)';
			 }
		  }
		} catch (error) {
		  console.error('Error soft deleting project:', error);
		  // Handle error
		}
	  }
	//cancel soft delete
	const cancelSoftDelete = async (Projectid,index) => {
		try {
		  await axios.put(`http://localhost:8000/api/project_info/canceldelete/${Projectid}`);
	     // Activate button clicked, hide it
		  // Handle success, e.g., show a message or update UI
		  const newActivationStates = [...activationStates];
         newActivationStates[index] = true; // Activate button clicked, hide it for this row
         setActivationStates(newActivationStates);
		//   alert("Activated successfully")
		} catch (error) {
		  console.error('Error soft deleting project:', error);
		  // Handle error
		}
	  }
	  
	function downloadCSV(data) {
		const csvContent = "data:text/csv;charset=utf-8," 
		  + data.map(row => Object.values(row).join(',')).join('\n');
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "data.csv");
		document.body.appendChild(link);
		link.click();
	  }
	  //for download all data
	 const downloadAllCSV1 = () => {
        downloadCSV(data);
    };
	const downloadAllCSV2 = () => {
        downloadCSV(taskData);
    };
	
	//for alert msg
	const notify1 = () => toast.error("Deactivated successfully",{ transition: Zoom});

	const notify2= () => toast.success("Activated successfully");
	
	
	// for  table blurring
	
	const [showTab1, setShowTab1] = useState(true);
	// const toggleTabs = () => {
	// 	setShowTab1(!showTab1);
	//   };
	  const [error, setError] = useState(null);
	  const[taskData,setTaskData]=useState([])
	  const handleTaskButtonClick = async (email) => {
		console.log(email);
		try {
		  const response = await fetch(`http://localhost:8000/task_details/${email}`);//http://localhost:8000/task_details
		  if (!response.ok) {
			throw new Error('Failed to fetch task data');
		  }
	     console.log(response);
		  const jsonData = await response.json();
		  setTaskData(jsonData);
		  setToggleBarOpen(true);
		  setShowTab1(!showTab1);
		 
		  console.log(jsonData)
		  setError(null);
		} catch (error) {
		  alert('Error fetching task data: ', error);
		}
	  };
	  //for search project
	  const [projectData, setProjectData] = useState(null);
	  const [projectTitle, setprojectTitle] = useState('');
	  //for hanling search of project data
	  const handleChange1 = (event) => {
		setprojectTitle(event.target.value);
	  };

	  //for search projecttitle search in database
	  const searchProject = useCallback(async () => {
		try {
		  const response = await fetch(`http://localhost:8000/project_info1/${projectTitle}`);//http://localhost:3000/projectdetails/:ID
		  if (!response.ok) {
			throw new Error("failed  to fetch");
			
		 
		  }
		  const ans = await response.json();
		  setProjectData(ans);
			 // Set email state here
		// setEmail(ans.Email);
		} catch (error) {
		  console.log(error);
		}
	},[projectTitle]);
	  useEffect(() => {
		if (projectTitle !== '') {
		  searchProject();
		}
	  }, [projectTitle,searchProject]);
	//for togglebar
	const [toggleBarOpen, setToggleBarOpen] = useState(false);
	const closeToggleBar = () => {
		// Close the toggle bar
		setToggleBarOpen(false);
		setShowTab1(true);
	  };
	//for cancelling feature
	const clearSearch = () => {
		setProjectData(null); // Clear search results
		setprojectTitle(''); // Clear search input
	};
	return (
		 <>
		  {/* <input type="text" id="user-ID" placeholder="Project-name" value={projectTitle} name='ID' onChange={handleChange1}/> */}
		 {/* <button id='taskbtn' onClick={toggleTabs}>Dailytask</button> */}
		 {/* <span id= 'p'>Project Details</span> */}
		<button onClick={downloadAllCSV1} id='down-al' style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>Download csv</button>
		{/* <BsCloudDownload  size={18}style={{
      color: "#ffff" ,marginBottom:"-5px"
    }}/> */}
	        <input type="text" id="user-ID" placeholder="Title" value={projectTitle} name='ID' onChange={handleChange1}style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}/>
	        <span  onClick={clearSearch} id='search-close'style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)',color:"grey" }}><IoClose size={20}/></span>
			 {/* <button onClick={searchProject}>Search</button> */}
			{/* <div id='mini-tab'>
			  {projectData && (
              <tr>
                 <td id="tddd">{projectData.Title}</td>
				 <td id="tddd">{projectData.Email}</td>
                 <td id="tddd">{projectData.Description}</td>
                 <td id="tddd">{projectData.Team}</td>
                 <td id="tddd">{projectData.Startdate}</td>
                 <td id="tddd">{projectData.Deadline}</td>
                 <td id="tddd">{projectData.Tools}</td>
                
                  </tr>
                   )}     
            </div> */}
		
		
		
		{
	projectData === null ? (
	  <div id="tab1" style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>
		<table>
		  <thead>
			<tr>
			  <th id='thh'>Title</th>
			  <th id='thh'>Email</th>
			  <th id='thh'>Description</th>
			  <th id='thh'>Team members</th>
			  <th id='thh'>startdate</th>
			  <th id='thh'>deadline</th>
			  <th id='thh'>Teck Stack</th>
			  <th id='thh'>Deactivate/Activate</th>
			  <th id='thh'><IoCloudDownloadOutline size={35}/></th>
			  <th id='thh'>Dailytask</th>
			</tr>
		  </thead>
		  <tbody>
			{
			  data.map((obj, Index) => (
				<tr key={obj.Projectid}>
				  <td id='tdd'>{obj.Title}</td>
				  <td id='tdd'>{obj.Email}</td>
				  <td id='tdd'>{obj.Description}</td>
				  <td id='tdd'>{obj.Team}</td>
				  <td id='tdd'>{obj.Startdate.substring(0, 10)}</td>
				  <td id='tdd'>{obj.Deadline.substring(0, 10)}</td>
				  <td id='tdd'>{obj.Tools}</td>
				  {activationStates[Index] ? (
					<td id='tdd'>
					  <button id="deac-btn1" onClick={() => { handleSoftDelete(obj.Projectid, Index); notify1(); }}>Deactivate</button>
					</td>
				  ) : (
					<td id='tdd'>
					  <button id="deac-btn2" onClick={() => {cancelSoftDelete(obj.Projectid, Index); notify2(); }}>Activate</button>
					</td>
				  )}
				  <td><button onClick={() => downloadCSV([obj])} id='down-btn1'><BsDownload size={20} style={{ color: "#2f9b2f" }}/></button></td>
				  <td><span onClick={() => {handleTaskButtonClick(obj.Email) }}><RiTaskFill  size={20} style={{marginLeft:"20px",color: " #47d86b"}} /></span></td>
				</tr>
			  ))
			}
		  </tbody>
		</table>
	  </div>
	) : (
	  <div id="tab1" style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>
		<table>
		  <thead>
			<tr>
			  <th id='thh'>Title</th>
			  <th id='thh'>Email</th>
			  <th id='thh'>Description</th>
			  <th id='thh'>Team members</th>
			  <th id='thh'>startdate</th>
			  <th id='thh'>deadline</th>
			  <th id='thh'>Teck Stack</th>
			  <th id='thh'>Deactivate/Activate</th>
			  <th id='thh'><IoCloudDownloadOutline size={35}/></th>
			  <th id='thh'>Dailytask</th>
			</tr>
		  </thead>
		  <tbody>
			<tr>
			  <td id="tddd">{projectData.Title}</td>
			  <td id="tddd">{projectData.Email}</td>
			  <td id="tddd">{projectData.Description}</td>
			  <td id="tddd">{projectData.Team}</td>
			  <td id="tddd">{projectData.Startdate}</td>
			  <td id="tddd">{projectData.Deadline}</td>
			  <td id="tddd">{projectData.Tools}</td>
			  <td>
				{activationStates[0] ? (
				  <button id="deac-btn1" onClick={() => { handleSoftDelete(projectData.Projectid, 0); notify1(); }} style={{marginLeft:"15px"}}>Deactivate</button>
				) : (
				  <button id="deac-btn2" onClick={() => {cancelSoftDelete(projectData.Projectid, 0); notify2(); }}style={{marginLeft:"15px"}}>Activate</button>
				)}
			  </td>
			  <td><button onClick={() => downloadCSV([projectData])} id='down-btn1'><BsDownload size={20} style={{ color: "#2f9b2f" }} /></button></td>
			  <td><span onClick={() => {handleTaskButtonClick(projectData.Email) }}style={{marginLeft:"20px"}}><RiTaskFill  size={20} style={{marginLeft:"20px",color: " #47d86b"}} /></span></td>
			</tr>
		  </tbody>
		</table>
	  </div>
	)
  }
			
			
			
	
		   
		    
		{/* taskDetails table */}
		{/* <div id="tab"  style={{ display: showTab1 ? 'none' : 'block' }}>
		
			
			<table>
				<thead>
					<tr>
					<th id='thhh'>Date and Time</th>
					<th id='thhh'>Dailytask</th>
				
					
					
					<th id='thhh'><IoCloudDownloadOutline size={26}/></th>
					</tr>
				</thead>
				<tbody>
				{
                  taskData.map((obj) => (
                 <tr id='trrr' key={obj.ID}>
                 <td id='tddd'>{obj.Date.substring(0, 10)}</td>
                 <td id='tddd'>{obj.Dailytask}</td>
               
                <td><span onClick={() => downloadCSV([obj])} id='down-btn2'><BsDownload size={25} style={{ color: "#2f9b2f" }}/></span></td>
    </tr>
  ))
}
					
					
				</tbody>
			</table>
			
			
		
		</div> */}
		{/* Render the toggle bar */}
		<div className={`toggle-bar ${toggleBarOpen ? 'open' : ''}`} >
        <div className="toggle-bar-content">
		
		<table id='mini'>
		
				<thead>
					<tr>
					<th id='thhh'>Date and Time</th>
					<th id='thhh'>Dailytask</th>
				
					{/* <th id='thh'>Deactivate/Activate</th> */}
					
					<th id='thhh'><IoCloudDownloadOutline size={26}/></th>
					</tr>
				</thead>
				<tbody>
				{
                  taskData.map((obj) => (
                 <tr id='trrr' key={obj.ID}>
                 <td id='tddd'>{obj.Date.substring(0, 10)}</td>
                 <td id='tddd'>{obj.Dailytask}</td>
               
                <td><span onClick={() => downloadCSV([obj])} id='down-btn2'><BsDownload size={22} style={{ color: "#2f9b2f" }}/></span></td>
    </tr>
  ))
}
	
					
					
				</tbody>
			</table>
          <span onClick={closeToggleBar}><IoClose /></span>
		  <button onClick={downloadAllCSV2} id='down-al2' >Download csv</button>
        </div>
		</div>
		
		</>
	);
};

export default Admin;

