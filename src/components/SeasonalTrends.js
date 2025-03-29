import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  Typography, 
  CircularProgress, 
  Box, 
  CardContent,
  Button,
  ButtonGroup,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Color constants to match your theme
const COLOR = {
  primary: "#FFCC80",
  secondary: '#e6c0c7',
  accent: '#d3a9b0',
  light: '#f8eaed',
  border: 'rgba(241, 206, 212, 0.5)',
  text: '#806368'
};

const SeasonalTrends = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState(null);
  const [viewMode, setViewMode] = useState('line');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://52.3.145.159:8080/api/v1/seasonal-trends/${businessId}`);
        setTrends(data.monthlyTrends);
      } catch (err) {
        console.error("Error fetching seasonal trends:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrends();
  }, [businessId]);

  if (loading) return (
    <Card sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <CircularProgress sx={{ color: COLOR.accent }} />
    </Card>
  );
  
  if (!trends || Object.keys(trends).length === 0) return (
    <Card sx={{ p: 4, textAlign: 'center', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="body1" color="text.secondary">
        No seasonal trend data available for this business.
      </Typography>
    </Card>
  );

  // Prepare chart data
  const months = Object.keys(trends);
  const demandValues = Object.values(trends);

  const options = {
    chart: {
      type: viewMode,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#FF9800'],
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: COLOR.text,
          fontSize: '12px'
        }
      },
      title: {
        text: 'Month',
        style: {
          color: COLOR.text,
          fontWeight: 500
        }
      }
    },
    yaxis: {
      title: {
        text: 'Demand Index',
        style: {
          color: COLOR.text,
          fontWeight: 500
        }
      },
      labels: {
        style: {
          colors: COLOR.text
        },
        formatter: function(value) {
          // Format to remove the long zeros
          return value.toFixed(0);
        }
      }
    },
    stroke: {
      width: viewMode === 'line' ? 4 : 0,
      curve: 'smooth'
    },
    fill: {
      opacity: viewMode === 'line' ? 0.2 : 1,
      type: viewMode === 'line' ? 'gradient' : 'solid',
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.3,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    markers: {
      size: 5,
      hover: {
        size: 7
      }
    },
    grid: {
      borderColor: COLOR.border,
      row: {
        colors: ['transparent', 'transparent']
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function(value) {
          return value.toFixed(1) + ' index'
        }
      }
    }
  };

  const series = [
    { 
      name: 'Demand', 
      data: demandValues 
    }
  ];

  return (
    <Card sx={{ 
      p: 0, 
      borderRadius: 2, 
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: `1px solid ${COLOR.border}`,
      mb: 4
    }}>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center',
          mb: 2,
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ color: COLOR.accent, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLOR.text }}>
              Seasonal Trends
            </Typography>
          </Box>
          
          <ButtonGroup variant="outlined" size="small">
            <Button 
              onClick={() => setViewMode('line')}
              variant={viewMode === 'line' ? 'contained' : 'outlined'}
              sx={{ 
                bgcolor: viewMode === 'line' ? COLOR.primary : 'transparent',
                borderColor: COLOR.border,
                color: viewMode === 'line' ? COLOR.text : COLOR.text,
                '&:hover': {
                  bgcolor: viewMode === 'line' ? COLOR.primary : `${COLOR.light}80`,
                  borderColor: COLOR.border
                }
              }}
            >
              LINE
            </Button>
            <Button 
              onClick={() => setViewMode('area')}
              variant={viewMode === 'area' ? 'contained' : 'outlined'}
              sx={{ 
                bgcolor: viewMode === 'area' ? COLOR.primary : 'transparent',
                borderColor: COLOR.border,
                color: viewMode === 'area' ? COLOR.text : COLOR.text,
                '&:hover': {
                  bgcolor: viewMode === 'area' ? COLOR.primary : `${COLOR.light}80`,
                  borderColor: COLOR.border
                }
              }}
            >
              AREA
            </Button>
            <Button 
              onClick={() => setViewMode('bar')}
              variant={viewMode === 'bar' ? 'contained' : 'outlined'}
              sx={{ 
                bgcolor: viewMode === 'bar' ? COLOR.primary : 'transparent',
                borderColor: COLOR.border,
                color: viewMode === 'bar' ? COLOR.text : COLOR.text,
                '&:hover': {
                  bgcolor: viewMode === 'bar' ? COLOR.primary : `${COLOR.light}80`,
                  borderColor: COLOR.border
                }
              }}
            >
              BAR
            </Button>
          </ButtonGroup>
        </Box>
        
        <Divider sx={{ mb: 2, borderColor: COLOR.border }} />
        
        <Box sx={{ height: isMobile ? 300 : 350, width: '100%' }}>
          <ReactApexChart 
            options={options} 
            series={series} 
            type={viewMode} 
            height="100%" 
            width="100%" 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SeasonalTrends;