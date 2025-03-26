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
} from '@mui/material';
import ReactApexChart from 'react-apexcharts';

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
            type: 'line',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
        },
        stroke: {
            curve: 'smooth',
            width: 3,
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
                }
            }
        },
        title: { 
            text: `Global Seasonal Trends (${selectedType})`,
            style: {
                color: COLOR.text,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            theme: 'light',
            style: {
                fontSize: '12px',
                fontFamily: 'inherit'
            }
        },
        markers: {
            size: 5,
            colors: [COLOR.primary],
            strokeColors: COLOR.accent,
            strokeWidth: 2,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.2,
                gradientToColors: [COLOR.primary],
                opacityFrom: 0.8,
                opacityTo: 0.2,
                stops: [0, 100]
            }
        },
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb:0 , p:0}}>
                {/* <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLOR.text }}>
                    Global Seasonal Trends
                </Typography> */}
                <FormControl  sx={{ mt: 2, mb: 4, alignItems:'center', alignContent:'baseline' }}
                >
                <InputLabel id="business-type-select-label">Select Business Type</InputLabel>
                <Select
                    labelId="business-type-select-label"
                    value={selectedType}
                    label="Select Business Type"
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
            </Box>

          

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                    <CircularProgress sx={{ color: COLOR.secondary }} />
                </Box>
            ) : (
                trends ? (
                    <Box sx={{ mt: 0, mb: 0,p:0 }}>
                        <ReactApexChart 
                            options={options} 
                            series={series} 
                            type="line" 
                            height={300}
                            //width={500}
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