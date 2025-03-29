// Plans.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  Divider,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Avatar
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://52.3.145.159:8080/api/v1/plans')
      .then(res => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load plans. Please try again later.');
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

  // Function to get a color based on plan name (for avatar background)
  const getAvatarColor = (planName) => {
    const colors = ['#3f51b5', '#f50057', '#00897b', '#ff9800', '#8e24aa'];
    let sum = 0;
    for (let i = 0; i < planName.length; i++) {
      sum += planName.charCodeAt(i);
    }
    return colors[sum % colors.length];
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
    <>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <LocalOfferIcon sx={{ mr: 1, color: '#3f51b5' }} />
        <Typography variant="h5" component="h1">
          Available Plans
        </Typography>
      </Box>
      
      {plans.length === 0 ? (
        <Alert severity="info">No plans available at the moment</Alert>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.planId}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: getAvatarColor(plan.planName) }}>
                      {plan.planName.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={plan.planName}
                  subheader={`Plan ID: ${plan.planId}`}
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Created: {formatDate(plan.createdTime)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {/* Add tags/features of the plan if available */}
                    {plan.type && (
                      <Chip 
                        label={plan.type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    )}
                    {plan.status && (
                      <Chip 
                        label={plan.status} 
                        size="small"
                        color={plan.status === 'Active' ? 'success' : 'default'} 
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Plans;