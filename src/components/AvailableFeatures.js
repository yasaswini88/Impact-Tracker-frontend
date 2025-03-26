import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';

const AvailableFeatures = () => {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const res = await axios.get('http://52.3.145.159:8080/api/v1/features');
                setFeatures(res.data);
            } catch (error) {
                console.error("Error fetching features:", error);
                setFeatures([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatures();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card sx={{ borderRadius: 2, border: '1px solid rgba(63,81,181,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
            <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#3f51b5', mb: 2 }}>
                    <ListAltIcon /> Available Features
                </Typography>
                <List>
                    {features.map((feature, index) => (
                        <React.Fragment key={feature.featureId}>
                            <ListItem>
                                <ListItemText primary={feature.featureName} />
                            </ListItem>
                            {index < features.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default AvailableFeatures;
