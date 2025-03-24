import React, { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  AppBar, 
  Toolbar, 
  IconButton,
  Snackbar,
  Alert,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  Fade
} from "@mui/material";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "./redux/authSlice";

const MyAppBar = () => {
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [currentPlanName, setCurrentPlanName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  const businessUser = JSON.parse(localStorage.getItem("businessUser"));
  const businessId = businessUser ? businessUser.businessId : null;
  const isAdmin = businessUser?.email?.toLowerCase() === "anusha@gmail.com";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const upgradeButtonRef = useRef(null);

  useEffect(() => {
    if (openUpgradeDialog) {
      fetchPlans();
    }
  }, [openUpgradeDialog]);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`http://52.3.145.159:8080/api/v1/plans`);
      setPlans(res.data);

      const businessRes = await axios.get(`http://52.3.145.159:8080/api/v1/businesses/${businessId}`);
      setCurrentPlanId(businessRes.data.planId);
      setCurrentPlanName(businessRes.data.planName);
    } catch (error) {
      console.error("Error fetching plans:", error);
      showSnackbar("Failed to load plans. Please try again.", "error");
    }
  };

  const handleUpgradePlan = async (planId) => {
    try {
      await axios.put(`http://52.3.145.159:8080/api/v1/plans/${businessId}/upgrade-plan/${planId}`);
      showSnackbar("Plan upgraded successfully!", "success");
      setOpenUpgradeDialog(false);
    } catch (error) {
      console.error("Upgrade error:", error);
      showSnackbar("Failed to upgrade plan.", "error");
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); 
  };

  const handleUpgradeClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenUpgradeDialog(true);
  };

  const handleCloseUpgrade = () => {
    setOpenUpgradeDialog(false);
    setAnchorEl(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: "#ff4d6d",
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton 
              size="large" 
              edge="start" 
              color="inherit" 
              sx={{ 
                mr: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              onClick={() => navigate("/")}
              sx={{ 
                fontWeight: 'bold',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9
                },
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Map Communications
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to={`/dashboard/${businessId}`}
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to={`/business-calendar/${businessId}`}
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              Calendar
            </Button>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              Logout
            </Button>
            {!isAdmin && (
              <Button 
                color="inherit" 
                ref={upgradeButtonRef}
                onClick={handleUpgradeClick}
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.7)'
                  }
                }}
              >
                Upgrade
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Popper for Upgrade Dialog */}
      <Popper
        open={openUpgradeDialog}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
        disablePortal
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: 'top right' }}
          >
            <Paper
              elevation={6}
              sx={{
                mt: 1,
                width: 320,
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <ClickAwayListener onClickAway={handleCloseUpgrade}>
                <Box>
                  <DialogTitle
                    sx={{
                      backgroundColor: '#ff4d6d',
                      color: 'white',
                      fontWeight: 'bold',
                      py: 2
                    }}
                  >
                    Upgrade Your Plan
                  </DialogTitle>
                  <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      Current Plan: <span style={{ fontWeight: 'bold' }}>{currentPlanName}</span>
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {plans.map((plan) => (
                        <Button
                          key={plan.planId}
                          variant={plan.planId === currentPlanId ? "outlined" : "contained"}
                          fullWidth
                          disabled={plan.planId === currentPlanId}
                          onClick={() => handleUpgradePlan(plan.planId)}
                          sx={{
                            py: 1.5,
                            backgroundColor: plan.planId === currentPlanId ? 'transparent' : '#ff4d6d',
                            color: plan.planId === currentPlanId ? '#ff4d6d' : 'white',
                            border: plan.planId === currentPlanId ? '1px solid #ff4d6d' : 'none',
                            '&:hover': {
                              backgroundColor: plan.planId === currentPlanId ? 'rgba(255, 77, 109, 0.08)' : '#ff3d5d'
                            },
                            '&.Mui-disabled': {
                              color: '#ff4d6d',
                              borderColor: '#ff4d6d',
                              opacity: 0.6
                            }
                          }}
                        >
                          {plan.planName}
                        </Button>
                      ))}
                    </Box>
                  </DialogContent>
                  <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                    <Button 
                      onClick={handleCloseUpgrade}
                      sx={{
                        color: '#555',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.05)'
                        }
                      }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={handleSnackClose}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert 
          onClose={handleSnackClose} 
          severity={snackSeverity} 
          elevation={6}
          variant="filled"
          sx={{ 
            width: "100%",
            alignItems: "center"
          }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyAppBar;