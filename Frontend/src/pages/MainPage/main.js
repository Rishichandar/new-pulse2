import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { CheckToken } from "../../HTTPHandler/api";
import Resetpage from "../ResetPasspage/resetpage";
// import UserMenu from "../../Component/usermenu";
// import Content from "../../Component/layout";
import { useDispatch, useSelector } from "react-redux";
import { authenticate, logout } from "../../Redux/authSlice/AuthSlice";
import { useNavigate } from "react-router-dom";
import Layout from "../../Component/layout";


function Main() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  // ? for auth the user

  // ? for error message
  const [message, setMessage] = useState("");
  const [open, setOpen] = React.useState(true);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ? for getting the name

  useEffect(() => {
    CheckToken()
      .then((res) => {
        if (res.Status === "Success") {
          dispatch(authenticate({ user: res.Response }));
        } else {
          dispatch(logout());
          navigate("/");
        }
      })
      .then((err) => {
        console.log(err);
        setMessage(err);
      });
  }, []);

  return auth ? (
    <Box sx={{ margin: 0, padding: 0, boxSizing: "border-box" }}>
      <Box sx={{ width: "100vw", height: "100vh" }}>
        <Layout />
      </Box>
      {user.IsFirstLogin === 1 ? (
        <Modal open={open}>
          <Resetpage closeFn={handleClose} email={user.Email} />
        </Modal>
      ) : (
        <div></div>
      )}
    </Box>
  ) : (
    <Box>{message}</Box>
  );
}

export default Main;
