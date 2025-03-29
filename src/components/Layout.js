// components/Layout.js
import React, { useState } from "react";
import { 
  Drawer, 
  Box, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Container
} from "@mui/material";
import { useNavigate, Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import CallIcon from '@mui/icons-material/Call';
import CloseIcon from '@mui/icons-material/Close';

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => setDrawerOpen(prev => !prev);

  const menuItems = [
    { text: "Plans", icon: <LocalOfferIcon />, path: "/plans" },
    { text: "Features", icon: <StarIcon />, path: "/features" },
    { text: "Call Strategies", icon: <CallIcon />, path: "/call-campaigns" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Removed the AppBar from here since it's already in MyAppBar component */}
      
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: isMobile ? 250 : 280,
            backgroundColor: '#fff',
            borderRight: '1px solid rgba(0,0,0,0.08)'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: '#f05f77',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Menu
          </Typography>
          <IconButton 
            onClick={toggleDrawer} 
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List sx={{ pt: 1 }}>
          {menuItems.map(({ text, icon, path }, index) => (
            <React.Fragment key={text}>
              <ListItem 
                button 
                onClick={() => handleMenuClick(path)}
                sx={{
                  py: 1.5,
                  pl: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(240,95,119,0.08)',
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#f05f77',
                  minWidth: 40
                }}>
                  {icon}
                </ListItemIcon>
                <ListItemText 
                  primary={text} 
                  primaryTypographyProps={{
                    fontWeight: 500
                  }}
                />
              </ListItem>
              {index < menuItems.length - 1 && (
                <Divider variant="middle" sx={{ my: 0.5 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;