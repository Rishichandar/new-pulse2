import React, { useState, useEffect } from "react";

import axios from "axios";

import { WiCloudDown } from "react-icons/wi";
import { Link } from "react-router-dom";
import ForwardIcon from "@mui/icons-material/Forward";
import "./datas.css";
import { useSelector } from "react-redux";
import { fetchSingleData } from "../../HTTPHandler/api";
import AnimatedText from "../animatedText";

const Datas = () => {
  const data = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState([]);

  const [filteredUserData, setFilteredUserData] = useState([]); // State to store filtered user data

  const [error, setError] = useState(null);

  const [searchEmail, setSearchEmail] = useState(""); // State to store the search email
  console.log(data.RoleId);
  useEffect(() => {
    data.RoleId === 1 ? fetchUserData() : SingleData();
  }, []);

  // getting email from redux state and passing to the axios

  // to fetch the single data axios call for user
  const SingleData = () => {
    fetchSingleData(data.Email)
      .then((response) => {
        console.log(response.Response);
        // setUserData(response.Response);
        setFilteredUserData(response.Response);
      })
      .catch((error) => {
        console.error("error fetching data", error);
        setError("Error fetching user data. Please try again later");
      });
  };
  // to fetch the all data for admin
  const fetchUserData = () => {
    axios
      .get("http://localhost:4023/alldatas")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again later.");
      });
  };
  const handleSearch = () => {
    // Filter user data based on searchEmail
    const filteredData = userData.filter((user) =>
      user.Userid.toLowerCase().includes(searchEmail.toLowerCase())
    );
    setFilteredUserData(filteredData);
  };
  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      userData.map((row) => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  };



  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="admincon" style={{ width: "80%", height: "75%" }}>
        <div
          className="display back"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <h1 style={{animation:""}}>{data.RoleId == 1 ? "User Datas" : "Your Data"}</h1> */}
          <AnimatedText
            text={data.RoleId === 1 ? "USERDATA" : "YOURDATA"}
            delay={50}
          />

          <Link to="/main" style={{ textDecoration: "none" }}>
            <ForwardIcon />
            back
          </Link>
        </div>
        <div
          className="search-container"
          style={{ width: "100%", textAlign: "center", paddingBottom: "20px" }}
        >
          {data.RoleId === 1 ? (
            <div>
              <input
                type="text"
                placeholder="Search by email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />

              <button onClick={handleSearch} style={{ height: "30px" }}>
                Search
              </button>
              <button
                onClick={handleDownload}
                className="download-button"
                style={{ position: "relative", left: "300px", top: "7px" }}
              >
                <WiCloudDown size={25} />
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>

        {error && <p>{error}</p>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Activity Type</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserData.map((user) => (
                <tr key={user.id}>
                  <td>{user.Userid}</td>
                  <td>{user.Date}</td>
                  <td>{user.Time}</td>
                  <td>{user.Activity_type}</td>
                  <td>{user.Comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Datas;
