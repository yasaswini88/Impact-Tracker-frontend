// SeasonalTrends.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, CircularProgress } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

const SeasonalTrends = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const { data } = await axios.get(`http://52.3.145.159:8080/api/v1/seasonal-trends/${businessId}`);
        setTrends(data.monthlyTrends);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [businessId]);

  if (loading) return <CircularProgress />;
  if (!trends) return <Typography>No trends available.</Typography>;

  const options = {
    chart: { type: 'line' },
    xaxis: { categories: Object.keys(trends) },
    title: { text: 'Seasonal Trends' },
  };

  const series = [{ name: 'Demand', data: Object.values(trends) }];

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">Seasonal Trends</Typography>
      <ReactApexChart options={options} series={series} type="line" height={250} />
    </Card>
  );
};

export default SeasonalTrends;
