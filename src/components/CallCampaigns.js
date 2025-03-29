// CallCampaigns.js
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
  Alert,
  Card,
  CardContent
} from '@mui/material';
import CallIcon from '@mui/icons-material/Call';

const CallCampaigns = () => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://52.3.145.159:8080/api/v1/call-campaign-strategies')
      .then(res => {
        setStrategies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load strategies. Please try again later.');
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
        overflow: 'hidden'
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
        <CallIcon sx={{ mr: 1 }} />
        <Typography variant="h5">Call Campaign Strategies</Typography>
      </Box>
      
      {strategies.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No strategies available</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          {strategies.map((strategy, index) => (
            <Card 
              key={strategy.id} 
              sx={{ 
                mb: 2, 
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {strategy.strategyName}
                  </Typography>
                  <Chip 
                    label={formatDate(strategy.createdTime)} 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(63, 81, 181, 0.1)', 
                      color: '#3f51b5' 
                    }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {strategy.description || 'No description available'}
                </Typography>
                {/* <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Chip 
                    label={`ID: ${strategy.id}`} 
                    size="small" 
                    variant="outlined"
                  />
                  {strategy.active && (
                    <Chip 
                      label="Active" 
                      size="small" 
                      color="success"
                    />
                  )}
                </Box> */}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default CallCampaigns;