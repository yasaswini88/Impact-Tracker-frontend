import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    Typography,
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Paper,
    Container,
    Divider,
    Button,
    ButtonGroup,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const COLOR = {
    primary: '#f1ced4',
    secondary: '#e6c0c7',
    accent: '#d3a9b0',
    light: '#f8eaed',
    border: 'rgba(241, 206, 212, 0.5)',
    text: '#806368'
};

const GlobalSeasonalTrends = () => {
    const [businessTypes, setBusinessTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('line');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchBusinessTypes = async () => {
            try {
                const res = await axios.get('http://52.3.145.159:8080/api/v1/businesses');
                const types = [...new Set(res.data.map(b => b.businessType).filter(Boolean))];
                setBusinessTypes(types);
                if (types.length) setSelectedType(types[0]);
            } catch (err) {
                console.error("Error fetching business types:", err);
            }
        };
        fetchBusinessTypes();
    }, []);

    useEffect(() => {
        const fetchTrends = async () => {
            if (!selectedType) return;
            setLoading(true);
            try {
                const res = await axios.get(`http://52.3.145.159:8080/api/v1/global-seasonal-trends/${selectedType}`);
                setTrends(res.data.monthlyTrends);
            } catch (e) {
                console.error(e);
                setTrends(null);
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, [selectedType]);

    if (!businessTypes.length) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <CircularProgress sx={{ color: COLOR.secondary }} />
        </Box>
    );

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
        stroke: {
            curve: 'smooth',
            width: viewMode === 'line' ? 3 : 0,
            colors: [COLOR.accent],
        },
        grid: {
            borderColor: COLOR.border,
            row: {
                colors: [COLOR.light, 'transparent'],
                opacity: 0.1
            },
        },
        xaxis: { 
            categories: trends ? Object.keys(trends) : [],
            labels: {
                style: {
                    colors: COLOR.text,
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: COLOR.text,
                },
                formatter: function(value) {
                    return value.toFixed(0);
                }
            }
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
            colors: [COLOR.primary],
            strokeColors: COLOR.accent,
            strokeWidth: 2,
            hover: {
                size: 7
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
            data: trends ? Object.values(trends) : [],
        }
    ];

    return (
        <Paper elevation={0} sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 2, 
            border: `1px solid ${COLOR.border}`,
            backgroundColor: 'white'
        }}>
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
                        Global Seasonal Trends
                    </Typography>
                </Box>
                
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center', 
                    gap: 2 
                }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="business-type-select-label">Business Type</InputLabel>
                        <Select
                            labelId="business-type-select-label"
                            value={selectedType}
                            label="Business Type"
                            onChange={(e) => setSelectedType(e.target.value)}
                            sx={{
                                borderRadius: 1.5,
                                color: COLOR.text,
                                fontWeight: 'medium',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLOR.border,
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLOR.accent,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: COLOR.accent,
                                },
                            }}
                        >
                            {businessTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
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
            </Box>

            <Divider sx={{ mb: 2, borderColor: COLOR.border }} />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                    <CircularProgress sx={{ color: COLOR.secondary }} />
                </Box>
            ) : (
                trends ? (
                    <Box sx={{ height: isMobile ? 300 : 350, width: '100%' }}>
                        <ReactApexChart 
                            options={options} 
                            series={series} 
                            type={viewMode} 
                            height="100%" 
                            width="100%" 
                        />
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', my: 6 }}>
                        <Typography variant="h6" sx={{ color: COLOR.text }}>
                            No trends available for this business type.
                        </Typography>
                    </Box>
                )
            )}
        </Paper>
    );
};

export default GlobalSeasonalTrends;