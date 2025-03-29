// Features.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import BusinessOperationalFeatures from './BusinessOperationalFeatures'; // Import the chart component

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://52.3.145.159:8080/api/v1/features')
      .then(res => {
        setFeatures(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load features. Please try again later.');
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        mb: 4
      }}
    >
      <Box 
        sx={{ 
          bgcolor: '#3f51b5', 
          color: 'white', 
          p: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <StarIcon sx={{ mr: 1 }} />
        <Typography variant="h5">Available Features</Typography>
      </Box>
      
      {features.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No features available</Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {features.map((feature, index) => (
            <React.Fragment key={feature.featureId}>
              <ListItem 
                sx={{ 
                  py: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                      {feature.featureName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(feature.createdTime)}
                  </Typography>
                </Box>
              </ListItem>
              {index < features.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Render the BusinessOperationalFeatures chart component below the list */}
      <Box sx={{ mt: 4 }}>
        <BusinessOperationalFeatures />
      </Box>
    </Paper>
  );
};

export default Features;
