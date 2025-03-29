import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    useTheme,
    Paper,
    Divider,
    Container,
    TextField,
    InputAdornment,
    Dialog,
    DialogContent,
    DialogTitle
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Dashboard from './Dashboard'; // Make sure Dashboard component is imported
import SeasonalTrends from './SeasonalTrends';
import FacebookReviewInsights from "./FacebookReviewInsights";
import GoogleReviewInsights from "./GoogleReviewInsights";
import GlobalSeasonalTrends from './GlobalSeasonalTrends';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

import SuggestedFeatures from './SuggestedFeatures';
import AvailableFeatures from './AvailableFeatures';
import { IconButton } from '@mui/material';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import LaunchIcon from '@mui/icons-material/Launch';
import EmailIcon from '@mui/icons-material/Email';
import { Email } from '@mui/icons-material';
import ReactApexChart from 'react-apexcharts';
import ComparingCallVolume from './ComparingCallVolume';


import PhoneIcon from '@mui/icons-material/Phone';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CallIcon from '@mui/icons-material/Call';
import AnalyticsIcon from '@mui/icons-material/Analytics';
const COLOR = {
    // primary: '#f1ced4',
    primary: "#FFCC80",
    secondary: '#e6c0c7',
    accent: '#d3a9b0',
    light: '#f8eaed',
    border: 'rgba(241, 206, 212, 0.5)',
    text: '#806368'
};

const SalesAdminDashboard = () => {
    const [businesses, setBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [groupedAndCounted, setGroupedAndCounted] = useState(null);

    const [selectedBusinessType, setSelectedBusinessType] = useState('All');
    const businessTypes = ['All', ...new Set(businesses.map(b => b.businessType))];


    const [selectedSentiment, setSelectedSentiment] = useState('All');
    const sentimentOptions = ['All', 'Positive', 'Negative', 'Neutral'];


    function SentimentGraphData() {
        const groupedAndCounted = filteredBusinesses.reduce((accumulator, current) => {
            const key = current.overallSentiment;
            if (!accumulator[key]) {
                accumulator[key] = 0;
            }
            accumulator[key]++;

            return accumulator;
        }, {});
        setGroupedAndCounted({ ...groupedAndCounted });

        console.log(groupedAndCounted);
    }


    // const [sentimentData, setSentimentData] = useState({
    //     series: [groupedAndCounted.Positive, groupedAndCounted.Negative, groupedAndCounted.Neutral],
    //     options: {
    //         chart: { height: 300, type: "donut" },
    //         labels: ["Positive", "Negative", "Neutral"],
    //         dataLabels: { enabled: false },
    //         legend: { show: false },
    //         colors: ["#4CAF50", "#F44336", "#FFC107"],
    //     },
    // });

    const [callVolume, setCallVolume] = useState({
        series: [
            {
                name: "Answered",
                data: [42, 109, 100, 40, 31, 28, 14],
            },
            {
                name: "Missed",
                data: [11, 34, 52, 45, 30, 32, 20],
            },
            {
                name: "Voicemail",
                data: [11, 32, 52, 41, 28, 32, 20],
            },
        ],
        options: {
            chart: { height: 300, type: "area" },
            dataLabels: { enabled: false },
            stroke: { curve: "smooth" },
            xaxis: {
                categories: ["sep", "oct", "nov", "dec", "jan", "feb", "mar"],
                title: { text: "Last 6 Months" },
            },
            yaxis: {
                title: { text: "Call Volume" },
            },
            tooltip: {
                x: { format: "MMM" },
            },
        },
    });

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const res = await axios.get('http://52.3.145.159:8080/api/v1/businesses');
                const businessesWithInsights = await Promise.all(
                    res.data.map(async (business) => {
                        try {
                            const sentimentRes = await axios.get(
                                `http://52.3.145.159:8080/api/v1/sentiment-analyses/weekly-trend/${business.businessId}`
                            );

                            const callVolumeTrendRes = await axios.get(
                                `http://52.3.145.159:8080/api/v1/sentiment-analyses/call-volume-trend/${business.businessId}`
                            );

                            return {
                                ...business,
                                weeklySentimentSummary: sentimentRes.data.trend_summary,
                                overallSentiment: sentimentRes.data.overall_sentiment, // <-- Add this line
                                callVolumeSummary: callVolumeTrendRes.data.call_volume_summary
                            };
                        } catch (err) {
                            console.error(`Error fetching insights for businessId ${business.businessId}`, err);
                            return business;
                        }
                    })
                );


                setBusinesses(businessesWithInsights);
                setFilteredBusinesses(businessesWithInsights);
            } catch (err) {
                console.error("Error fetching businesses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, []);

    useEffect(() => {
        if (filteredBusinesses.length > 0) {
            SentimentGraphData();
        }
    }, [filteredBusinesses]);





    useEffect(() => {
        let filtered = businesses;

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(business =>
                business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                business.businessType.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedBusinessType !== 'All') {
            filtered = filtered.filter(business => business.businessType === selectedBusinessType);
        }

        if (selectedSentiment !== 'All') {
            filtered = filtered.filter(business => business.overallSentiment === selectedSentiment);
        }

        setFilteredBusinesses(filtered);
    }, [searchTerm, businesses, selectedBusinessType, selectedSentiment]); // <- Added selectedSentiment here


    const handleCardClick = (business) => {
        localStorage.setItem("businessUser", JSON.stringify(business));
        setSelectedBusiness(business);
        setTimeout(() => setOpenDialog(true), 100);
        setOpenDialog(true);
    };

    return (
        <Container maxWidth={false} disableGutters sx={{ p: 1 }}>

            {/* <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLOR.text }}>
                Sales Admin Dashboard
            </Typography> */}

            {/* <Divider sx={{ my: 4 }} /> */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={8} >


                    <GlobalSeasonalTrends />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 2,
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${COLOR.border}`,
                            height: 400,
                            backgroundColor: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLOR.text, mb: 2, textAlign: 'center' }}>
                            Overall Sentiment Distribution
                        </Typography>

                        {/* Chart section */}
                        {filteredBusinesses && filteredBusinesses.length > 0 && groupedAndCounted && Object.keys(groupedAndCounted).length > 0 ? (
                            <ReactApexChart
                                options={{
                                    labels: Object.keys(groupedAndCounted),
                                    chart: { toolbar: { show: false } },
                                    legend: { position: "bottom" },
                                    dataLabels: { style: { fontSize: '12px' } },
                                    colors: ['#F44336', '#4CAF50', '#FFC107'] // Positive (green), Negative (red), Neutral (yellow)
                                }}
                                series={Object.values(groupedAndCounted)}
                                type="pie"
                                height={300}
                            />

                        ) : (
                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: "center",
                                    mt: 3,
                                    color: "gray"
                                }}
                            >
                                No sentiment data available.
                            </Typography>
                        )}

                        {/* Explanatory note at the bottom */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'gray',
                                fontStyle: 'italic',
                                mt: 2,
                                textAlign: 'center'
                            }}
                        >
                            The chart represents AI-generated overall sentiment from call volume
                            sentiment analysis for businesses, categorized as positive, negative, or neutral.
                        </Typography>
                    </Paper>
                </Grid>


            </Grid>



            <Paper elevation={0} sx={{ mt: 4, p: 4, borderRadius: 2, border: `1px solid ${COLOR.border}` }}>



                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', md: 'center' },
                        mb: 4,
                        gap: 2,
                        backgroundColor: COLOR.light,
                        borderRadius: 2,
                        p: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        border: `1px solid ${COLOR.border}`
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: COLOR.text,
                            fontWeight: 'bold',
                            display: { xs: 'block', md: 'none' },
                            mb: 1
                        }}
                    >
                        Filter Businesses
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                            width: '100%',
                            flexWrap: 'wrap'
                        }}
                    >
                        <FormControl
                            sx={{
                                width: { xs: '100%', sm: '180px' },
                                flexGrow: { xs: 1, sm: 0 }
                            }}
                            size="small"
                            variant="outlined"
                        >
                            <InputLabel
                                id="business-type-filter-label"
                                sx={{
                                    color: COLOR.text,
                                    fontWeight: 'medium'
                                }}
                            >
                                Business Type
                            </InputLabel>
                            <Select
                                labelId="business-type-filter-label"
                                label="Business Type"
                                value={selectedBusinessType}
                                onChange={(e) => setSelectedBusinessType(e.target.value)}
                                sx={{
                                    borderRadius: 2,
                                    color: COLOR.text,
                                    fontWeight: 'medium',
                                    backgroundColor: '#fff',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: COLOR.border,
                                        borderWidth: '1px',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: COLOR.accent,
                                        borderWidth: '2px',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: COLOR.primary,
                                        borderWidth: '2px',
                                    },
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        py: 1.25,
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            borderRadius: 2,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                            mt: 0.5,
                                        },
                                    },
                                }}
                                IconComponent={(props) => (
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginRight: 1,
                                            color: COLOR.accent,
                                        }}
                                        {...props}
                                    >
                                        ▼
                                    </Box>
                                )}
                            >
                                {businessTypes.map((type) => (
                                    <MenuItem
                                        key={type}
                                        value={type}
                                        sx={{
                                            '&.Mui-selected': {
                                                backgroundColor: `${COLOR.light} !important`,
                                                fontWeight: 'bold',
                                            },
                                            '&:hover': {
                                                backgroundColor: `${COLOR.border} !important`,
                                            },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {type === 'All' ? (
                                                <BusinessIcon sx={{ mr: 1, fontSize: 18, color: COLOR.text }} />
                                            ) : (
                                                <BusinessIcon sx={{ mr: 1, fontSize: 18, color: COLOR.accent }} />
                                            )}
                                            {type}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            sx={{
                                width: { xs: '100%', sm: '180px' },
                                flexGrow: { xs: 1, sm: 0 }
                            }}
                            size="small"
                        >
                            <InputLabel
                                id="overall-sentiment-filter-label"
                                sx={{
                                    color: COLOR.text,
                                    fontWeight: 'medium'
                                }}
                            >
                                Overall Sentiment
                            </InputLabel>
                            <Select
                                labelId="overall-sentiment-filter-label"
                                label="Overall Sentiment"
                                value={selectedSentiment}
                                onChange={(e) => setSelectedSentiment(e.target.value)}
                                sx={{
                                    borderRadius: 2,
                                    color: COLOR.text,
                                    fontWeight: 'medium',
                                    backgroundColor: '#fff',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: COLOR.border,
                                        borderWidth: '1px',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: COLOR.accent,
                                        borderWidth: '2px',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: COLOR.primary,
                                        borderWidth: '2px',
                                    },
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        py: 1.25,
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            borderRadius: 2,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                            mt: 0.5,
                                        },
                                    },
                                }}
                                IconComponent={(props) => (
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginRight: 1,
                                            color: COLOR.accent,
                                        }}
                                        {...props}
                                    >
                                        ▼
                                    </Box>
                                )}
                            >
                                {sentimentOptions.map((option) => (
                                    <MenuItem
                                        key={option}
                                        value={option}
                                        sx={{
                                            '&.Mui-selected': {
                                                backgroundColor: `${COLOR.light} !important`,
                                                fontWeight: 'bold',
                                            },
                                            '&:hover': {
                                                backgroundColor: `${COLOR.border} !important`,
                                            },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {option === 'All' && (
                                                <Box sx={{ mr: 1, display: 'flex' }}></Box>
                                            )}
                                            {option === 'Positive' && (
                                                <SentimentSatisfiedAltIcon sx={{ mr: 1, fontSize: 18, color: 'green' }} />
                                            )}
                                            {option === 'Negative' && (
                                                <SentimentVeryDissatisfiedIcon sx={{ mr: 1, fontSize: 18, color: 'red' }} />
                                            )}
                                            {option === 'Neutral' && (
                                                <SentimentNeutralIcon sx={{ mr: 1, fontSize: 18, color: 'orange' }} />
                                            )}
                                            {option}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            placeholder="Search businesses..."
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                width: { xs: '100%', sm: '300px' },
                                flexGrow: { xs: 1, sm: 0 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#fff',
                                    transition: 'all 0.3s ease',
                                    '& fieldset': {
                                        borderColor: COLOR.border,
                                        borderWidth: '1px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: COLOR.accent,
                                        borderWidth: '2px',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: COLOR.primary,
                                        borderWidth: '2px',
                                    },
                                    '& input': {
                                        padding: '9px 14px',
                                        '&::placeholder': {
                                            color: `${COLOR.text}99`,
                                            opacity: 1,
                                        },
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon
                                            sx={{
                                                color: COLOR.text,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    color: COLOR.accent,
                                                },
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="clear search"
                                            onClick={() => setSearchTerm('')}
                                            edge="end"
                                            size="small"
                                            sx={{
                                                color: COLOR.text,
                                                '&:hover': {
                                                    color: COLOR.accent,
                                                    backgroundColor: `${COLOR.border}33`,
                                                },
                                            }}
                                        >
                                            <Box sx={{ fontSize: '18px' }}>✕</Box>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>



                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                        <CircularProgress sx={{ color: COLOR.secondary }} />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {filteredBusinesses.map((business) => (
                            <Grid item xs={12} key={business.businessId}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        borderRadius: 2,
                                        border: `1px solid ${COLOR.border}`,
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                        },
                                    }}
                                    onClick={() => handleCardClick(business)}
                                >
                                    <Box sx={{ p: 2, backgroundColor: COLOR.primary, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <BusinessIcon sx={{ color: COLOR.text }} />
                                            <Typography variant="h6" sx={{ color: COLOR.text, fontWeight: 'bold' }}>
                                                {business.businessName}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems={'center'} alignContent={'baseline'} gap={2}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: COLOR.text,
                                                    fontWeight: 'bold',
                                                    backgroundColor: COLOR.light,
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: '12px',
                                                    display: 'inline-block',
                                                    border: `1px solid ${COLOR.border}`,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',

                                                }}
                                            >
                                                {business.businessType.toUpperCase()}
                                            </Typography>
                                            <LaunchIcon />
                                        </Box>

                                    </Box>


                                    <CardContent sx={{ p: 3, textAlign: 'left', position: 'relative' }}>
                                        {business.overallSentiment === "Negative" && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    bgcolor: '#feeced',
                                                    color: '#d32f2f',
                                                    borderRadius: '16px',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    border: '1px solid #ef5350'
                                                }}
                                            >
                                                <Box component="span" sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            width: 15,
                                                            height: 15,
                                                            borderRadius: '50%',
                                                            bgcolor: '#d32f2f',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '10px',
                                                            fontWeight: 'bold',
                                                            mr: 0.5
                                                        }}
                                                    >
                                                        !
                                                    </Box>
                                                </Box>
                                                NEEDS ATTENTION
                                            </Box>
                                        )}

                                        <Box sx={{ mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <EmailIcon sx={{ color: COLOR.text, fontSize: 18, mr: 1 }} />
                                                <Typography variant="body2"><strong>Email:</strong> {business.email}</Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <PhoneIcon sx={{ color: COLOR.text, fontSize: 18, mr: 1 }} />
                                                <Typography variant="body2"><strong>Phone:</strong> {business.phoneNumber}</Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <AccountBoxIcon sx={{ color: COLOR.text, fontSize: 18, mr: 1 }} />
                                                <Typography variant="body2"><strong>Account Number:</strong> {business.registrationNumber}</Typography>
                                            </Box>

                                            {business.weeklySentimentSummary && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <TrendingUpIcon sx={{ color: COLOR.text, fontSize: 18, mr: 1 }} />
                                                    <Typography variant="body2">
                                                        <strong>Weekly Sentiment:</strong> {business.weeklySentimentSummary}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {business.callVolumeSummary && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <CallIcon sx={{ color: COLOR.text, fontSize: 18, mr: 1 }} />
                                                    <Typography variant="body2">
                                                        <strong>Call Volume:</strong> {business.callVolumeSummary}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <AnalyticsIcon sx={{ color: COLOR.text, fontSize: 18, mr: 1 }} />
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <strong>Overall Sentiment:</strong>
                                                    {business.overallSentiment === "Positive" && (
                                                        <>
                                                            <SentimentSatisfiedAltIcon sx={{ color: 'green' }} />
                                                            <span style={{ fontWeight: 'bold', color: 'green' }}>Positive</span>
                                                        </>
                                                    )}
                                                    {business.overallSentiment === "Negative" && (
                                                        <>
                                                            <SentimentVeryDissatisfiedIcon sx={{ color: 'red' }} />
                                                            <span style={{ fontWeight: 'bold', color: 'red' }}>Negative</span>
                                                        </>
                                                    )}
                                                    {business.overallSentiment === "Neutral" && (
                                                        <>
                                                            <SentimentNeutralIcon sx={{ color: 'orange' }} />
                                                            <span style={{ fontWeight: 'bold', color: 'orange' }}>Neutral</span>
                                                        </>
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>

                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}





                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xl">
                    {/* <DialogTitle>Business Dashboard</DialogTitle> */}
                    <DialogContent>
                        {selectedBusiness && (
                            <>

                                <SuggestedFeatures businessId={selectedBusiness.businessId} />


                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} minHeight="500px">
                                        <GoogleReviewInsights businessId={selectedBusiness.businessId} />
                                    </Grid>
                                    <Grid item xs={12} md={6} minHeight="500px">
                                        <FacebookReviewInsights businessId={selectedBusiness.businessId} />
                                    </Grid>
                                </Grid>





                                <Box sx={{ my: 8 }}> {/* Adds vertical margin for spacing */}
                                    <SeasonalTrends businessId={selectedBusiness.businessId} />
                                </Box>


                                <Grid item xs={12} md={6}>
                                    {selectedBusiness && (
                                        <ComparingCallVolume businessId={selectedBusiness.businessId} />
                                    )}
                                </Grid>


                                <Dashboard
                                    showAiInsights={false}
                                    showCallHistory={false}
                                    showAppointmentsCalendar={false}
                                    // showGoogleReviewInsights={true}
                                    // showFacebookReviewInsights={true}
                                    showBusinessInfo={true}
                                    business={selectedBusiness}

                                />
                            </>
                        )}
                    </DialogContent>
                </Dialog>



            </Paper>
        </Container>
    );
};

export default SalesAdminDashboard;


