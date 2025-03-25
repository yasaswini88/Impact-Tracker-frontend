import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import GoogleIcon from '@mui/icons-material/Google';


const GoogleReviewInsights = ({ businessId }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://52.3.145.159:8080/api/v1/review-insights/${businessId}`);

            setInsights(res.data);
        } catch (err) {
            console.error("Error fetching Google review insights:", err);
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
                <CircularProgress />
            </Box>
        );
    }

    if (!insights) {
        return <Typography sx={{ textAlign: 'center', py: 4 }}>No insights found.</Typography>;
    }

    return (
        <Card sx={{ mt: 4, borderRadius: 2, border: '1px solid rgba(255, 77, 109, 0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
                {/* <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff4d6d', mb: 2 }}>
                    Google Review Insights
                </Typography> */}
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff4d6d', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
    <GoogleIcon sx={{ color: '#228B22' }} />
    Google Review Insights
</Typography>

                <Typography sx={{ mb: 1 }}><strong>Positive Points:</strong> {insights.insights.positive}</Typography>
                <Typography sx={{ mb: 1 }}><strong>Negative Points:</strong> {insights.insights.negative}</Typography>
                <Typography><strong>Overall Summary:</strong> {insights.insights.overall_summary}</Typography>

            </CardContent>
        </Card>
    );
};

export default GoogleReviewInsights;
