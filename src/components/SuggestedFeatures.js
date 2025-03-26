import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, Chip } from '@mui/material';
import axios from 'axios';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const SuggestedFeatures = ({ businessId }) => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSuggestedFeatures = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://52.3.145.159:8080/api/v1/business-feature-suggestions/${businessId}`);
                setFeatures(res.data);
            } catch (err) {
                console.error('Error fetching suggested features:', err);
                setFeatures([]);
            } finally {
                setLoading(false);
            }
        };

        if (businessId) fetchSuggestedFeatures();
    }, [businessId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card sx={{ mt: 4, borderRadius: 2, border: '1px solid rgba(63, 81, 181, 0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesomeIcon sx={{ color: '#3f51b5' }} />
                    Suggested Features
                </Typography>
                {features.length > 0 ? (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {features.map(feature => (
                            <Chip
                                key={feature.featureId}
                                label={feature.featureName}
                                variant="outlined"
                                color="primary"
                                sx={{ fontWeight: 'medium' }}
                            />
                        ))}
                    </Box>
                ) : (
                    <Typography>No features suggested yet.</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default SuggestedFeatures;
