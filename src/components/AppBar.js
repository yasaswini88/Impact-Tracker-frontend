// src/components/AppBar.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { logout } from "./redux/authSlice";

const MyAppBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Go back to home
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#ff4d6d" }}>
      <Toolbar>
        {/* App Title */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Impact Tracker
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/dashboard/1" 
            sx={{ fontWeight: "bold" }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/business-calendar/1" 
            sx={{ fontWeight: "bold" }}
          >
            Calendar
          </Button>
          <Button
            color="inherit"
            sx={{ fontWeight: "bold" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
