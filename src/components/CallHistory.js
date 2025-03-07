// src/components/CallHistory.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

function CallHistory({ businessId }) {
  const [callLogs, setCallLogs] = useState([]);

  useEffect(() => {
    if (!businessId) return;

    axios
      .get(`http://52.3.145.159:8080/api/v1/call-logs/business/${businessId}`)
      .then((res) => setCallLogs(res.data))
      .catch((err) => {
        console.error("Error fetching call logs:", err);
      });
  }, [businessId]);

  return (
    // 1) FIXED HEIGHT + FLEX COLUMN so the heading remains visible
    <Paper
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        flexDirection: "column",
        height: 800,
        border: "1px solid rgba(255, 77, 109, 0.2)", // Light pink border
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Subtle shadow
        "&:hover": {
          borderColor: "rgba(255, 77, 109, 0.3)", // Slightly darker pink on hover
          transition: "border-color 0.3s ease",
        },
      }}
    >

      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Call History
      </Typography>

      {/* 2) TableContainer that can scroll */}
      <TableContainer
        sx={{
          flex: 1,            // takes the remaining space
          overflowY: "auto",  // scroll vertically if too many rows
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Phone Number</strong></TableCell>
              <TableCell><strong>Called At</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {callLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.clientPhoneNumber}</TableCell>
                <TableCell>{new Date(log.calledAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default CallHistory;
