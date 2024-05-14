require("dotenv").config();
const express = require("express");
const db = require("./app/node-mysql-server/db-con");
const app = express();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const cors = require("cors");
// const { hash } = require("bcrypt");

// const corsOptions = {
//   origin: "https://striking-mongoose-logical.ngrok-free.app", // Only allow requests from this origin
//   //methods: ["GET", "POST"], // Allow only specified methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Allow only specified headers
//   credentials: true, // Enable sending cookies and authorization headers
// };
app.use(cors());
app.use(express.json());
// const { GenericResponse, ResponseStatus } = require("./GenericResponse");
// const ErrorMessage = require("./ErrorMessage");
const swaggerui = require("swagger-ui-express");
const swaggerDocument = require("./app/SwaggerSpecs/swagger.json");
// const  swaggerJsDoc= require("swagger-jsdoc");

// const authRouter = require("./app/routes/auth");
// app.use("/",authRouter)

const routePath = require("./app/controllers/routes/auth");
const { GenericResponse, ResponseStatus } = require("./GenericResponse");

// !  FOR CREATE
app.use("/user/create", routePath);
// !  FOR LOGIN
app.use("/user/login", routePath);
// !  FOR AUTH
app.use("/", routePath);
// !  FOR RESET PASS
app.use("/user/reset", routePath);

// !  FOR FORGOTPASS
app.use("/user/forgot", routePath);
// !  Fetching single data
app.use("/singleData", routePath);

// !  FOR CLEAR ALL THE ENTRIES(FOR CHECKING)
// app.use("/user/clear", require("./app/routes/path"));

app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocument));
// *  IN THIS LINE CORS IS USED TO PASS THE DATA TO REACT

// *  THIS IS IMPORTANT ONE FOR API CATCH

// !  FETCH ALL
app.get("/user/fetch", (req, res) => {
  const sql = "SELECT * FROM appuser";
  db.query(sql, (err, data) => {
    if (err) return res.json({ error: err.message });
    return res.json(data);
  });
});

// app.post("/user/forgot", (req, res) => {
//   const { Email } = req.body;
//   if (!Email) {
//     return res
//       .status(400)
//       .json({ status: "Failure", message: "Email address is required" });
//   }

//   const sql = "SELECT * FROM appuser WHERE Email = ?";
//   db.query(sql, [Email], async (err, data) => {
//     if (err || data.length === 0) {
//       return res
//         .status(404)
//         .json({ status: "Failure", message: "User not found" });
//     }

//     const user = data[0];
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SecretKey, {
//       expiresIn: "1h",
//     });

//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_API_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: user.Email,
//       subject: "Reset your password",
//       text: `Follow this link to reset your password: http://localhost:3000/reset/?token=${token}`,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       return res.status(200).json(
//         new GenericResponse(ResponseStatus.Success, null, {
//           Token: token,
//         })
//     } catch (error) {
//       console.error("Error sending email:", error);
//       res
//         .status(500)
//         .json({ status: "Failure", message: "Failed to send email" });
//     }
//   });
// });

app.post("/attendance_app", (req, res) => {
  const { Date, Time, Userid, Activity_type, Comments } = req.body;

  let sql = "";
  let values = [];

  // Determine the SQL query based on the activity type
  switch (Activity_type) {
    case "login":
    case "logout":
    case "lunchin":
    case "lunchout":
      sql =
        "INSERT INTO time_table (Userid, Date, Time, Activity_type, Comments) VALUES (?, ?, ?, ?, ?)";
      values = [Userid, Date, Time, Activity_type, Comments];
      break;
    case "breakin":
    case "breakout":
      sql =
        "INSERT INTO time_table (Userid, Date, Time, Activity_type, Comments) VALUES (?, ?, ?, ?, ?)";
      values = [Userid, Date, Time, Activity_type, Comments];
      break;
    default:
      return res.status(400).send("Invalid activity type");
  }

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error inserting data into database");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("Data inserted successfully");
    }
  });
});

app.get("/alldatas", (req, res) => {
  const sql = "SELECT * FROM time_table";
  db.query(sql, (error, data) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.json(data);
    }
  });
});
// app.get("/singleData", (req, res) => {
//   const user = req.query.email;
//   const sql = "SELECT * FROM time_table where email=?";
//   db.query(sql, [user], (error, data) => {
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     } else {
//       return res.json(data);
//     }
//   });
// });

// !    FOR RESEST PASSWORD THROUGH THE LINK
const port = 8000;
app.listen(port, () => {
  console.log(`app running on port: ${port}`);
});
//rishi
app.put("/api/project_info/delete/:Projectid", (req, res) => {
    const projectId = req.params.Projectid;
    
    const sql = "UPDATE project_info SET is_deleted = 1 WHERE Projectid = ?";
    db.query(sql, [projectId], (error, result) => {
      if (error) {
        console.error('Error soft deleting project details:', error);
        return res.status(500).json({ error: 'Internal app error' });
      }
      res.status(200).json({ message: 'Project details soft deleted successfully' });
    });
  });
// Cancel Soft delete project details by ID
app.put("/api/project_info/canceldelete/:Projectid", (req, res) => {
    const projectId = req.params.Projectid;
    
    const sql = "UPDATE project_info SET is_deleted = 0 WHERE Projectid = ?";
    db.query(sql, [projectId], (error, result) => {
      if (error) {
        console.error('Error soft deleting project details:', error);
        return res.status(500).json({ error: 'Internal app error' });
      }
      res.status(200).json({ message: 'Project details soft deleted successfully' });
    });
  });
//creating record

//post(updated)
app.post("/project_infos",(req,res)=>{
    const sql="INSERT INTO project_info (`Title`,`Email`,`Description`,`Team`,`Startdate`,`Deadline`,`Tools`,`Files`) Values (?)";
    let details = [
        req.body.Title,
        req.body.Email,
        req.body.Description,
        req.body.Team,
        req.body.Startdate,
        req.body.Deadline,
        req.body.Tools,
        req.body.Files,
        

]
    //execute query
   
   db.query(sql,[details],(error,data)=>{
        if(error){
            console.log(error);
           
        }
        else{
            console.log("hi");
            return res.json(data);
        }

    });
});
//below code for posting a date and taskdetails
// app.post("/taskdetails", (req, res) => {
//     const { taskDetails,emailid,Title } = req.body;
//     const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
//     const query = 'INSERT INTO taskdetails (Date, Dailytask, Email,Title) VALUES (?,?,?,?)';
//     db.query(query, [currentDate, taskDetails,emailid,Title], (err, results) => {
//       if (err) {
//         console.error('Error executing MySQL query:', err);
//         res.status(500).json({ error: 'Failed to add task' });
//         return;
//       }
//       console.log('Task added');
//       res.status(200).json({ message: 'Task added successfully' });
//     });
//   });
app.post("/taskdetails", (req, res) => {
  const { taskDetails, emailid, Title,summary} = req.body;
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);
  const formattedTime = currentDate.toISOString().slice(11, 19);

  const query = 'INSERT INTO taskdetails (Date, Time, Dailytask, Email, Title, usecasetitle) VALUES (?, ?, ?, ?, ?,?)';
  db.query(query, [formattedDate, formattedTime, taskDetails, emailid, Title,summary], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to add task' });
      return;
    }
    console.log('Task added');
    res.status(200).json({ message: 'Task added successfully' });
  });
});

//(updated)for view the records and get the data in database
app.get("/project_info",(req,res) => {
    const sql="SELECT * FROM project_info"
    db.query(sql,function(error,result){
        if(error){
            return res.json(error);

        }
        else{
            return res.json(result);

        }
    })
});

//(updated)for view the login user records and get the data in database
app.get("/project_infouser", (req, res) => {
  const userEmail = req.query.email; // Extract email from query parameters
  const sql = "SELECT * FROM project_info WHERE email = ?"; // Adjust SQL query
  db.query(sql, [userEmail], function(error, result) {
    if (error) {
      return res.json(error);
    } else {
      return res.json(result);
    }
  });
});
//for getting all details from from task details
// app.get("/project_info1",(req,res) => {
//   const sql="SELECT * FROM taskdetails"
//   db.query(sql,function(error,result){
//       if(error){
//           return res.json(error);

//       }
//       else{
//           return res.json(result);

//       }
//   })
// });
// app.get("/task_details/:Email", (req, res) => {
//   const  Email = req.params.Email; // Use req.params to access URL parameters
//   const sql = "SELECT * FROM taskdetails WHERE Email = ?";
//   db.query(sql, Email, function (error, result) {
//     if (error) {
//       return res.status(500).json({ err});
//     } else {
//       return res.json(result);
//     }
//   });
// });
// app.get("/task_details/:Email", (req, res) => {
//   let personID = req.params.Email;
//   let query=`SELECT * FROM taskdetails WHERE Email = ?`;//`SELECT * FROM project_info WHERE Projectid =${personID}`
 
//   db.query(query,personID, (err, results) => {
//       if (err) {
//         console.error('Error querying MySQL database:', err);
//         res.json({ error: 'Internal app error' });
//         return;
//       }
//       // Check if person exists
// if (results.length === 0) {
//   res.json({ results });
//   return; 
// }

// // Person found, send person data in response
// res.json(results);
// });

// });
// app.get("/task_details/:Title", (req, res) => {
//   let Projecttitle = req.params.Title; // Corrected variable name
//   let query = `SELECT * FROM taskdetails WHERE Title = ?`;

//   db.query(query, [Projecttitle], (err, results) => { // Passing an array for the parameters
//     if (err) {
//       console.error('Error querying MySQL database:', err);
//       res.json({ error: 'Internal app error' });
//       return;
//     }
    
//     // Check if task details were found for the email
//     if (results.length === 0) {
//       res.json({ Error: 'No task details found for the email provided' });
//       console.log(err);
//       return;
//     }

//     // Task details found, send them in the response
//     res.json(results);
//   });
// });
app.get("/task_details/:title", (req, res) => {
  let Projecttitle = req.params.title; // Use lowercase 'title'
  let query = `SELECT * FROM taskdetails WHERE Title = ?`;

  db.query(query, [Projecttitle], (err, results) => { // Use lowercase 'title' here as well
    if (err) {
      console.error('Error querying MySQL database:', err);
      res.json({ error: 'Internal app error' });
      return;
    }
    
    // Check if task details were found for the title
    if (results.length === 0) {
      res.status(404).json({ Error: 'No task details found for the title provided' }); // Changed to 404 status
      console.log(err);
      return;
    }

    // Task details found, send them in the response
    res.json(results);
  });
});

//for getting single value based on id
app.get("/project_info/:Projectid", (req, res) => {
    let personID = req.params.Projectid;
    let query=`SELECT * FROM project_info WHERE Projectid in (?) AND  is_deleted=0`;//`SELECT * FROM project_info WHERE Projectid =${personID}`
   
    db.query(query,personID, (err, results) => {
        if (err) {
          console.error('Error querying MySQL database:', err);
          res.json({ error: 'Internal app error' });
          return;
        }
        // Check if person exists
if (results.length === 0) {
    res.json({ error: 'Person not found' });
    return; 
  }

  // Person found, send person data in response
  res.json(results[0]);
});

});
////for getting single value based on project-title ( /projectdetails/:Project_Title)
app.get("/project_info1/:Title", (req, res) => {
  let title = req.params.Title;
  let query = `SELECT * FROM project_info WHERE Title = ? AND is_deleted = 0`;

  db.query(query, [title], (err, results) => {
    if (err) {
      console.error('Error querying MySQL database:', err);
      res.json({ error: 'Internal app error' });
      return;
    }

    // Check if project exists
    if (results.length === 0) {
      res.json({ error: 'Project not found' });
      return;
    }

    // Project found, send project data in response
    res.json(results[0]);
  });
});


// 
// app.put('/api/update/:Email', (req, res) => {
//   const projectemail = req.params.Email;
//   let editedData = req.body;
  
//   // Removing projectid from editedData if it exists
//   if (editedData.hasOwnProperty('projectid')) {
//     delete editedData.projectid;
//   }

//   // Changing date format correctly
//   if (editedData.Startdate) {
//     const startdate = new Date(editedData.Startdate);
//     editedData.Startdate = startdate.toISOString().split('T')[0]; //format yyyy-mm-dd
//   }
//   if (editedData.Deadline) {
//     const deadline = new Date(editedData.Deadline);
//     editedData.Deadline = deadline.toISOString().split('T')[0]; //format yyyy-mm-dd
//   }
  
//   // Update the corresponding row in the database
//   db.query('UPDATE project_info SET ? WHERE Email = ?', [editedData, projectemail], (error, results) => {
//     if (error) {
//       console.error('Error updating data:', error);
//       res.status(500).send('Error updating data in the database');
//       return;
//     }
//     res.status(200).send('Data updated successfully');
//   });
// });
app.put('/api/update/:Title', (req, res) => {
  const projectTitle = req.params.Title;
  let editedData = req.body;
  
  // Removing projectid from editedData if it exists
  if (editedData.hasOwnProperty('projectid')) {
    delete editedData.projectid;
  }

  // Changing date format correctly
  if (editedData.Startdate) {
    const startdate = new Date(editedData.Startdate);
    editedData.Startdate = startdate.toISOString().split('T')[0]; //format yyyy-mm-dd
  }
  if (editedData.Deadline) {
    const deadline = new Date(editedData.Deadline);
    editedData.Deadline = deadline.toISOString().split('T')[0]; //format yyyy-mm-dd
  }
  
  // Update the corresponding row in the database
  db.query('UPDATE project_info SET ? WHERE Title = ?', [editedData, projectTitle], (error, results) => {
    if (error) {
      console.error('Error updating data:', error);
      res.status(500).send('Error updating data in the database');
      return;
    }
    res.status(200).send('Data updated successfully');
  });
});
//for posting usecase details
// app.post('/usecases', (req, res) => {
//   const { title, teamMember, usecase } = req.body;
  
//   // Insert data into the database
//   const sql = `INSERT INTO usecase (title, team_members, usecases) VALUES (?, ?, ?)`; // Assuming the column names in your database are 'team_member' and 'use_case'
//   db.query(sql, [title, teamMember, usecase], (err, result) => { // No need to stringify the teamMember and usecase
//     if (err) {
//       console.log('Error inserting data into database:', err);
//       res.status(500).json({ error: 'Failed to insert data into database' });
//     } else {
//       console.log(result);
//       res.status(200).json({ message: 'Data inserted successfully' ,result});
//     }
//   });
// });
// app.post('/usecase', (req, res) => {
//   const formData = req.body;
//   const sql = 'INSERT INTO usecase SET ?';
//   connection.query(sql, formData, (err, result) => {
//     if (err) {
//       console.log('Error adding usecase:', err);
//       res.status(500).send('Failed to add usecase');
//       return;
//     }
//     console.log('Use case added successfully');
//     res.status(201).send(result);
//   });
// });
app.post('/usecase', (req, res) => {
  const formData = req.body;
  
  // Extracting the date part only from formData.enddate
  const endDate = formData.enddate ? new Date(formData.enddate).toISOString().split('T')[0] : null;

  const sql = 'INSERT INTO usecase (`summary`, `team`, `status`, `enddate`, `attachment`, `reporterid`, `description`,`title`) VALUES (?, ?, ?, ?, ?, ?,?,?)';
  const values = [
    formData.summary,
    formData.team,
    formData.status,
    endDate, // Using the extracted date part
    formData.attachment,
    formData.reporterid,
    formData.description,
    formData.title,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding use case:', err);
      res.status(500).send('Failed to add use case');
      return;
    }
    console.log('Use case added successfully');
    res.status(201).send(result);
  });
});

// app.post('/usecase', (req, res) => {
//   const sql = 'INSERT INTO usecase (`summary`, `team`, `status`, `enddate`, `attachment`, `description`) VALUES (?, ?, ?, ?, ?, ?)';
//   const values = [
//     req.body.summary,
//     req.body.team,
//     req.body.status,
//     req.body.enddate,
//     req.body.attachment,
//     req.body.description,
//   ];

//   db.query(sql, values, (error, data) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).send('Failed to add usecase');
//     } else {
//       console.log('Usecase added successfully');
//       return res.json(data);
//     }
//   });
// });

///USECASEES
// for Read USECASE
// app.get('/usecases/:title', (req, res) => {
//   const title = req.params.title;
//   const sql = `SELECT * FROM usecase WHERE title = ?`;
//   db.query(sql, [title], (err, results) => {
//       if (err) {
//           console.error('Error fetching usecases:', err);
//           res.status(500).json({ error: 'Failed to fetch usecases' });
//       } else {
//           res.status(200).json(results);
//       }
//   });
// });
// app.get('/usecases', (req, res) => {
//   const sql = 'SELECT * FROM usecase'; // Assuming your table is named "usecases"
//   db.query(sql, (err, result) => {
//     if (err) {
//       res.status(500).json({ error: 'Error retrieving use cases' });
//     } else {
//       res.status(200).json(result);
//     }
//   });
// });
app.get('/usecases', (req, res) => {
  const { title } = req.query;
  let sql = 'SELECT * FROM usecase'; // Assuming your table is named "usecases"

  // If email is provided, add a WHERE clause to filter results by email
  if (title) {
    sql += ` WHERE title = '${title}'`;
  }

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving use cases' });
     
    } else {
      res.status(200).json(result);
    }
  });
});


//put method
app.put('/usecases/:id', (req, res) => {
  const { id } = req.params;
  const editedUsecase = req.body;

  // Convert ISO date format to MySQL date format
  editedUsecase.enddate = new Date(editedUsecase.enddate).toISOString().split('T')[0];

  const sql = 'UPDATE usecase SET ? WHERE id = ?';
  db.query(sql, [editedUsecase, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error updating use case' });
      console.log(err);
    } else {
      res.status(200).json({ message: 'Use case updated successfully' });
      console.log(result);
    }
  });
});
