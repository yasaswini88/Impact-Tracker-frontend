// src/components/Dashboard.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import ReactApexChart from "react-apexcharts";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Fab,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import { Drawer } from "@mui/material";
import Chatbot from "./Chatbot";
import { Snackbar, Alert } from "@mui/material";




// MUI v5 components
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    useTheme,
    Button
} from "@mui/material";

// We'll import your ReactBigCalendar component
import ReactBigCalendar from "./ReactBigCalendar";

const Dashboard = () => {
    const storedBusinessUser = localStorage.getItem("businessUser");
    const businessUser = storedBusinessUser ? JSON.parse(storedBusinessUser) : null;
    const businessId = businessUser ? businessUser.businessId : null;
    const businessType = businessUser ? businessUser.businessType : null;

    const [googleReviewState, setGoogleReviewState] = useState(null);  // "Pending","Y","N","NONE"
    const [callCampaignState, setCallCampaignState] = useState(null);  // ...

    // This will store whichever strategies you want to show in the Chatbot
    const [callCampaignStrategies, setCallCampaignStrategies] = useState([]);


    // Chat-related states
    const [chatMessages, setChatMessages] = useState([]);
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatInput, setChatInput] = useState("");

    // Confirmation & Insights
    const [reviewConfirmation, setReviewConfirmation] = useState(null);
    const [reviewInsights, setReviewInsights] = useState(null);

    // Snackbar
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [snackSeverity, setSnackSeverity] = useState("success");

    const theme = useTheme();

    // Business info, appointments, sentiment
    const [businessInfo, setBusinessInfo] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [weeklySentiment, setWeeklySentiment] = useState({
        negativePercentage: 0,
        positivePercentage: 0,
    });

    // Appointment form
    const [newCustomerName, setNewCustomerName] = useState("");
    const [newApptDate, setNewApptDate] = useState("");
    const [newApptStart, setNewApptStart] = useState("");
    const [newApptEnd, setNewApptEnd] = useState("");
    const [openNewAppt, setOpenNewAppt] = useState(false);
    const [showMoreOpen, setShowMoreOpen] = useState(false);

    const[callVolumeTrend, setCallVolumeTrend] = useState(null);

    // Some chart data
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
                categories: ["Feb", "March", "April", "May", "June", "July","Aug"],
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

    const [callDistrubution, setCallDistribution] = useState({
        series: [
            {
                name: "New Clients",
                data: [44, 55, 41, 37, 22, 43, 21],
            },
            {
                name: "Existing Clients",
                data: [53, 32, 33, 52, 13, 43, 32],
            },
        ],
        options: {
            chart: { type: "bar", height: 350, stacked: true },
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 0,
                            style: { fontSize: "13px", fontWeight: 900 },
                        },
                    },
                },
            },
            stroke: { width: 1, colors: ["#fff"] },
            title: { text: "" },
            xaxis: {
                categories: ["01/26", "01/25", "01/24", "01/23", "01/22", "01/21", "01/20"],
                labels: {
                    formatter: function (val) {
                        return val + "";
                    },
                },
            },
            yaxis: { title: { text: undefined } },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + "";
                    },
                },
            },
            fill: { opacity: 1 },
            legend: { position: "top", horizontalAlign: "left", offsetX: 40 },
        },
    });

    // -------------
    // Helper methods
    // -------------

    // Convert "14:00" => "2:00 PM"
    const convertTo12Hour = (time) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const fetchBusinessInfo = async () => {
        try {
            const res = await axios.get(
                `http://52.3.145.159:8080/api/v1/businesses/${businessId}`
            );
            setBusinessInfo(res.data);
        } catch (error) {
            console.error("Error fetching business info:", error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(
                `http://52.3.145.159:8080/api/v1/appointments/business/${businessId}`
            );
            setAppointments(res.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const fetchReviewConfirmation = async () => {
        try {
            const url = `http://52.3.145.159:8080/api/v1/review-confirmation/${businessId}`;
            const response = await axios.get(url);
            setReviewConfirmation(response.data);
        } catch (err) {
            console.error("No existing confirmation found or error:", err);
            // Optionally create a pending record if none
            createPendingConfirmation();
        }
    };

    const createPendingConfirmation = async () => {
        try {
            const url = `http://52.3.145.159:8080/api/v1/review-confirmation/create/${businessId}`;
            const response = await axios.post(url);
            setReviewConfirmation(response.data);
        } catch (err) {
            console.error("Error creating pending confirmation:", err);
        }
    };

    const fetchWeeklySentimentStats = async () => {
        try {
            const url = `http://52.3.145.159:8080/api/v1/sentiment-analyses/weekly-trend/${businessId}`;
            const res = await axios.get(url);
            setWeeklySentiment(res.data); // e.g. { negativePercentage: X, positivePercentage: Y }
        } catch (error) {
            console.error("Error fetching weekly sentiment stats:", error);
        }
    };

    /**
     * Either fetch existing insights or generate them if 404
     */
    const fetchOrGenerateInsights = async () => {
        try {
            const getUrl = `http://52.3.145.159:8080/api/v1/insights/${businessId}`;
            const getResponse = await axios.get(getUrl);
            setReviewInsights(getResponse.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log("No existing insights, generating now...");
                const postUrl = `http://52.3.145.159:8080/api/v1/insights/generate/${businessId}`;
                await axios.post(postUrl);
                // Then fetch them
                const finalGetUrl = `http://52.3.145.159:8080/api/v1/insights/${businessId}`;
                const finalGetResponse = await axios.get(finalGetUrl);
                setReviewInsights(finalGetResponse.data);
            } else {
                console.error("Error fetching or generating insights:", err);
            }
        }
    };

    // Create new Appointment
    const handleCreateAppointment = async () => {
        try {
            const body = {
                businessId: parseInt(businessId),
                appointmentDate: newApptDate,
                appointmentStartTime: newApptStart,
                appointmentEndTime: newApptEnd,
                appointmentRescheduled: "false",
                appointmentType: "General",
                appointmentStatus: "Scheduled",
                customerName: newCustomerName,
            };

            const response = await axios.post(
                "http://52.3.145.159:8080/api/v1/appointments",
                body
            );
            console.log("Created appointment: ", response.data);

            setOpenNewAppt(false);
            fetchAppointments();
            // Clear form
            setNewCustomerName("");
            setNewApptDate("");
            setNewApptStart("");
            setNewApptEnd("");
        } catch (error) {
            console.error("Error creating new appointment: ", error);
            alert("Could not create appointment. " + error);
        }
    };

    const fetchAllConfirmationsState = async () => {
        try {
            const url = `http://52.3.145.159:8080/api/v1/confirmations/state?businessId=${businessId}`;
            const response = await axios.get(url);
            // Suppose the backend returns { googleReviewResponse: "...", callCampaignResponse: "..." }
            setGoogleReviewState(response.data.googleReviewResponse || "NONE");
            setCallCampaignState(response.data.callCampaignResponse || "NONE");
        } catch (err) {
            console.error("Could not fetch confirmations state", err);
            // Optionally default to something if it fails
            setGoogleReviewState("NONE");
            setCallCampaignState("NONE");
        }
    };

    // YES -> fetch/generate insights, show them
    const handleYesClick = async () => {
        try {
          // 1) Mark userResponse = Y
          const url = `http://52.3.145.159:8080/api/v1/review-confirmation/respond?businessId=${businessId}&userResponse=Y`;
          await axios.post(url);
      
          // 2) fetch the new confirmation & insights
          await fetchReviewConfirmation();  
          // Instead of `await fetchOrGenerateInsights()` 
          //   returning them in state, do it directly:
          const insightsData = await getInsightsDirectly();
      
          // 3) Push “We have fetched your insights!” 
          setChatMessages((prev) => [
            ...prev, 
            { sender: "bot", text: "We have fetched your insights! Check below..." }
          ]);
      
          // 4) Build a single big string from insightsData 
          if (insightsData) {
            const insightsText = 
              "Review Insights\n\n" +
              `Positive Points: ${insightsData.positivePoints}\n` +
              `Negative Points: ${insightsData.negativePoints}\n` +
              `Overall Summary: ${insightsData.insights}`;
      
            setChatMessages((prev) => [
              ...prev,
              { sender: "bot", text: insightsText }
            ]);
          }
      
          // 5) Now prompt for call campaign 
          promptForCallCampaign();
      
        } catch (err) {
          console.error("Error in handleYesClick:", err);
        }
      };
      

    // NO -> don't fetch insights, close chatbot, optionally add a message
    const handleNoClick = async () => {
        try {
            const url = `http://52.3.145.159:8080/api/v1/review-confirmation/respond?businessId=${businessId}&userResponse=N`;
            const response = await axios.post(url);

            setSnackMessage(response.data);
            setSnackSeverity("success");
            setSnackOpen(true);

            await fetchReviewConfirmation();
            // Clear any old insights
            setReviewInsights(null);

            // Optionally add a "No thanks" chatbot message
            const newBotMessage = {
                sender: "bot",
                text: "Understood. We won't fetch insights. Closing the drawer now."
            };
            setChatMessages((prev) => [...prev, newBotMessage]);
        } catch (err) {
            console.error("Error in handleNoClick:", err);
        } finally {
            setShowChatbot(false);
            setShowMoreOpen(false);
        }
    };


    const getInsightsDirectly = async () => {
        try {
          // Try GET /api/v1/insights/{businessId}
          const getUrl = `http://52.3.145.159:8080/api/v1/insights/${businessId}`;
          const getResp = await axios.get(getUrl);
          return getResp.data;  // your { positivePoints, negativePoints, insights }
        } catch (err) {
          // If 404 => do generate => then re-fetch
          if (err.response && err.response.status === 404) {
            const postUrl = `http://52.3.145.159:8080/api/v1/insights/generate/${businessId}`;
            await axios.post(postUrl);
      
            const finalUrl = `http://52.3.145.159:8080/api/v1/insights/${businessId}`;
            const finalGet = await axios.get(finalUrl);
            return finalGet.data; 
          } else {
            console.error("Could not fetch or generate insights:", err);
            return null;
          }
        }
      };
      

    // In Dashboard.js (or pass them down similarly to handleYesClick/handleNoClick)
    const handleCallCampaignYes = async () => {
        try {
            const url = `http://52.3.145.159:8080/api/v1/call-campaign-confirmation/respond?businessId=${businessId}&userResponse=Y`;
            const resp = await axios.post(url);

            setSnackMessage(resp.data);
            setSnackSeverity("success");
            setSnackOpen(true);

            // The original message you had:
            const msg = {
                sender: "bot",
                text: "Great! We'll prepare call campaign suggestions for you soon."
            };
            setChatMessages((prev) => [...prev, msg]);

            // NOW add the fetch for strategies
            const strategiesUrl = `http://52.3.145.159:8080/api/v1/call-campaign-strategies`;
            const strategiesResp = await axios.get(strategiesUrl);

            // Filter to only the one named “Call campaigns to collect feedback”
            setCallCampaignStrategies(strategiesResp.data);


            const newMsg = {
                sender: "bot",
                text: "Below are our recommended call campaign strategies. Click any name to see details!"
            };
            setChatMessages((prev) => [...prev, newMsg]);

        } catch (err) {
            console.error("Error in handleCallCampaignYes:", err);
        }
    };


    const handleCallCampaignNo = async () => {
        try {
            const url = `http://52.3.145.159:8080/api/v1/call-campaign-confirmation/respond?businessId=${businessId}&userResponse=N`;
            const resp = await axios.post(url);
            setSnackMessage(resp.data);
            setSnackSeverity("success");
            setSnackOpen(true);

            const msg = {
                sender: "bot",
                text: "Understood. We won't proceed with a call campaign."
            };
            setChatMessages((prev) => [...prev, msg]);

            // optionally close the Chatbot
            setShowChatbot(false);
        } catch (err) {
            console.error("Error in handleCallCampaignNo:", err);
        }
    };

    // If user previously said "Y" to google reviews, we ask them about the call campaign
    const promptForCallCampaign = async () => {
        // Optionally fetch the existing call campaign record
        try {
            const ccUrl = `http://52.3.145.159:8080/api/v1/call-campaign-confirmation/${businessId}`;
            const resp = await axios.get(ccUrl);

            // If we have an existing record with userResponse != "Pending", skip
            if (resp.data.userResponse !== "Pending") {
                // They already answered call campaign => do nothing or show a snack
                return;
            }
            // else continue
        } catch (err) {
            // if 404, create a pending
            const createUrl = `http://52.3.145.159:8080/api/v1/call-campaign-confirmation/create/${businessId}`;
            await axios.post(createUrl);
        }

        const message = {
            sender: 'bot',
            text: "As you agreed for fetching Google reviews, and as per the results we shared. Do you want some call campaign suggestions?"
        };
        setChatMessages((prev) => [...prev, message]);
        setShowChatbot(true);
    };




    // Toggle chatbot
    const toggleChatbot = () => {
        setShowChatbot((prev) => !prev);
    };


    // This is what happens when the user clicks "Show More"
    const handleShowMoreClick = async () => {
        try {
            // 1) Fetch the business_google_review_confirmation
            const url = `http://52.3.145.159:8080/api/v1/review-confirmation/${businessId}`;
            const response = await axios.get(url);
            const confirmation = response.data; // { userResponse: "Y"|"N"|"Pending" }
            setReviewConfirmation(confirmation);

            if (!confirmation || confirmation.userResponse === "Pending") {
                // Scenario 1: user never responded => we prompt them
                const alertMessage = {
                    sender: "bot",
                    text: `Would you like to see your Google Reviews Analysis?\n\nPlease select YES or NO:`,
                };
                setChatMessages((prev) => [...prev, alertMessage]);
                setShowChatbot(true);

            } else if (confirmation.userResponse === "Y") {
                // Scenario 2: user responded "Y" previously
                // => fetch or generate insights automatically
                await fetchOrGenerateInsights();

                // Then prompt for the call campaign
                promptForCallCampaign();

                // Optionally show the chatbot so they see the insights
                setShowChatbot(true);

            } else if (confirmation.userResponse === "N") {
                // They previously said "No"
                // => do nothing, or show a small snack
                setSnackMessage("You already opted out of Google Review analysis.");
                setSnackSeverity("info");
                setSnackOpen(true);
            }
        } catch (err) {
            // Possibly 404 => create "Pending"
            console.log("Review confirmation record not found, creating one...");
            await createPendingConfirmation();
            // Then show the prompt:
            const alertMessage = {
                sender: "bot",
                text: `Would you like to see your Google Reviews Analysis?\n\nPlease select YES or NO:`,
            };
            setChatMessages((prev) => [...prev, alertMessage]);
            setShowChatbot(true);
        }
    };

    // Chat input
    const handleChatSubmit = () => {
        const newMessage = { sender: "user", text: chatInput };
        setChatMessages((prev) => [...prev, newMessage]);

        // Mock bot response
        const botResponse = { sender: "bot", text: `You said: ${chatInput}` };
        setChatMessages((prev) => [...prev, botResponse]);

        setChatInput("");
    };

    // useEffect
    useEffect(() => {
        if (!businessId) return;
        fetchBusinessInfo();
        fetchAppointments();
        fetchWeeklySentimentStats();
        fetchReviewConfirmation();
        fetchAllConfirmationsState();
    }, [businessId]);


    useEffect(() => {
        // If you have businessId from localStorage
        if (!businessId) {
          console.log("No businessId found, skip callVolumeTrend fetch");
          return;
        }
      
        async function fetchCallVolumeTrend() {
          try {
            // Now the request body has only the arrays
            const requestBody = {
              answered: [42, 109, 100, 31, 40, 28, 14],
              missed: [11, 34, 52, 32, 45, 32, 20],
              voicemail: [11, 32, 52, 41, 28, 32, 20],
              months: ["Jan", "Feb", "March", "April", "May", "June", "July"],
            };
      
            // Notice the URL: /call-volume-trend/ + businessId
            const response = await axios.post(
              `http://52.3.145.159:8080/api/v1/sentiment-analyses/call-volume-trend/${businessId}`,
              requestBody
            );
      
            setCallVolumeTrend(response.data);
          } catch (err) {
            console.error("Could not fetch call volume trend:", err);
          }
        }
      
        fetchCallVolumeTrend();
      }, [businessId]);
      
      
    // Separate appointments
    const originalAppointments = appointments.filter((appt) => !appt.appointmentRescheduled);
    const rescheduledAppointments = appointments.filter(
        (appt) => appt.appointmentRescheduled === "true"
    );

    // Table pagination
    const [page1, setPage1] = useState(0);
    const [page2, setPage2] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage1 = (event, newPage) => setPage1(newPage);
    const handleChangePage2 = (event, newPage) => setPage2(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage1(0);
        setPage2(0);
    };

    const handleOpenNewAppt = () => setOpenNewAppt(true);
    const handleCloseNewAppt = () => setOpenNewAppt(false);

    // Style
    const tableHeaderStyle = {
        backgroundColor: "#ff4d6d",
        color: "#ffffff",
        fontWeight: "bold",
    };

    const cardStyle = {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        borderRadius: theme.shape.borderRadius,
    };

    return (
        <Grid container spacing={3} sx={{ p: 3 }}>
            {/* TOP CARD */}
            <Grid item xs={12}>
                <Card sx={{ ...cardStyle, "& .MuiCardContent-root": { p: 3 } }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#ff4d6d" }}>
                            AI-Driven Insights for {businessInfo ? businessInfo.businessName : "Business"}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Welcome to your dashboard! Here are some insights for your business.
                        </Typography>
                        <Typography variant="body1">{weeklySentiment.trend_summary}</Typography>

                        {callVolumeTrend && (
    <Typography variant="body1" sx={{ mt: 1 }}>
   {callVolumeTrend.call_volume_summary}
    </Typography>
  )}

                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={() => {
                                if (googleReviewState === "Y") {
                                    // user already said "Yes" => fetchInsights if not done or show them
                                    fetchOrGenerateInsights();
                                    promptForCallCampaign();
                                    return;
                                } else if (googleReviewState === "N") {
                                    // user said "No" => maybe do a snack or do nothing
                                    setSnackMessage("You already said NO to Google Reviews.");
                                    setSnackSeverity("info");
                                    setSnackOpen(true);
                                    return;
                                } else if (googleReviewState === "Pending") {
                                    // Then push the Negative Review Alert message
                                    const alertMessage = {
                                        sender: 'bot',
                                        text: "Negative Review Alert...\nWould you like us to fetch Google Reviews?"
                                    };
                                    setChatMessages([...chatMessages, alertMessage]);
                                    setShowChatbot(true);
                                } else {
                                    // "NONE" means no record in DB but not created => create pending or do it automatically
                                    createPendingConfirmation(); // or same logic as "Pending"
                                }
                            }}

                        >
                            Show More
                        </Button>
                    </CardContent>
                </Card>
            </Grid>

            {/* BUSINESS INFO ROW */}
            <Grid item xs={12} container spacing={2}>
                <Grid item xs={12} md={9.6}>
                    <Card sx={{ ...cardStyle, "& .MuiCardContent-root": { p: 3 } }}>
                        <CardContent>
                            {businessInfo ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <BusinessIcon sx={{ fontSize: 40, color: "#ff4d6d" }} />
                                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                                            <strong>{businessInfo.businessName}</strong>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <AccessTimeIcon sx={{ fontSize: 40, color: "#ff4d6d" }} />
                                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                                            <strong>Opening:</strong> {convertTo12Hour(businessInfo.openingTime)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <AccessTimeIcon sx={{ fontSize: 40, color: "#ff4d6d" }} />
                                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                                            <strong>Closing:</strong> {convertTo12Hour(businessInfo.closingTime)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Typography>Loading business info...</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* CHARTS ROW */}
            <Grid item xs={12}>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                ...cardStyle,
                                p: 1,
                                "& .MuiTableContainer-root": {
                                    borderRadius: theme.shape.borderRadius,
                                    border: `1px solid ${theme.palette.divider}`,
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                            >
                                Call Volume
                            </Typography>
                            <ReactApexChart
                                options={callVolume.options}
                                series={callVolume.series}
                                type="area"
                                height={200}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={3}
                            sx={{
                                ...cardStyle,
                                p: 1,
                                "& .MuiTableContainer-root": {
                                    borderRadius: theme.shape.borderRadius,
                                    border: `1px solid ${theme.palette.divider}`,
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                            >
                                Customer Distribution
                            </Typography>
                            <ReactApexChart
                                options={callDistrubution.options}
                                series={callDistrubution.series}
                                type="bar"
                                height={200}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>

            {/* ROW 2: LEFT = CALL HISTORY, RIGHT = CALENDAR + TABLE */}
            <Grid item xs={12} container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            ...cardStyle,
                            p: 3,
                            "& .MuiTableContainer-root": {
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.divider}`,
                            },
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                        >
                            Call History
                        </Typography>

                        <List
                            sx={{
                                width: "100%",
                                maxWidth: 360,
                                height: "100vh",
                                bgcolor: "background.paper",
                            }}
                        >
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <CallReceivedIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="707 (217)-1427" secondary="Jan 9, 2025 11:30:00 AM" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <CallReceivedIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="787 (567)-8927" secondary="Jan 7, 2025 10:00:00 AM" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <CallReceivedIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="703 (567)-1787" secondary="July 20, 2025 09:00:00 PM" />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* Right side: BigCalendar and Rescheduled Appts */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ ...cardStyle, p: 3, height: "100%" }}>
                        <ReactBigCalendar />
                    </Paper>

                    {/* Rescheduled Appts */}
                    <Paper
                        elevation={3}
                        sx={{
                            ...cardStyle,
                            p: 3,
                            "& .MuiTableContainer-root": {
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.divider}`,
                            },
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                        >
                            Rescheduled Appointments
                        </Typography>
                        {/* ... Your table code ... */}
                    </Paper>
                </Grid>
            </Grid>

            {/* DIALOG for new Appt */}
            <Dialog open={openNewAppt} onClose={handleCloseNewAppt}>
                <DialogTitle>New Appointment</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Customer Name"
                        fullWidth
                        margin="normal"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                    />
                    <TextField
                        label="Appointment Date (YYYY-MM-DD)"
                        fullWidth
                        margin="normal"
                        value={newApptDate}
                        onChange={(e) => setNewApptDate(e.target.value)}
                    />
                    <TextField
                        label="Start Time (HH:mm:ss)"
                        fullWidth
                        margin="normal"
                        value={newApptStart}
                        onChange={(e) => setNewApptStart(e.target.value)}
                    />
                    <TextField
                        label="End Time (HH:mm:ss)"
                        fullWidth
                        margin="normal"
                        value={newApptEnd}
                        onChange={(e) => setNewApptEnd(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewAppt}>Cancel</Button>
                    <Button onClick={handleCreateAppointment} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Chatbot Drawer */}
            <Chatbot
                showChatbot={showChatbot}
                toggleChatbot={toggleChatbot}
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleChatSubmit={() => handleChatSubmit()}
                handleYesClick={handleYesClick}
                handleNoClick={handleNoClick}
                reviewConfirmation={reviewConfirmation}
                reviewInsights={reviewInsights}
                handleCallCampaignYes={handleCallCampaignYes}
                handleCallCampaignNo={handleCallCampaignNo}
                callCampaignStrategies={callCampaignStrategies}
            />

            {/* Snackbar */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Alert
                    onClose={() => setSnackOpen(false)}
                    severity={snackSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default Dashboard;