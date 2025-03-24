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
import GlobalSeasonalTrends from './GlobalSeasonalTrends';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';



const COLOR = {
    primary: '#f1ced4',
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

    const [selectedBusinessType, setSelectedBusinessType] = useState('All');
    const businessTypes = ['All', ...new Set(businesses.map(b => b.businessType))];


    const [selectedSentiment, setSelectedSentiment] = useState('All');
    const sentimentOptions = ['All', 'Positive', 'Negative', 'Neutral'];



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

                            const callVolumeTrendRes = await axios.post(
                                `http://52.3.145.159:8080/api/v1/sentiment-analyses/call-volume-trend/${business.businessId}`,
                                {
                                    answered: [42, 109, 100, 31, 40, 28, 14],
                                    months: ["aug", "sep", "oct", "nov", "dec", "jan", "feb"]
                                }
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



    // useEffect(() => {
    //     let filtered = businesses;

    //     if (searchTerm.trim() !== '') {
    //         filtered = filtered.filter(business =>
    //             business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             business.businessType.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //     }

    //     if (selectedBusinessType !== 'All') {
    //         filtered = filtered.filter(business => business.businessType === selectedBusinessType);
    //     }

    //     setFilteredBusinesses(filtered);
    // }, [searchTerm, businesses, selectedBusinessType]);


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
        <Container maxWidth="lg">

            <Divider sx={{ my: 4 }} />


            <GlobalSeasonalTrends />


            <Paper elevation={0} sx={{ mt: 4, p: 4, borderRadius: 2, border: `1px solid ${COLOR.border}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLOR.text }}>
                        Sales Admin Dashboard
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ width: '180px' }} size="small">
                            <InputLabel id="business-type-filter-label">Business Type</InputLabel>
                            <Select
                                labelId="business-type-filter-label"
                                label="Business Type"
                                value={selectedBusinessType}
                                onChange={(e) => setSelectedBusinessType(e.target.value)}
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
                                }}
                            >
                                {businessTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '180px' }} size="small">
                            <InputLabel id="overall-sentiment-filter-label">Overall Sentiment</InputLabel>
                            <Select
                                labelId="overall-sentiment-filter-label"
                                label="Overall Sentiment"
                                value={selectedSentiment}
                                onChange={(e) => setSelectedSentiment(e.target.value)}
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
                                }}
                            >
                                {sentimentOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
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
                                width: '300px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    '& fieldset': {
                                        borderColor: COLOR.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: COLOR.accent,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: COLOR.accent,
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: COLOR.text }} />
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
                    <Grid container spacing={4}>
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
                                        <Typography variant="subtitle2" sx={{ color: COLOR.text, fontWeight: 'bold' }}>
                                            {business.businessType.toUpperCase()}
                                        </Typography>
                                    </Box>


                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="body2"><strong>Email:</strong> {business.email}</Typography>
                                        <Typography variant="body2"><strong>Type:</strong> {business.businessType}</Typography>
                                        <Typography variant="body2"><strong>Phone:</strong> {business.phoneNumber}</Typography>

                                        {business.weeklySentimentSummary && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                <strong>Weekly Sentiment:</strong> {business.weeklySentimentSummary}
                                            </Typography>
                                        )}

                                        {business.overallSentiment && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                <strong>Overall Sentiment:</strong>
                                                <Box component="span" sx={{
                                                    color: business.overallSentiment === "Positive" ? 'green' :
                                                        business.overallSentiment === "Negative" ? 'red' : 'orange',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {business.overallSentiment}
                                                </Box>
                                            </Typography>
                                        )}

                                        {business.callVolumeSummary && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                <strong>Call Volume:</strong> {business.callVolumeSummary}
                                            </Typography>
                                        )}

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={<DashboardIcon />}
                                            sx={{ mt: 3, backgroundColor: COLOR.primary, color: COLOR.text, '&:hover': { backgroundColor: COLOR.accent } }}
                                        >
                                            Open Dashboard
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}





                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xl">
                    <DialogTitle>Business Dashboard</DialogTitle>
                    <DialogContent>
                        {selectedBusiness && (
                            <>
                                <Dashboard
                                    showAiInsights={false}
                                    showCallHistory={false}
                                    showAppointmentsCalendar={false}
                                    showGoogleReviewInsights={true}
                                    showFacebookReviewInsights={true}
                                    business={selectedBusiness}

                                />


                                <SeasonalTrends businessId={selectedBusiness.businessId} />


                            </>
                        )}
                    </DialogContent>
                </Dialog>



            </Paper>
        </Container>
    );
};

export default SalesAdminDashboard;
