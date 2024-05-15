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
import { IoSearchOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
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
	  const handleTaskButtonClick = async (title) => {
		console.log(title);
		try {
		  const response = await fetch(`http://localhost:8000/task_details/${title}`);//http://localhost:8000/task_details
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
	const [showSearchBar, setShowSearchBar] = useState(false);
	const toggleSearchBar = () => {
		setShowSearchBar(!showSearchBar);
	  };
	return (
		 <>
		 <span id='all' style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>All Projects<IoMdArrowDropdown size={15} id='all-icon' /></span>
		  {/* <input type="text" id="user-ID" placeholder="Project-name" value={projectTitle} name='ID' onChange={handleChange1}/> */}
		 {/* <button id='taskbtn' onClick={toggleTabs}>Dailytask</button> */}
		 {/* <span id= 'p'>Project Details</span> */}
		<button onClick={downloadAllCSV1} id='down-al' style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>Download csv</button>
		{/* <BsCloudDownload  size={18}style={{
      color: "#ffff" ,marginBottom:"-5px"
    }}/> */}
	           <span id='search1' onClick={toggleSearchBar}><FiSearch  size={20}/></span>
	         {/* Search Bar */}
      {showSearchBar && (
        <>
          <input
            type="text"
            id="user-ID"
            placeholder="Title"
            value={projectTitle}
            name='ID'
            onChange={handleChange1}
            style={{ filter: showSearchBar ? 'blur(0px)' : 'blur(20px)' }}
          />
          <span onClick={clearSearch} id='search-close' style={{ color: "grey" }}><IoClose size={20} /></span>
          <span id='search-icon'><IoSearchOutline size={16} /></span>
        </>
      )}
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
            <th>Title</th>
            <th>Email</th>
            <th>Description</th>
            <th>Team members</th>
            <th>Start Date</th>
            <th>Deadline</th>
            <th>Tech Stack</th>
            <th>Deactivate/Activate</th>
            <th>Daily Task</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {data.map((obj, Index) => (
            <tr key={obj.Projectid}>
              <td>{obj.Title}</td>
              <td>{obj.Email}</td>
              <td>{obj.Description}</td>
              <td>{obj.Team}</td>
              <td>{obj.Startdate.substring(0, 10)}</td>
              <td>{obj.Deadline.substring(0, 10)}</td>
              <td>{obj.Tools}</td>
              {activationStates[Index] ? (
                <td>
                  <button id='deac-btn1' onClick={() => { handleSoftDelete(obj.Projectid, Index); notify1(); }}>Deactivate</button>
                </td>
              ) : (
                <td>
                  <button id='deac-btn2' onClick={() => {cancelSoftDelete(obj.Projectid, Index); notify2(); }}>Activate</button>
                </td>
              )}
              <td><span onClick={() => {handleTaskButtonClick(obj.Title) }}><BiTask size={20} style={{ marginLeft: "8px", color: "#47d86b" }} /></span></td>
              <td><button id='down-btn1' onClick={() => downloadCSV([obj])}><IoCloudDownloadOutline size={25} style={{ color: "grey" }} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div id="tab1" style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Email</th>
            <th>Description</th>
            <th>Team members</th>
            <th>Start Date</th>
            <th>Deadline</th>
            <th>Tech Stack</th>
            <th>Deactivate/Activate</th>
            <th>Daily Task</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{projectData.Title}</td>
            <td>{projectData.Email}</td>
            <td>{projectData.Description}</td>
            <td>{projectData.Team}</td>
            <td>{projectData.Startdate}</td>
            <td>{projectData.Deadline}</td>
            <td>{projectData.Tools}</td>
            <td>
              {activationStates[0] ? (
                <button id='deac-btn1' onClick={() => { handleSoftDelete(projectData.Projectid, 0); notify1(); }} style={{ marginLeft: "15px" }}>Deactivate</button>
              ) : (
                <button id='deac-btn2' onClick={() => {cancelSoftDelete(projectData.Projectid, 0); notify2(); }} style={{ marginLeft: "15px" }}>Activate</button>
              )}
            </td>
            <td><span onClick={() => {handleTaskButtonClick(projectData.Title) }} style={{ marginLeft: "5px" }}><BiTask size={20} style={{ marginLeft: "20px", color: "#47d86b" }} /></span></td>
            <td><button  id='down-btn1' 
			 onClick={() => downloadCSV([projectData])}><IoCloudDownloadOutline size={25} style={{ color: "grey" }} /></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

			
			
	
		   
		    
		
		{/* Render the toggle bar */}
		<div className={`toggle-bar ${toggleBarOpen ? 'open' : ''}`} >
        <div className="toggle-bar-content">
		
		<table id='mini1'>
  <thead>
    <tr>
      <th>Usecase</th>
      <th>Date</th>
      <th>Time</th>
      <th>Daily Task</th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(taskData) && taskData.map((obj) => (
      <tr key={obj.ID}>
        <td>{obj.usecasetitle}</td>
        <td>{obj.Date.substring(0, 10)}</td>
        <td>{obj.Time}</td>
        <td>{obj.Dailytask}</td>
      </tr>
    ))}
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

// Inside your searchProject function, after setting the project data, fetch the task data
