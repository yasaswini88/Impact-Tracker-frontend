// src/components/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// MUI v5 components
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";

// Redux
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "./redux/authSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for email & password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    // Admin shortcut login
    if (email === "Anusha@gmail.com" && password === "Anusha") {
      const adminUser = {
        businessId: -1, // special ID for admin
        email,
        businessType: "admin"
      };

      dispatch(loginSuccess(adminUser));
      localStorage.setItem("businessUser", JSON.stringify(adminUser));
      navigate("/sales-admin-dashboard");
      // navigate("/sales-admin-dashboard2");
      return;
    }

    try {
      const res = await axios.post("http://52.3.145.159:8080/api/v1/businesses/login", {
        email,
        password
      });

      const data = res.data;

      const userPayload = {
        businessId: data.businessId,
        email: data.email,
        businessType: data.businessType
      };

      dispatch(loginSuccess(userPayload));
      localStorage.setItem("businessUser", JSON.stringify(userPayload));
      navigate(`/dashboard/${data.businessId}`);
    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginFailure("Invalid email or password."));
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url("https://media.istockphoto.com/id/1413190521/vector/customer-service-call-center-hotline-operators-with-headphones-on-laptop-screen.jpg?s=612x612&w=0&k=20&c=3f4VzU7IbJoZt4adKXuPnhRroUl-3QsLmGN6LjblJqk=")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "darken",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 300,
          opacity: 0.9
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Business Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Home;
