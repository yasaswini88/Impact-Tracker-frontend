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
    Skeleton,
} from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import { Drawer } from "@mui/material";
import Chatbot from "./Chatbot";
import { Snackbar, Alert } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AiLoadingAnimation from "./AiLoadingAnimation";
import CallHistory from "./CallHistory";





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

    const [pastCampaigns, setPastCampaigns] = useState([]);
    // This will hold all the previously submitted “forms.”

    const [openPastCampaignsDialog, setOpenPastCampaignsDialog] = useState(false);
    // This controls showing/hiding the dialog that lists them.

    const [showAllCampaigns, setShowAllCampaigns] = useState(false);
    // This toggles “View More” to show more than 3 if user wants.



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

    const [openCampaignForm, setOpenCampaignForm] = useState(false);

    // 2) States for the form input
    const [selectedStrategies, setSelectedStrategies] = useState([]); // array of IDs
    const [campaignVoice, setCampaignVoice] = useState("");
    const [targetAudience, setTargetAudience] = useState("ALL"); // default?

    // Appointment form
    const [newCustomerName, setNewCustomerName] = useState("");
    const [newApptDate, setNewApptDate] = useState("");
    const [newApptStart, setNewApptStart] = useState("");
    const [newApptEnd, setNewApptEnd] = useState("");
    const [openNewAppt, setOpenNewAppt] = useState(false);
    const [showMoreOpen, setShowMoreOpen] = useState(false);

    const [callVolumeTrend, setCallVolumeTrend] = useState(null);

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
                categories: ["aug", "sep", "oct", "nov", "dec", "jan", "feb"],
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


    const fetchPastCampaigns = async () => {
        if (!businessId) return;
        try {
            const url = `http://52.3.145.159:8080/api/v1/call-campaign-selection/by-business/${businessId}`;
            const response = await axios.get(url);
            // response.data = an array of your BusinessCallCampaignStrategySelection entities
            setPastCampaigns(response.data);
        } catch (error) {
            console.error("Error fetching past campaign forms:", error);
            setPastCampaigns([]);
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
            console.log("Fetched strategies:", strategiesResp.data);


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
            text: "Would you like some call campaign suggestions based on the Google reviews we retrieved and the results we shared?"
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


    const handleSaveCampaignSelection = async () => {
        try {
            // Build the request body
            const requestBody = {
                businessId: parseInt(businessId),
                strategyIds: selectedStrategies,    // array of IDs
                callCampaignVoice: campaignVoice,
                targetAudience: targetAudience,
            };

            const response = await axios.post(
                "http://52.3.145.159:8080/api/v1/call-campaign-selection",
                requestBody
            );

            console.log("Campaign selection saved:", response.data);

            // Show a snackbar or message
            setSnackMessage("Campaign selection saved!");
            setSnackSeverity("success");
            setSnackOpen(true);

            // Close the dialog
            setOpenCampaignForm(false);

            // Optionally reset form fields
            setSelectedStrategies([]);
            setCampaignVoice("");
            setTargetAudience("ALL");
        } catch (error) {
            console.error("Error saving campaign selection:", error);
            setSnackMessage("Could not save campaign selection.");
            setSnackSeverity("error");
            setSnackOpen(true);
        }
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

    const [aITrendLoading, setAItrendLoading] = useState(false);
    useEffect(() => {
        // If you have businessId from localStorageß
        if (!businessId) {
            console.log("No businessId found, skip callVolumeTrend fetch");
            return;
        }

        async function fetchCallVolumeTrend() {
            try {
                setAItrendLoading(true);
                // Now the request body has only the arrays
                const requestBody = {
                    answered: [42, 109, 100, 31, 40, 28, 14],
                    // missed: [11, 34, 52, 32, 12, 8, 2],
                    // voicemail: [11, 32, 52, 41, 28, 32, 20],
                    months: ["aug", "sep", "oct", "nov", "dec", "jan", "feb"],
                };

                // Notice the URL: /call-volume-trend/ + businessId
                const response = await axios.post(
                    `http://52.3.145.159:8080/api/v1/sentiment-analyses/call-volume-trend/${businessId}`,
                    requestBody
                );

                setCallVolumeTrend(response.data);
                setAItrendLoading(false);
            } catch (err) {
                console.error("Could not fetch call volume trend:", err);
            }
        }

        fetchCallVolumeTrend();
    }, [businessId]);

    const fetchCallCampaignStrategies = async () => {
        try {
            const url = "http://52.3.145.159:8080/api/v1/call-campaign-strategies";
            const response = await axios.get(url);
            setCallCampaignStrategies(response.data);  // will populate state
        } catch (e) {
            console.error("Error fetching call campaign strategies:", e);
        }
    };

    useEffect(() => {
        if (callCampaignState === "Y") {
            fetchCallCampaignStrategies();
        }
    }, [callCampaignState]);



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
            {/* TOP CARD */}
            <Grid item xs={12}>
                <Card sx={{
                    ...cardStyle,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'visible',
                    border: '1px solid rgba(255, 77, 109, 0.2)',  // Much lighter pink border
                    '&:hover': {
                        borderColor: 'rgba(255, 77, 109, 0.3)',  // Slightly darker on hover but still light
                        transition: 'border-color 0.3s ease'
                    }
                }}>
                    <CardContent sx={{ p: 4 }}>
                        {/* Title Section */}
                        <Box sx={{
                            mb: 3,
                            textAlign: 'center'  // Center the title
                        }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: '#ff4d6d',  // Changed to pink color
                                    mb: 1,
                                    fontSize: {
                                        xs: '1.5rem',
                                        sm: '1.7rem',
                                        md: '1.8rem'
                                    }
                                }}
                            >
                                AI Insights for {businessInfo ? businessInfo.businessName : "Business"}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: '1.1rem'
                                }}
                            >
                                Welcome to your dashboard! Here are some insights for your business.
                            </Typography>
                        </Box>

                        {/* Content Section */}
                        <Box sx={{
                            mb: 4,
                            textAlign: 'center'  // Center the content
                        }}>

                            {aITrendLoading ? (
                                <AiLoadingAnimation />
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 2,
                                        color: theme.palette.text.primary,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {weeklySentiment.trend_summary}
                                </Typography>
                            )}

                            {callVolumeTrend && !aITrendLoading && (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        lineHeight: 1.6
                                    }}
                                >
                                    {callVolumeTrend.call_volume_summary}
                                </Typography>
                            )}
                        </Box>

                        {/* Buttons Section */}
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'center',  // Center the buttons
                            flexWrap: 'wrap'
                        }}>
                            {callCampaignState === "Y" ? (
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        console.log("Opening the Call Campaign Form...");
                                        setOpenCampaignForm(true);
                                    }}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        backgroundColor: '#ff4d6d',  // Changed to pink color
                                        '&:hover': {
                                            backgroundColor: '#ff3d5d',  // Slightly darker on hover
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                >
                                    Call Campaign Form
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        if (googleReviewState === "Y") {
                                            fetchOrGenerateInsights();
                                            promptForCallCampaign();
                                        } else if (googleReviewState === "N") {
                                            setSnackMessage("You already said NO to Google Reviews.");
                                            setSnackSeverity("info");
                                            setSnackOpen(true);
                                        } else if (googleReviewState === "Pending") {
                                            const alertMessage = {
                                                sender: 'bot',
                                                text: "Negative Review Alert...\nWould you like us to fetch Google Reviews?"
                                            };
                                            setChatMessages([...chatMessages, alertMessage]);
                                            setShowChatbot(true);
                                        } else {
                                            createPendingConfirmation();
                                        }
                                    }}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        backgroundColor: '#ff4d6d',  // Changed to pink color
                                        '&:hover': {
                                            backgroundColor: '#ff3d5d',  // Slightly darker on hover
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                >
                                    Show More
                                </Button>
                            )}

                            <Button
                                variant="outlined"
                                onClick={async () => {
                                    await fetchPastCampaigns();
                                    setOpenPastCampaignsDialog(true);
                                }}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    borderWidth: 2,
                                    color: '#ff4d6d',  // Changed to pink color
                                    borderColor: '#ff4d6d',  // Changed to pink color
                                    '&:hover': {
                                        borderWidth: 2,
                                        borderColor: '#ff3d5d',  // Slightly darker on hover
                                        backgroundColor: 'rgba(255, 77, 109, 0.1)'  // Light pink background on hover
                                    }
                                }}
                            >
                                View Past Campaigns
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* BUSINESS INFO ROW */}
            <Grid item xs={12} container spacing={2}>
                <Grid item xs={12} >
                    {/* BUSINESS INFO CARD */}
                    <Card sx={{
                        ...cardStyle,
                        "& .MuiCardContent-root": { p: 3 },
                        border: '1px solid rgba(255, 77, 109, 0.2)',  // Light pink border
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '&:hover': {
                            borderColor: 'rgba(255, 77, 109, 0.3)',  // Slightly darker on hover
                            transition: 'border-color 0.3s ease'
                        }
                    }}>
                        <CardContent>
                            {businessInfo ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <BusinessIcon sx={{ fontSize: 40, color: "#ff4d6d" }} />
                                            <Typography variant="h6" sx={{
                                                fontWeight: "medium",
                                                textAlign: 'center'
                                            }}>
                                                <strong>{businessInfo.businessName}</strong>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <AccessTimeIcon sx={{ fontSize: 40, color: "#ff4d6d" }} />
                                            <Typography variant="h6" sx={{
                                                fontWeight: "medium",
                                                textAlign: 'center'
                                            }}>
                                                <strong>Opening:</strong> {convertTo12Hour(businessInfo.openingTime)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <AccessTimeIcon sx={{ fontSize: 40, color: "#ff4d6d" }} />
                                            <Typography variant="h6" sx={{
                                                fontWeight: "medium",
                                                textAlign: 'center'
                                            }}>
                                                <strong>Closing:</strong> {convertTo12Hour(businessInfo.closingTime)}
                                            </Typography>
                                        </Box>
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
                                p: 2,  // Increased padding slightly
                                border: '1px solid rgba(255, 77, 109, 0.2)',  // Light pink border
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 77, 109, 0.3)',  // Slightly darker on hover
                                    transition: 'border-color 0.3s ease'
                                },
                                "& .MuiTableContainer-root": {
                                    borderRadius: theme.shape.borderRadius,
                                    border: `1px solid ${theme.palette.divider}`,
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    fontWeight: "bold",
                                    color: '#ff4d6d',  // Matching the pink theme
                                    mb: 2,
                                    pl: 1  // Added slight padding to align with chart
                                }}
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
                            elevation={0}
                            sx={{
                                ...cardStyle,
                                p: 2,
                                border: '1px solid rgba(255, 77, 109, 0.2)',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 77, 109, 0.3)',
                                    transition: 'border-color 0.3s ease'
                                },
                                "& .MuiTableContainer-root": {
                                    borderRadius: theme.shape.borderRadius,
                                    border: `1px solid ${theme.palette.divider}`,
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    fontWeight: "bold",
                                    color: '#ff4d6d',
                                    mb: 2,
                                    pl: 1
                                }}
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
            <Grid item xs={12} container spacing={3}
            sx={{
                ...cardStyle,
                p: 2,  // Increased padding slightly
                border: '1px solid rgba(255, 77, 109, 0.2)',  // Light pink border
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                    borderColor: 'rgba(255, 77, 109, 0.3)',  // Slightly darker on hover
                    transition: 'border-color 0.3s ease'
                },
                "& .MuiTableContainer-root": {
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                },
            }}>
                {/* Call History - 40% Width */}
                <Grid item xs={12} md={5} sx={{
                                ...cardStyle,
                                p: 2,  // Increased padding slightly
                                border: '1px solid rgba(255, 77, 109, 0.2)',  // Light pink border
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 77, 109, 0.3)',  // Slightly darker on hover
                                    transition: 'border-color 0.3s ease'
                                },
                                "& .MuiTableContainer-root": {
                                    borderRadius: theme.shape.borderRadius,
                                    border: `1px solid ${theme.palette.divider}`,
                                },
                            }}>
                    <CallHistory businessId={businessId} />
                </Grid>

                {/* React Big Calendar - 60% Width */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{
                                ...cardStyle,
                                p: 2,  // Increased padding slightly
                                border: '1px solid rgba(255, 77, 109, 0.2)',  // Light pink border
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 77, 109, 0.3)',  // Slightly darker on hover
                                    transition: 'border-color 0.3s ease'
                                },
                                "& .MuiTableContainer-root": {
                                    borderRadius: theme.shape.borderRadius,
                                    border: `1px solid ${theme.palette.divider}`,
                                },
                            }}>
                        <ReactBigCalendar />
                    </Paper>
                </Grid>
            </Grid>

            {/* DIALOG for new Appt */}
            <Dialog
                open={openNewAppt}
                onClose={handleCloseNewAppt}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        minWidth: '400px'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    py: 2
                }}>
                    New Appointment
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <TextField
                        label="Customer Name"
                        fullWidth
                        margin="normal"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                            mb: 2
                        }}
                    />
                    <TextField
                        label="Appointment Date (YYYY-MM-DD)"
                        fullWidth
                        margin="normal"
                        value={newApptDate}
                        onChange={(e) => setNewApptDate(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                            mb: 2
                        }}
                    />
                    <TextField
                        label="Start Time (HH:mm:ss)"
                        fullWidth
                        margin="normal"
                        value={newApptStart}
                        onChange={(e) => setNewApptStart(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                            mb: 2
                        }}
                    />
                    <TextField
                        label="End Time (HH:mm:ss)"
                        fullWidth
                        margin="normal"
                        value={newApptEnd}
                        onChange={(e) => setNewApptEnd(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                            mb: 2
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, backgroundColor: theme.palette.grey[50] }}>
                    <Button
                        onClick={handleCloseNewAppt}
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.grey[200]
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateAppointment}
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark
                            },
                            px: 4
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Call Campaign Form Dialog */}
            <Dialog
                open={openCampaignForm}
                onClose={() => setOpenCampaignForm(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    py: 2
                }}>
                    Call Campaign Form
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 2,
                            fontWeight: 500,
                            color: theme.palette.text.secondary
                        }}
                    >
                        Select one or more Strategies:
                    </Typography>

                    <FormGroup sx={{ mb: 3 }}>
                        {callCampaignStrategies.map((strategy) => (
                            <FormControlLabel
                                key={strategy.id}
                                control={
                                    <Checkbox
                                        checked={selectedStrategies.includes(strategy.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedStrategies((prev) => [...prev, strategy.id]);
                                            } else {
                                                setSelectedStrategies((prev) =>
                                                    prev.filter((id) => id !== strategy.id)
                                                );
                                            }
                                        }}
                                        sx={{
                                            color: theme.palette.primary.main,
                                            '&.Mui-checked': {
                                                color: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                }
                                label={strategy.strategyName}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        color: theme.palette.text.primary
                                    }
                                }}
                            />
                        ))}
                    </FormGroup>

                    <TextField
                        label="Call Campaign Voice (custom message)"
                        multiline
                        rows={3}
                        fullWidth
                        margin="normal"
                        value={campaignVoice}
                        onChange={(e) => setCampaignVoice(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                            mb: 3
                        }}
                    />

                    <FormControl
                        fullWidth
                        sx={{
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        }}
                    >
                        <InputLabel id="targetAudienceLabel">Target Audience</InputLabel>
                        <Select
                            labelId="targetAudienceLabel"
                            label="Target Audience"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                        >
                            <MenuItem value="ALL">All</MenuItem>
                            <MenuItem value="POSITIVE">Positive Sentiment Only</MenuItem>
                            <MenuItem value="NEGATIVE">Negative Sentiment Only</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 3, backgroundColor: theme.palette.grey[50] }}>
                    <Button
                        onClick={() => setOpenCampaignForm(false)}
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.grey[200]
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveCampaignSelection}
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark
                            },
                            px: 4
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Past Campaigns Dialog */}
            <Dialog
                open={openPastCampaignsDialog}
                onClose={() => setOpenPastCampaignsDialog(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: '#ff4d6d',  // Changed to pink color
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    py: 2
                }}>
                    Previously Submitted Campaigns
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    {pastCampaigns.length === 0 ? (
                        <Typography sx={{ color: theme.palette.text.secondary }}>
                            No past submissions found.
                        </Typography>
                    ) : (
                        <>
                            {pastCampaigns
                                .slice(0, showAllCampaigns ? pastCampaigns.length : 3)
                                .map((campaign, index) => (
                                    <Box
                                        key={campaign.id}
                                        sx={{
                                            border: `1px solid ${theme.palette.grey[300]}`,
                                            borderRadius: 2,
                                            p: 3,
                                            mb: 2,
                                            backgroundColor: theme.palette.background.paper,
                                            '&:hover': {
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            }
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 500,
                                                color: theme.palette.text.primary,
                                                mb: 1
                                            }}
                                        >
                                            Submitted on: {new Date(campaign.createdAt).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }).replace(/(\d+)/, (match) => {
                                                const day = parseInt(match);
                                                const suffix = ['th', 'st', 'nd', 'rd'][(day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10];
                                                return `${day}${suffix}`;
                                            })}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                mb: 1
                                            }}
                                        >
                                            <strong>
                                                Strategy: {campaign.callCampaignStrategy.strategyName}
                                            </strong>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                mb: 1
                                            }}
                                        >
                                            Voice: {campaign.callCampaignVoice}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: theme.palette.text.secondary
                                            }}
                                        >
                                            Target Audience: {campaign.targetAudience}
                                        </Typography>
                                    </Box>
                                ))
                            }
                            {pastCampaigns.length > 3 && (
                                <Button
                                    variant="text"
                                    onClick={() => setShowAllCampaigns(!showAllCampaigns)}
                                    sx={{
                                        color: '#ff4d6d',  // Changed to pink color
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 77, 109, 0.1)'  // Light pink background on hover
                                        }
                                    }}
                                >
                                    {showAllCampaigns ? 'Show Less' : 'View More'}
                                </Button>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, backgroundColor: theme.palette.grey[50] }}>
                    <Button
                        onClick={() => setOpenPastCampaignsDialog(false)}
                        variant="contained"
                        sx={{
                            backgroundColor: '#ff4d6d',  // Changed to pink color
                            '&:hover': {
                                backgroundColor: '#ff3d5d'  // Slightly darker pink on hover
                            },
                            px: 4
                        }}
                    >
                        Close
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