import { useState,useEffect,useCallback} from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import { BsCloudDownload } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAddTask } from "react-icons/md";
import { MdOutlineTask } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { BsDownload } from "react-icons/bs";
import { IoCloudDownloadOutline } from "react-icons/io5";
function User(){
  //fetch user using email

  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const Email=useSelector((state)=>state.auth.user.Email)
 
  const[yourData,setYourData]=useState([])
  useEffect(() => {
    fetchData1();
  }, []);

  const fetchData1 = async () => {
    try {
      const response = await fetch(`http://localhost:8000/project_infouser?email=${Email}`);
      const jsonData = await response.json();
      setYourData(jsonData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }; 
   
      //transfer data to  backend
  const searchId = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/project_info/${userId}`);//http://localhost:3000/projectdetails/:ID
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
    
    } catch (error) {
      console.error(error);
    }
},[userId]);
  useEffect(() => {
    if (userId !== '') {
      searchId();
    }
  }, [userId,searchId]);
//UPADTE INPUT value using usestate
  const handleChange = (event) => {
    setUserId(event.target.value);
  };

  //  
  //for project-title to get user data  
  
    const [projectData, setProjectData] = useState(null);
    const [projectTitle, setprojectTitle] = useState('');
    const [email, setEmail] = useState("");
    
    ///use effect
    const searchProject = useCallback(async () => {
      try {
        const response = await fetch(`http://localhost:8000/project_info1/${projectTitle}`);//http://localhost:3000/projectdetails/:ID
        if (!response.ok) {
          throw new Error("failed  to fetch");
          
       
        }
        const ans = await response.json();
        setProjectData(ans);
           // Set email state here
      setEmail(ans.Email);
      } catch (error) {
        console.log(error);
      }
  },[projectTitle]);
    useEffect(() => {
      if (projectTitle !== '') {
        searchProject();
      }
    }, [projectTitle,searchProject]);
    
    //handlechange for title
    const handleChange1 = (event) => {
      setprojectTitle(event.target.value);
    };
    console.log(projectData)
    //edit
    const [editMode, setEditMode] = useState(false);
    //for after edit
    const [editedData, setEditedData] = useState({});
    //for handle edit
    const handleEdit = (yourData) => {
      setEditedData(yourData);
      setEditMode(true);
    };
   
    const handleChanges = (e) => {
      const { name, value } = e.target;
      setEditedData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
    //for submit success
    const [success, setSuccess] = useState(false);
    console.log(editedData.Email)
    //save changes
    const saveChanges = async () => {
      try {
        // Remove projectid from editedData
        const { Projectid, ...dataToSend } = editedData;
    
        await axios.put(`http://localhost:8000/api/update/${dataToSend.Email}`, dataToSend);
        setEditMode(false);
        setSuccess(true);
        toast.success("Updated successfully");
        console.log("Success");
      } catch (error) {
        console.log('Error updating data:', error);
        console.log(editedData);
      }
    };
    
  
    
  //   function downloadCSV(data) {
  //     const csvContent = "data:text/csv;charset=utf-8," 
  //       + data.map(row => Object.values(row).join(',')).join('\n');
  //     const encodedUri = encodeURI(csvContent);
  //     const link = document.createElement("a");
  //     link.setAttribute("href", encodedUri);
  //     link.setAttribute("download", "data.csv");
  //     document.body.appendChild(link);
  //     link.click();
  //     }
  //   //download csv  data in format
  //   const downloadDataCSV = () => {
  //     downloadCSV(userData);//this calling upper class
  // };
  const downloadCSV = (data) => {
    if (!Array.isArray(data)) {
        console.error("Data is not in the expected format.");
        return;
    }

    if (data.length === 0) {
        console.warn("No data available to download.");
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
        + data.map(row => Object.values(row).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Cleanup
};

// Function to handle downloading CSV data for userData
const downloadDataCSV = () => {
    if (userData) {
        downloadCSV(userData);
    } else {
        console.error("No data available to download.");
    }
};
//used to filter only team memmbers

// for navigate to usecase page
const tousecase = (title, teamMember) => {
  
  console.log("Team Member Data:", teamMember);
  console.log("Team Member title:", title);
  navigate("/usecase", { state: { title, teamMember} });
 
};
const tousecaseReadEdit = (title) => {
 
  console.log("Team Member title:", title);
  navigate("/usecaseReadEdit", { state: { title} });
 
};
const totask = () => {
  navigate("/task", { state: { email: Email } });
};
 //for task details
 const [toggleBarOpen, setToggleBarOpen] = useState(false);
	const closeToggleBar = () => {
		// Close the toggle bar
		setToggleBarOpen(false);
		setShowTab1(true);
	  };
 const[taskData,setTaskData]=useState([])
 const [error, setError] = useState(null);
 const [showTab1, setShowTab1] = useState(true);
//  const handleTaskButtonClick1 = async (email) => {
//   console.log(email);
//   try {
//     const response = await fetch(`http://localhost:8000/task_details/${email}`);//http://localhost:8000/task_details
//     if (!response.ok) {
//     throw new Error('Failed to fetch task data');
//     }
//      console.log(response);
//     const jsonData = await response.json();
//     setTaskData(jsonData);
//     setToggleBarOpen(true);
   
//     setShowTab1(!showTab1);
   
//     console.log("output",jsonData)
//     setError(null);
//   } catch (error) {
//     alert('Error fetching task data: ', error);
//   }
//   };
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

    return <>
    <div  className={`cont ${editMode ? 'blur-background' : ''}`}>
        <div>
          {/* <span id="emp-det">Your Details</span> */}
        </div>
      
        
        {/* <input type="text" id="user-ID" placeholder="Project-name" value={projectTitle} name='ID' onChange={handleChange1}/> */}
       {/* <button onClick={searchProject}><CiSearch id="search-icon"/></button>  */}
        {/* <input type="text" id="user-ID" placeholder="Project-ID" value={userId} name='ID' onChange={handleChange}/>
        <CiSearch id="search-icon"/> */}
        <br></br>
        <br></br>

     </div>
    


     <div id="tab-user">
     {editMode ? (
        <div id="box">
          {/* Display input fields for editing */}
          {/* <span id="edit-logo">Edit</span> */}
          <form id="f">
          <label id="titlee">Title</label>
          <input id="edit-title" type="text" name="Title" value={editedData.Title} onChange={handleChanges} />
          <br></br>
          <label id="des">Description</label>
          <input id="edit-des" type="text" name="Description" value={editedData.Description} onChange={handleChanges} />
          <br></br>
          <label id="team">Team</label>
          <input id="edit-team" type="text" name="Team" value={editedData.Team} onChange={handleChanges} />
          <br></br>
          {/* <input type="text" name="Startdate" value={editedData.Startdate} onChange={handleChanges} />
          <input type="text" name="Deadline" value={editedData.Deadline} onChange={handleChanges} /> */}
           <label id="tools">Tools</label>
          <input  id="edit-tools" type="text" name="Tools" value={editedData.Tools} onChange={handleChanges} />
          <br></br>
          <button  id="sub2"  onClick={() => { saveChanges(); setEditMode(false) }}>Save</button>{success && <span>submitted</span>}
          <span id="back-btn" onClick={() => setEditMode(false)}><IoArrowBack size={20} style={{color:" #4f4f52"}}/></span>
          <br></br>
          
          </form>
        </div>
      ) : (
        <table id="table" style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }} >
        <thead>
					<tr>

					<th id="th">Project Title</th>
          <th id="th">Description</th>
					<th id="th">Team members</th>
					<th id="th">Project_startdate</th>
					<th id="th">Project_deadline</th>
					<th id="th">Tools used</th>
				
          <th colSpan={5} id="th">Activity</th>

          {/* <th id="th"> Add Task</th> */}
					</tr>
				</thead>
                <tbody>

           
          {
					yourData.map((obj)=>(
						<tr  key={obj.Projectid}>
							{/* <td  id='tdd'>{obj.Projectid}</td> */}
							<td id='td'>{obj.Title}</td>
							<td id='td'>{obj.Description}</td>
							<td id='td'>{obj.Team}</td>
							<td id='td'>{obj.Startdate.substring(0, 10)}</td> {/* Extract only the date */}
                            <td id='td'>{obj.Deadline.substring(0, 10)}</td> {/* Extract only the date */}
							{/* <td id='tdd'>{obj.Startdate}</td>
							<td id='tdd'>{obj.Deadline}</td> */}
							<td id='td'>{obj.Tools}</td>
							{/* <td id='tdd'>{obj.Files}</td> */}
              <td className="edit" id="td" onClick={() => handleEdit(obj)}><MdEdit  size={18} style={{color:" rgb(97, 94, 94)"}}/></td>
             <td id="td"> <span  onClick={totask}><MdOutlineTask size={20} /> </span></td>
             <td id="td"><span onClick={() => {handleTaskButtonClick(obj.Email) }}><BiTask  size={18} /></span></td>
            
             <td id="td" style={{cursor:"pointer"}}><span onClick={() => tousecaseReadEdit(obj.Title)}>view usecase</span></td>
             <td id="td"><span onClick={() => tousecase(obj.Title,obj.Team)}style={{cursor:"pointer"}}>Add Usecase</span></td>

							
						
						</tr>
					
						
					))
					
			}

                      
                       </tbody>
                       
        </table>
      )}
     
      
      
                
     </div>
     <div className={`toggle-bar ${toggleBarOpen ? 'open' : ''}`} >
        <div className="toggle-bar-content">
		
		<table id='mini1'>
		
				<thead>
					<tr>
					<th id='thhh'>Date and Time</th>
					<th id='thhh'>Dailytask</th>
				
					{/* <th id='thh'>Deactivate/Activate</th> */}
					
					<th id='thhh'><IoCloudDownloadOutline size={26}/></th>
					</tr>
				</thead>
				<tbody>
				{/* {
                  taskData.map((obj) => (
                 <tr id='trrr' key={obj.ID}>
                 <td id='tddd'>{obj.Date.substring(0, 10)}</td>
                 <td id='tddd'>{obj.Dailytask}</td>
               
                <td><span onClick={() => downloadCSV([obj])} id='down-btn2'><BsDownload size={22} style={{ color: "#2f9b2f" }}/></span></td>
    </tr>
  ))
} */}
{Array.isArray(taskData) && taskData.map((obj) => (
  <tr id='trrr' key={obj.ID}>
    <td id='tddd'>{obj.Date.substring(0, 10)}</td>
    <td id='tddd'>{obj.Dailytask}</td>
    <td><span onClick={() => downloadCSV([obj])} id='down-btn2'><BsDownload size={22} style={{ color: "#2f9b2f" }}/></span></td>
  </tr>
))}
	
					
					
				</tbody>
			</table>
          <span onClick={closeToggleBar}><IoClose /></span>
		  {/* <button onClick={downloadAllCSV2} id='down-al2' ><BsCloudDownload  size={30}style={{
      color: "#4a5c7a"
    }}/></button> */}
        </div>
		</div>
    
 
 
     </>
 
 }

 export default User;