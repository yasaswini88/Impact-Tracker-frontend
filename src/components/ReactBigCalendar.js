import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { Button, Grid } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Material UI
import { Snackbar, Alert, Box, Typography } from "@mui/material";

import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-US");
const localizer = momentLocalizer(moment);

const ReactBigCalendar = ({ handleOpenNewAppt }) => {
  // const { businessId } = useParams();
  const storedBusinessUser = localStorage.getItem("businessUser");
  const businessId = storedBusinessUser ? JSON.parse(storedBusinessUser).businessId : null;

  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const [eventsData, setEventsData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  // For showing errors/success
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // [ADDED] State to store the business's opening/closing times
  const [businessOpenTime, setBusinessOpenTime] = useState("");
  const [businessCloseTime, setBusinessCloseTime] = useState("");

  // 1) Fetch existing appointments
  const fetchAppointments = async (bizId) => {
    try {
      const response = await axios.get(
        `http://52.3.145.159:8080/api/v1/appointments/business/${bizId}`
      );
      const data = response.data;
      console.log("Appointments data:", data);

      const events = data.map((appointment) => ({
        id: appointment.appointmentId,
        title: appointment.customerName,
        start: moment(
          `${appointment.appointmentDate}T${appointment.appointmentStartTime}`
        ).toDate(),
        end: moment(
          `${appointment.appointmentDate}T${appointment.appointmentEndTime}`
        ).toDate(),
        rescheduled: appointment.appointmentRescheduled === "true", // Add flag
      }));
      setEventsData(events);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // [ADDED] 1a) Fetch the business details (opening/closing hours)
  const fetchBusiness = async (bizId) => {
    try {
      const response = await axios.get(
        `http://52.3.145.159:8080/api/v1/businesses/${bizId}`
      );
      const data = response.data;
      console.log("Business data:", data);

      // e.g. data.openingTime = "09:00", data.closingTime = "17:00"
      setBusinessOpenTime(data.openingTime || "");
      setBusinessCloseTime(data.closingTime || "");
    } catch (error) {
      console.error("Error fetching business info:", error);
    }
  };

  useEffect(() => {
    let intervalId;
  
    if (businessId) {
      // [ADDED] Fetch the business info (including opening/closing times)
      fetchBusiness(businessId);

      // Fetch data immediately
      fetchAppointments(businessId);
  
      // Set up interval to fetch data every 10 seconds
      intervalId = setInterval(() => {
        fetchAppointments(businessId);
      }, 10000); // 10 seconds
    }
  
    // Cleanup interval when component unmounts or businessId changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [businessId]);
  

  // 3) If we have an appointmentId from the query, we can highlight or note it
  useEffect(() => {
    if (appointmentId) {
      console.log("User wants to reschedule appointment ID:", appointmentId);
    }
  }, [appointmentId]);

  // 4) The critical part: onSelectSlot
  const handleSelectSlot = (slotInfo) => {
    if (!appointmentId) {
      alert("No appointmentId provided in the URL. Cannot reschedule!");
      return;
    }

    // [ADDED] Check if business hours are loaded
    if (!businessOpenTime || !businessCloseTime) {
      alert("Business hours not loaded yet. Please wait or try again.");
      return;
    }

    const newDate = moment(slotInfo.start).format("YYYY-MM-DD");
    const newStartTime = moment(slotInfo.start).format("HH:mm:ss");
    const newEndTime = moment(slotInfo.end).format("HH:mm:ss");

    // [ADDED] Convert them to moment objects for easy comparison
    const openMoment = moment(businessOpenTime, "HH:mm"); // e.g. "09:00"
    const closeMoment = moment(businessCloseTime, "HH:mm"); // e.g. "17:00"
    const chosenStart = moment(newStartTime, "HH:mm:ss");
    const chosenEnd   = moment(newEndTime, "HH:mm:ss");

    // [ADDED] Check if the chosen slot is within [openMoment, closeMoment]
    if (chosenStart.isBefore(openMoment) || chosenEnd.isAfter(closeMoment)) {
      alert(
        `Invalid time. The business operates between ${businessOpenTime} and ${businessCloseTime}.`
      );
      return;
    }

    const userConfirmed = window.confirm(
      `Reschedule appointment #${appointmentId} to:\nDate: ${newDate}\nFrom: ${newStartTime} to ${newEndTime}?`
    );
    if (!userConfirmed) return;

    const url = `http://52.3.145.159:8080/api/v1/appointments/${appointmentId}`;
    const body = {
      businessId: parseInt(businessId),
      appointmentDate: newDate,
      appointmentStartTime: newStartTime,
      appointmentEndTime: newEndTime,
      appointmentRescheduled: "true",
    };

    axios
      .put(url, body)
      .then((res) => {
        console.log("Update success:", res.data);
        setSnackbarMsg("Appointment rescheduled successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Reload events
        fetchAppointments(businessId);
      })
      .catch((err) => {
        console.error("Error updating appointment:", err);
        let msg = "Failed to reschedule. ";
        if (err.response && err.response.data && err.response.data.message) {
          msg += err.response.data.message;
        }
        setSnackbarMsg(msg);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  // 5) Add eventPropGetter for custom event styling
  const eventPropGetter = (event) => {
    const backgroundColor = event.rescheduled ? "#ffcccb" : "#add8e6"; // Red for rescheduled, blue for original
    return {
      style: {
        backgroundColor,
        color: "#000",
        borderRadius: "5px",
        border: "1px solid #000",
        padding: "5px",
      },
    };
  };

  // 6) Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMsg("");
  };

  return (
    <div style={{ margin: "10px" }}>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<CalendarMonthIcon />}
          onClick={handleOpenNewAppt}
          sx={{
            backgroundColor: '#ff4d6d',
            color: 'white',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: '#ff3d5d',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }
          }}
        >
          New Appointment
        </Button>
      </Box>
      
      {appointmentId && <h2>Appointment ID to Reschedule: {appointmentId}</h2>}

      {/* Legend */}
      <Box
        display="flex"
        justifyContent="space-around"
        mb={2}
        sx={{ 
          border: "1px solid rgba(255, 77, 109, 0.2)",
          borderRadius: "8px", 
          padding: "12px",
          backgroundColor: "white"
        }}
      >
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: "16px",
              height: "16px",
              backgroundColor: "#add8e6", // Blue
              marginRight: "10px",
              borderRadius: "3px"
            }}
          ></Box>
          <Typography>Original Appointment</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: "16px",
              height: "16px",
              backgroundColor: "#ffcccb", // Red
              marginRight: "10px",
              borderRadius: "3px"
            }}
          ></Box>
          <Typography>Rescheduled Appointment</Typography>
        </Box>
      </Box>

      {/* The big calendar */}
      <Calendar
        localizer={localizer}
        events={eventsData}
        selectable
        step={60}
        timeslots={1}
        date={currentDate}
        view={currentView}
        defaultView="month"
        views={["month", "week", "day", "agenda"]}
        style={{ height: "70vh" }}
        onSelectEvent={(event) => alert(`Event clicked: ${event.title}`)}
        onSelectSlot={handleSelectSlot}
        popup
        onNavigate={(date) => setCurrentDate(date)}
        onView={(view) => setCurrentView(view)}
        eventPropGetter={eventPropGetter} // Add this prop
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReactBigCalendar;