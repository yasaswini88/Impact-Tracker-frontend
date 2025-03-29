import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress, 
  Paper,
  Chip
} from '@mui/material';
import axios from 'axios';
import FacebookIcon from '@mui/icons-material/Facebook';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

// Color constants to match your theme
const COLOR = {
  primary: "#FFCC80",
  secondary: '#e6c0c7',
  accent: '#d3a9b0',
  light: '#f8eaed',
  border: 'rgba(241, 206, 212, 0.5)',
  text: '#806368',
  facebook: {
    primary: '#1877F2',
    light: '#e9f0fe',
    border: 'rgba(24, 119, 242, 0.3)'
  }
};

const FacebookReviewInsights = ({ businessId }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            // Use the Facebook insights endpoint
            const res = await axios.get(`http://52.3.145.159:8080/api/v1/facebook-insights/${businessId}`);
            setInsights(res.data);
        } catch (err) {
            console.error("Error fetching Facebook review insights:", err);
            setInsights(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (businessId) {
            fetchInsights();
        }
    }, [businessId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: COLOR.facebook.primary }} />
            </Box>
        );
    }

    if (!insights) {
        return (
            <Card sx={{ mt: 4, borderRadius: 2, border: `1px solid ${COLOR.facebook.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
                <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ textAlign: 'center', py: 4, color: COLOR.text }}>
                        No Facebook review insights available for this business.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    // Extract key phrases from positive and negative points
    const extractKeyPhrases = (text) => {
        // For a real app, you'd use NLP to extract true key phrases
        // This is a simple implementation for demo purposes
        const sentences = text.split('.');
        return sentences
            .filter(s => s.trim().length > 10 && s.trim().length < 100)
            .map(s => s.trim())
            .slice(0, 3);
    };

    const positiveKeyPhrases = extractKeyPhrases(insights.positivePoints);
    const negativeKeyPhrases = extractKeyPhrases(insights.negativePoints);

    return (
        <Card sx={{ 
            mt: 4, 
            borderRadius: 2, 
            border: `1px solid ${COLOR.facebook.border}`, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    mb: 3,
                    pb: 2,
                    borderBottom: `1px solid ${COLOR.facebook.border}`
                }}>
                    <FacebookIcon sx={{ color: COLOR.facebook.primary, fontSize: 30 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLOR.facebook.primary }}>
                        Facebook Review Insights
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Positive Highlights */}
                    <Paper elevation={0} sx={{ 
                        p: 2, 
                        backgroundColor: 'rgba(76, 175, 80, 0.08)', 
                        borderRadius: 2,
                        border: '1px solid rgba(76, 175, 80, 0.3)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <ThumbUpIcon sx={{ color: 'success.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                                Positive Highlights
                            </Typography>
                        </Box>
                        
                        <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {insights.positivePoints}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {positiveKeyPhrases.map((phrase, index) => (
                                <Chip 
                                    key={index}
                                    icon={<SentimentSatisfiedAltIcon />} 
                                    label={phrase}
                                    size="small"
                                    sx={{ 
                                        backgroundColor: 'rgba(76, 175, 80, 0.15)', 
                                        borderColor: 'rgba(76, 175, 80, 0.3)',
                                        '& .MuiChip-icon': { color: 'success.main' }
                                    }} 
                                />
                            ))}
                        </Box>
                    </Paper>
                    
                    {/* Areas for Improvement */}
                    <Paper elevation={0} sx={{ 
                        p: 2, 
                        backgroundColor: 'rgba(244, 67, 54, 0.08)', 
                        borderRadius: 2,
                        border: '1px solid rgba(244, 67, 54, 0.3)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <ThumbDownIcon sx={{ color: 'error.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.dark' }}>
                                Areas for Improvement
                            </Typography>
                        </Box>
                        
                        <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                            {insights.negativePoints}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {negativeKeyPhrases.map((phrase, index) => (
                                <Chip 
                                    key={index}
                                    icon={<SentimentVeryDissatisfiedIcon />} 
                                    label={phrase}
                                    size="small"
                                    sx={{ 
                                        backgroundColor: 'rgba(244, 67, 54, 0.15)', 
                                        borderColor: 'rgba(244, 67, 54, 0.3)',
                                        '& .MuiChip-icon': { color: 'error.main' }
                                    }} 
                                />
                            ))}
                        </Box>
                    </Paper>
                    
                    {/* Summary */}
                    <Paper elevation={0} sx={{ 
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${COLOR.facebook.border}`,
                        backgroundColor: COLOR.facebook.light
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLOR.facebook.primary, mb: 1.5 }}>
                            Summary
                        </Typography>
                        <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                            "{insights.insights}"
                        </Typography>
                    </Paper>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FacebookReviewInsights;