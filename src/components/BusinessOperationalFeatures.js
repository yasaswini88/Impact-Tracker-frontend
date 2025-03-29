import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  ButtonGroup,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Collapse,
  IconButton,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const COLOR = {
  primary: "#FFCC80",
  secondary: '#e6c0c7',
  accent: '#d3a9b0',
  light: '#f8eaed',
  border: 'rgba(241, 206, 212, 0.5)',
  text: '#806368'
};

const BusinessOperationalFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [operationalFeatures, setOperationalFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('bar');
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both features and operational features in parallel
        const [featuresResponse, operationalFeaturesResponse] = await Promise.all([
          axios.get('http://52.3.145.159:8080/api/v1/features'),
          axios.get('http://52.3.145.159:8080/api/v1/business-operational-features')
        ]);
        
        const fetchedFeatures = featuresResponse.data;
        const fetchedOperationalFeatures = operationalFeaturesResponse.data;
        
        setFeatures(fetchedFeatures);
        setOperationalFeatures(fetchedOperationalFeatures);
        
        // Initialize only features that have at least one business adoption as selected
        const initialSelectedState = {};
        
        // First, set all features as unselected
        fetchedFeatures.forEach(feature => {
          initialSelectedState[feature.featureId] = false;
        });
        
        // Then, set features with at least one business adoption as selected
        fetchedOperationalFeatures.forEach(opFeature => {
          initialSelectedState[opFeature.featureId] = true;
        });
        
        setSelectedFeatures(initialSelectedState);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  const selectAllFeatures = (value) => {
    const newState = {};
    features.forEach(feature => {
      newState[feature.featureId] = value;
    });
    setSelectedFeatures(newState);
  };

  // Process the data for chart
  const prepareChartData = () => {
    if (!features.length || !operationalFeatures.length) {
      return {
        featureNames: [],
        featureCounts: [],
        featureIds: []
      };
    }

    // Count how many businesses are using each feature
    const featureCounts = features
      .filter(feature => selectedFeatures[feature.featureId])
      .map(feature => {
        const count = operationalFeatures.filter(
          opFeature => opFeature.featureId === feature.featureId
        ).length;
        
        return {
          featureId: feature.featureId,
          featureName: feature.featureName,
          count: count
        };
      });

    // Sort by count in descending order
    featureCounts.sort((a, b) => b.count - a.count);
    
    return {
      featureNames: featureCounts.map(item => item.featureName),
      featureCounts: featureCounts.map(item => item.count),
      featureIds: featureCounts.map(item => item.featureId)
    };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    chart: {
      type: viewMode,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      foreColor: COLOR.text
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: isMobile, // Horizontal bars on mobile for better readability
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      },
      pie: {
        donut: {
          size: '50%'
        },
        expandOnClick: true,
        dataLabels: {
          offset: -10, // Move labels closer to the center
          minAngleToShowLabel: 10 // Only show labels for segments larger than 10 degrees
        }
      }
    },
    colors: [
      '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63', '#F44336'
    ],
    dataLabels: {
      enabled: true,
      formatter: function(val, { seriesIndex, dataPointIndex, w }) {
        // For pie chart, show percentage instead of raw value
        if (w.config.chart.type === 'pie') {
          // Calculate percentage based on total 
          const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
          const percent = (val / total * 100).toFixed(0);
          return percent + '%';
        }
        // For bar chart, show the raw value
        return val;
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#333']
      }
    },
    xaxis: {
      categories: chartData.featureNames,
      labels: {
        style: {
          fontSize: '12px',
          colors: Array(chartData.featureNames.length).fill(COLOR.text)
        },
        rotate: isMobile ? 0 : -45,
        trim: !isMobile,
        maxHeight: 150
      },
      title: {
        text: 'Features',
        style: {
          fontWeight: 500
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Businesses',
        style: {
          fontWeight: 500
        }
      },
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: function(val) {
          return Math.round(val);
        }
      }
    },
    grid: {
      borderColor: COLOR.border,
      row: {
        colors: ['transparent', 'transparent']
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function(value) {
          return value + ' business' + (value !== 1 ? 'es' : '');
        }
      }
    },
    title: {
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: COLOR.text
      }
    },
    legend: {
      show: viewMode === 'pie',
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8
      }
    },
    labels: chartData.featureNames, // This fixes the pie chart labels
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetY: 0
        }
      }
    }]
  };

  const series = viewMode === 'pie' 
    ? chartData.featureCounts 
    : [{ name: 'Businesses', data: chartData.featureCounts }];

  if (loading) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 2,
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400
        }}
      >
        <CircularProgress sx={{ color: COLOR.accent }} />
      </Paper>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Calculate some statistics for the info cards
  const totalBusinessesWithFeatures = [...new Set(operationalFeatures.map(of => of.businessId))].length;
  const totalFeatureAdoptions = operationalFeatures.length;
  const mostPopularFeatureObj = features.length > 0 && chartData.featureNames.length > 0 
    ? features.find(f => f.featureName === chartData.featureNames[0]) 
    : null;
  const mostPopularFeature = mostPopularFeatureObj ? mostPopularFeatureObj.featureName : 'None';

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
          bgcolor: COLOR.primary, 
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BarChartIcon sx={{ color: COLOR.text, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLOR.text }}>
            Feature Adoption by Businesses
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Toggle feature filters">
            <IconButton 
              onClick={() => setShowFilters(!showFilters)}
              sx={{ 
                color: COLOR.text,
                bgcolor: showFilters ? COLOR.light : 'transparent',
                '&:hover': { bgcolor: COLOR.light }
              }}
            >
              <FilterListIcon />
              {showFilters ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <ButtonGroup variant="outlined" size="small">
            <Button
              onClick={() => setViewMode('bar')}
              variant={viewMode === 'bar' ? 'contained' : 'outlined'}
              sx={{
                bgcolor: viewMode === 'bar' ? COLOR.light : 'transparent',
                borderColor: COLOR.border,
                color: COLOR.text,
                '&:hover': {
                  bgcolor: viewMode === 'bar' ? COLOR.light : `${COLOR.light}80`,
                  borderColor: COLOR.border
                }
              }}
            >
              BAR
            </Button>
            <Button
              onClick={() => setViewMode('pie')}
              variant={viewMode === 'pie' ? 'contained' : 'outlined'}
              sx={{
                bgcolor: viewMode === 'pie' ? COLOR.light : 'transparent',
                borderColor: COLOR.border,
                color: COLOR.text,
                '&:hover': {
                  bgcolor: viewMode === 'pie' ? COLOR.light : `${COLOR.light}80`,
                  borderColor: COLOR.border
                }
              }}
            >
              PIE
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      
      <Collapse in={showFilters}>
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: COLOR.light,
            borderBottom: `1px solid ${COLOR.border}`
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: COLOR.text }}>
            Filter Features
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Button 
              size="small" 
              variant="outlined"
              onClick={() => selectAllFeatures(true)}
              sx={{ 
                borderColor: COLOR.border,
                color: COLOR.text,
                '&:hover': { 
                  bgcolor: COLOR.light,
                  borderColor: COLOR.accent
                } 
              }}
            >
              SELECT ALL
            </Button>
            <Button 
              size="small" 
              variant="outlined"
              onClick={() => selectAllFeatures(false)}
              sx={{ 
                borderColor: COLOR.border,
                color: COLOR.text,
                '&:hover': { 
                  bgcolor: COLOR.light,
                  borderColor: COLOR.accent
                } 
              }}
            >
              DESELECT ALL
            </Button>
            <Button 
              size="small" 
              variant="outlined"
              onClick={() => {
                // Select only features with at least one business adoption
                const newState = {};
                features.forEach(feature => {
                  const count = operationalFeatures.filter(
                    opFeature => opFeature.featureId === feature.featureId
                  ).length;
                  newState[feature.featureId] = count > 0;
                });
                setSelectedFeatures(newState);
              }}
              sx={{ 
                borderColor: COLOR.border,
                color: COLOR.text,
                '&:hover': { 
                  bgcolor: COLOR.light,
                  borderColor: COLOR.accent
                } 
              }}
            >
              ONLY ADOPTED
            </Button>
          </Box>
          
          <FormGroup row>
            {features.map(feature => {
              // Find how many businesses are using this feature
              const count = operationalFeatures.filter(
                opFeature => opFeature.featureId === feature.featureId
              ).length;
              
              // Determine background color based on adoption
              const badgeBgColor = count > 0 ? COLOR.primary : '#f0f0f0';
              
              return (
                <FormControlLabel
                  key={feature.featureId}
                  control={
                    <Checkbox 
                      checked={!!selectedFeatures[feature.featureId]} 
                      onChange={() => handleFeatureToggle(feature.featureId)}
                      sx={{
                        color: COLOR.accent,
                        '&.Mui-checked': {
                          color: COLOR.accent,
                        },
                      }}
                    />
                  }
                  label={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {feature.featureName}
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          ml: 0.5,
                          px: 0.75,
                          py: 0.25,
                          borderRadius: '10px',
                          bgcolor: badgeBgColor,
                          color: COLOR.text,
                          minWidth: '20px',
                          height: '20px'
                        }}
                      >
                        {count}
                      </Box>
                    </Box>
                  }
                  sx={{ 
                    minWidth: { xs: '100%', sm: '48%', md: '32%' },
                    mr: 1,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem',
                      color: COLOR.text,
                      opacity: count > 0 ? 1 : 0.7
                    }
                  }}
                />
              );
            })}
          </FormGroup>
        </Box>
      </Collapse>
      
      <Divider sx={{ borderColor: COLOR.border }} />
      
      {/* Info cards section */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        justifyContent: 'center' 
      }}>
        <Card sx={{ 
          minWidth: 200, 
          flex: '1 1 0', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: `1px solid ${COLOR.border}`,
          borderRadius: 2
        }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }} gutterBottom>
              Total Businesses
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: COLOR.text }}>
              {totalBusinessesWithFeatures}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
              with active features
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          minWidth: 200, 
          flex: '1 1 0', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: `1px solid ${COLOR.border}`,
          borderRadius: 2
        }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }} gutterBottom>
              Total Feature Adoptions
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: COLOR.text }}>
              {totalFeatureAdoptions}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
              across all businesses
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          minWidth: 200, 
          flex: '1 1 0', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: `1px solid ${COLOR.border}`,
          borderRadius: 2
        }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }} gutterBottom>
              Most Popular Feature
            </Typography>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: COLOR.text, height: 50, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {mostPopularFeature}
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 1 }}>
              highest adoption rate
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ px: 3, pb: 3 }}>
        {chartData.featureNames.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No features selected. Please select at least one feature to display the chart.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            height: isMobile ? 350 : 500, 
            width: '100%', 
            pt: 2,
            border: `1px solid ${COLOR.border}`,
            borderRadius: 2,
            p: 2,
            bgcolor: '#fff'
          }}>
            <ReactApexChart
              options={chartOptions}
              series={series}
              type={viewMode}
              height="100%"
              width="100%"
            />
          </Box>
        )}
        
        <Typography
          variant="body2"
          sx={{
            color: 'gray',
            fontStyle: 'italic',
            mt: 2,
            textAlign: 'center'
          }}
        >
          This chart shows the number of businesses that have adopted each available feature.
        </Typography>
      </Box>
    </Paper>
  );
};

export default BusinessOperationalFeatures;