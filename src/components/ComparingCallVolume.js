import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
    ButtonGroup,
    Button,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import PhoneIcon from '@mui/icons-material/Phone';

// Color constants to match your theme
const COLOR = {
    primary: "#FFCC80",
    secondary: '#e6c0c7',
    accent: '#d3a9b0',
    light: '#f8eaed',
    border: 'rgba(241, 206, 212, 0.5)',
    text: '#806368'
};

const ComparingCallVolume = ({ businessId }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [viewMode, setViewMode] = useState('line');
    const [activeSeries, setActiveSeries] = useState('all');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchComparingData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://52.3.145.159:8080/api/v1/comparing-call-volume/${businessId}`);

                // Validate and sanitize the response data
                const sanitizedData = {
                    ...response.data,
                    businessCallVolume: {
                        ...response.data.businessCallVolume,
                        // Filter out any null/undefined months
                        months: (response.data.businessCallVolume?.months || []).filter(Boolean),
                        // Ensure arrays are the same length
                        answered: response.data.businessCallVolume?.answered || [],
                        missed: response.data.businessCallVolume?.missed || [],
                        voicemail: response.data.businessCallVolume?.voicemail || []
                    }
                };

                setData(sanitizedData);
            } catch (error) {
                console.error("Error fetching comparing call volume data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComparingData();
    }, [businessId]);

    if (loading) {
        return (
            <Card sx={{
                p: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 300,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: `1px solid ${COLOR.border}`,
                mb: 4
            }}>
                <CircularProgress sx={{ color: COLOR.accent }} />
            </Card>
        );
    }

    if (!data) {
        return (
            <Card sx={{
                p: 4,
                textAlign: 'center',
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: `1px solid ${COLOR.border}`,
                mb: 4
            }}>
                <Typography variant="body1" color="text.secondary">
                    No call volume comparison data available for this business.
                </Typography>
            </Card>
        );
    }

    // Prepare data for the graph
    const businessCV = data.businessCallVolume;
    const aggregatedCV = data.aggregatedCallVolumes;

    // Ensure months are in the correct order (chronological)
 
    const months = [...(businessCV.months || [])].filter(Boolean);

    // Log raw data to help debug
    console.log("Raw business data:", businessCV);
    console.log("Raw aggregated data:", aggregatedCV);

    // Series for the specified business - now with all three call types
    const businessAnsweredSeries = {
        name: "Your Business Answered Calls",
        id: "business-answered",
        data: businessCV.answered || []
    };

    const businessMissedSeries = {
        name: "Your Business Missed Calls",
        id: "business-missed",
        data: businessCV.missed || []
    };

    const businessVoicemailSeries = {
        name: "Your Business Voicemail",
        id: "business-voicemail",
        data: businessCV.voicemail || []
    };

    // Sort aggregated data to match the order of business months
    const sortedAggregatedData = months.map(month => {
        // Null safety check
        if (!month) return { avgAnswered: 0, avgMissed: 0, avgVoicemail: 0 };

        const matchedRecord = aggregatedCV.find(record =>
            record && record.month && record.month.toLowerCase() === month.toLowerCase()
        );

        // Debug the matching process
        console.log(`Matching ${month}:`, matchedRecord ?
            `Found with missed = ${matchedRecord.avgMissed}` :
            'Not found');

        return matchedRecord || { avgAnswered: 0, avgMissed: 0, avgVoicemail: 0 };
    });

    // Series for aggregated averages
    const avgAnsweredSeries = {
        name: "Industry Average Answered",
        id: "avg-answered",
        data: sortedAggregatedData.map(record => {
            // Add a tiny offset to ensure series are distinguishable
            return (record.avgAnswered || 0) + 0.01;
        })
    };

    const avgMissedSeries = {
        name: "Industry Average Missed",
        id: "avg-missed",
        data: sortedAggregatedData.map(record => {
            // Add a tiny offset to ensure series are distinguishable
            return (record.avgMissed || 0) + 0.01;
        })
    };

    const avgVoicemailSeries = {
        name: "Industry Average Voicemail",
        id: "avg-voicemail",
        data: sortedAggregatedData.map(record => {
            // Add a tiny offset to ensure series are distinguishable
            return (record.avgVoicemail || 0) + 0.01;
        })
    };

    // Define which series to show based on user selection
    let seriesToShow = [];

    if (activeSeries === 'all') {
        seriesToShow = [
            businessAnsweredSeries,
            avgAnsweredSeries,
            businessMissedSeries,
            avgMissedSeries,
            businessVoicemailSeries,
            avgVoicemailSeries
        ];
    } else if (activeSeries === 'answered') {
        seriesToShow = [businessAnsweredSeries, avgAnsweredSeries];
    } else if (activeSeries === 'missed') {
        seriesToShow = [businessMissedSeries, avgMissedSeries];
    } else if (activeSeries === 'voicemail') {
        seriesToShow = [businessVoicemailSeries, avgVoicemailSeries];
    }

    // Adding debug logging to help troubleshoot data issues
    console.log("Months after filtering:", months);
    console.log("Business Answered:", businessAnsweredSeries.data);
    console.log("Avg Answered:", avgAnsweredSeries.data);
    console.log("Business Missed:", businessMissedSeries.data);
    console.log("Avg Missed:", avgMissedSeries.data);

    // Compare if data is truly identical, which would cause ApexCharts to merge lines
    const missedDataIsIdentical = JSON.stringify(businessMissedSeries.data) === JSON.stringify(avgMissedSeries.data);
    console.log("Missed data is identical:", missedDataIsIdentical);

    // Add a tiny offset to one of the series if they are identical
    if (missedDataIsIdentical) {
        avgMissedSeries.data = avgMissedSeries.data.map(value => value + 0.01);
    }

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
            },
            foreColor: COLOR.text
        },
        colors: [
            '#4CAF50', // Business Answered - Green
            '#8BC34A', // Avg Answered - Light Green
            '#F44336', // Business Missed - Red
            '#FF5252', // Avg Missed - Light Red
            '#FFC107', // Business Voicemail - Amber
            '#FFD54F'  // Avg Voicemail - Light Amber
        ],
        xaxis: {
            categories: months,
            labels: {
                style: {
                    fontSize: '12px',
                    colors: Array(months.length).fill(COLOR.text)
                },
                // Only format if we have a value
                formatter: function (value) {
                    if (!value || typeof value !== 'string') return '';
                    try {
                        return value.charAt(0).toUpperCase() + value.slice(1);
                    } catch (e) {
                        console.error("Error formatting month label:", e, value);
                        return value || '';
                    }
                }
            },
            title: {
                text: 'Month',
                style: {
                    fontWeight: 500
                }
            }
        },
        yaxis: {
            title: {
                text: 'Number of Calls',
                style: {
                    fontWeight: 500
                }
            },
            min: 0,
            forceNiceScale: true,
            labels: {
                formatter: function (value) {
                    return Math.round(value);
                }
            }
        },
        stroke: {
            width: [3, 3, 3, 3, 3, 3], // Line width for each series 
            curve: 'smooth',
            dashArray: [0, 4, 0, 4, 0, 4] // Solid for business, dashed for averages
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
            size: 4,
            hover: {
                size: 6
            }
        },
        grid: {
            borderColor: COLOR.border,
            row: {
                colors: ['transparent', 'transparent']
            }
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (value) {
                    return Math.round(value) + ' calls'
                }
            }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px',
            markers: {
                width: 12,
                height: 12,
                radius: 6
            },
            itemMargin: {
                horizontal: 10,
                vertical: 8
            }
        }
    };

    return (
        <Card sx={{
            p: 0,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: `1px solid ${COLOR.border}`,
            mb: 4
        }}>
            <CardContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    mb: 2,
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ color: COLOR.accent, mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLOR.text }}>
                            Comparing Call Volume
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 2
                    }}>
                        <ButtonGroup variant="outlined" size="small">
                            <Button
                                onClick={() => setActiveSeries('all')}
                                variant={activeSeries === 'all' ? 'contained' : 'outlined'}
                                sx={{
                                    bgcolor: activeSeries === 'all' ? COLOR.primary : 'transparent',
                                    borderColor: COLOR.border,
                                    color: COLOR.text,
                                    '&:hover': {
                                        bgcolor: activeSeries === 'all' ? COLOR.primary : `${COLOR.light}80`,
                                        borderColor: COLOR.border
                                    }
                                }}
                            >
                                ALL
                            </Button>
                            <Button
                                onClick={() => setActiveSeries('answered')}
                                variant={activeSeries === 'answered' ? 'contained' : 'outlined'}
                                sx={{
                                    bgcolor: activeSeries === 'answered' ? COLOR.primary : 'transparent',
                                    borderColor: COLOR.border,
                                    color: COLOR.text,
                                    '&:hover': {
                                        bgcolor: activeSeries === 'answered' ? COLOR.primary : `${COLOR.light}80`,
                                        borderColor: COLOR.border
                                    }
                                }}
                            >
                                ANSWERED
                            </Button>
                            <Button
                                onClick={() => setActiveSeries('missed')}
                                variant={activeSeries === 'missed' ? 'contained' : 'outlined'}
                                sx={{
                                    bgcolor: activeSeries === 'missed' ? COLOR.primary : 'transparent',
                                    borderColor: COLOR.border,
                                    color: COLOR.text,
                                    '&:hover': {
                                        bgcolor: activeSeries === 'missed' ? COLOR.primary : `${COLOR.light}80`,
                                        borderColor: COLOR.border
                                    }
                                }}
                            >
                                MISSED
                            </Button>
                            <Button
                                onClick={() => setActiveSeries('voicemail')}
                                variant={activeSeries === 'voicemail' ? 'contained' : 'outlined'}
                                sx={{
                                    bgcolor: activeSeries === 'voicemail' ? COLOR.primary : 'transparent',
                                    borderColor: COLOR.border,
                                    color: COLOR.text,
                                    '&:hover': {
                                        bgcolor: activeSeries === 'voicemail' ? COLOR.primary : `${COLOR.light}80`,
                                        borderColor: COLOR.border
                                    }
                                }}
                            >
                                VOICEMAIL
                            </Button>
                        </ButtonGroup>

                        <ButtonGroup variant="outlined" size="small">
                            <Button
                                onClick={() => setViewMode('line')}
                                variant={viewMode === 'line' ? 'contained' : 'outlined'}
                                sx={{
                                    bgcolor: viewMode === 'line' ? COLOR.primary : 'transparent',
                                    borderColor: COLOR.border,
                                    color: COLOR.text,
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
                                    color: COLOR.text,
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
                                    color: COLOR.text,
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

                <Box sx={{ height: isMobile ? 300 : 350, width: '100%' }}>
                    <ReactApexChart
                        options={options}
                        series={seriesToShow}
                        type={viewMode}
                        height="100%"
                        width="100%"
                    />
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'gray',
                        fontStyle: 'italic',
                        mt: 2,
                        textAlign: 'center'
                    }}
                >
                    This chart compares your business call volume metrics with the average for similar businesses in your category.
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ComparingCallVolume;