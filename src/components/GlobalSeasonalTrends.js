import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

const GlobalSeasonalTrends = () => {
    const [businessTypes, setBusinessTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBusinessTypes = async () => {
            const res = await axios.get('http://52.3.145.159:8080/api/v1/businesses');
            const types = [...new Set(res.data.map(b => b.businessType).filter(Boolean))];
            setBusinessTypes(types);
            if (types.length) setSelectedType(types[0]);
        };
        fetchBusinessTypes();
    }, []);

    useEffect(() => {
        const fetchTrends = async () => {
            if (!selectedType) return;
            setLoading(true);
            try {
                const res = await axios.get(`http://52.3.145.159:8080/api/v1/global-seasonal-trends/${selectedType}`);
                setTrends(res.data);
            } catch (e) {
                console.error(e);
                setTrends(null);
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, [selectedType]);

    if (!businessTypes.length) return <CircularProgress />;

    const options = {
        chart: { type: 'line' },
        xaxis: { categories: trends ? Object.keys(trends) : [] },
        title: { text: `Global Seasonal Trends (${selectedType})` },
    };

    const series = [{ name: 'Demand', data: trends ? Object.values(trends) : [] }];

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h5">Global Seasonal Trends</Typography>

            <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
                <InputLabel>Select Business Type</InputLabel>
                <Select
                    value={selectedType}
                    label="Select Business Type"
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    {businessTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {loading ? <CircularProgress /> : (
                trends ? <ReactApexChart options={options} series={series} type="line" height={300} /> : 
                <Typography>No trends available.</Typography>
            )}
        </Card>
    );
};

export default GlobalSeasonalTrends;
