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
import { IoMdArrowDropdown } from "react-icons/io";
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
    
        await axios.put(`http://localhost:8000/api/update/${dataToSend.Title}`, dataToSend);
        setEditMode(false);
        setSuccess(true);
        toast.success("Updated successfully");
    
        // Update the background data with editedData
        const updatedYourData = yourData.map(item => item.Projectid === editedData.Projectid ? editedData : item);
        setYourData(updatedYourData);
    
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
const tousecase = (title, teamMember,email) => {
  
  console.log("Team Member Data:", teamMember);
  console.log("Team Member title:", title);
  console.log("Email:", email);
  navigate("/usecase", { state: { title, teamMember,email} });
 
};
const tousecaseReadEdit = (title,email) => {
 
  console.log("Team Member title:", title);
  navigate("/usecaseReadEdit", { state: { title,email} });
 
};
const totask = (title) => {
  navigate("/task", { state: { email: Email, title: title } });
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
const handleTaskButtonClick = async (title) => {
  console.log("title:",title);
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
    setShowYourInfo(false);
   
    console.log(jsonData)
    setError(null);
  } catch (error) {
    toast.error("didnt add any taskdetails");
  }
  };
  const [showYourInfo, setShowYourInfo] = useState(true); // State to control visibility

    return <>
    
    {!editMode && showYourInfo && (
        <span id="your-info">
          My Projects<IoMdArrowDropdown id="icon1" />
        </span>
      )}
 
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
          <button  id="sub2"  onClick={() => { saveChanges(); setEditMode(false) }}>Save</button>
          <span id="back-button" onClick={() => setEditMode(false)}><IoArrowBack size={20} style={{color:" #4f4f52"}}/></span>
          <br></br>
          
          </form>
        </div>
      ) : (
        <table id="table" style={{ filter: showTab1 ? 'blur(0px)' : 'blur(20px)' }}>
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Description</th>
            <th>Team members</th>
            <th>Start Date</th>
            <th>Deadline</th>
            <th>Tools used</th>
            <th colSpan={4}>Activity</th>
          </tr>
        </thead>
        <tbody>
          {yourData.map((obj) => (
            <tr key={obj.Projectid}>
              <td>{obj.Title}</td>
              <td>{obj.Description}</td>
              <td>{obj.Team}</td>
              <td>{obj.Startdate.substring(0, 10)}</td> {/* Extract only the date */}
              <td>{obj.Deadline.substring(0, 10)}</td> {/* Extract only the date */}
              <td>{obj.Tools}</td>
              <td className="edit" onClick={() => handleEdit(obj)}><MdEdit size={18} style={{ color: "rgb(97, 94, 94)" }} /></td>
              <td style={{ cursor: "pointer" }}><span onClick={() => tousecase(obj.Title, obj.Team, obj.Email)} style={{ cursor: "pointer" }}>Add Usecase</span></td>
              <td style={{ cursor: "pointer" }}><span onClick={() => tousecaseReadEdit(obj.Title, obj.Email)}>Edit usecase</span></td>
              <td className="task"><span onClick={() => { handleTaskButtonClick(obj.Title) }}><BiTask size={18} /></span></td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
     
      
      
                
     </div>
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
		  {/* <button onClick={downloadAllCSV2} id='down-al2' ><BsCloudDownload  size={30}style={{
      color: "#4a5c7a"
    }}/></button> */}
        </div>
		</div>
    
 
 
     </>
 
 }

 export default User;