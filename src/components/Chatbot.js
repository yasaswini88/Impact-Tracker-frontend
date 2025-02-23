
// src/components/Chatbot.js

import React, { useState } from "react";
import {
    Drawer,
    Box,
    Paper,
    Button,
    TextField,
    Typography,
    Avatar,
    Fab,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

/**
 * Props we expect:
 * - showChatbot (boolean)
 * - toggleChatbot (function)
 * - chatMessages (array)
 * - setChatMessages (function)
 * - chatInput (string)
 * - setChatInput (function)
 * - handleChatSubmit (function)
 * - handleYesClick (function)
 * - handleNoClick (function)
 * - reviewConfirmation (object)
 * - reviewInsights (object)
 */
const Chatbot = ({
    showChatbot,
    toggleChatbot,
    chatMessages,
    chatInput,
    setChatInput,
    handleChatSubmit,
    handleYesClick,
    handleNoClick,
    reviewConfirmation,
    reviewInsights,
    handleCallCampaignNo,
    handleCallCampaignYes,
    callCampaignStrategies
}) => {

    const [expandedStrategyId, setExpandedStrategyId] = useState(null);


    return (
        <>
            {/* Floating Action Button (the Chatbot icon) */}
            <Fab
                color="primary"
                aria-label="chat"
                onClick={toggleChatbot}
                sx={{
                    position: "fixed",
                    bottom: 35,
                    right: 35,
                    width: 80,
                    height: 80,
                    backgroundColor: "transparent",
                    boxShadow: 3,
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                }}
            >


                <Avatar
                    alt="Chatbot"
                    src="https://www.shutterstock.com/image-vector/chat-bot-logo-design-concept-600nw-2478937557.jpg"
                    sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "16px",
                    }}
                />
            </Fab>

            {/* The Drawer for Chat UI */}
            <Drawer
                anchor="right"
                open={showChatbot}
                onClose={toggleChatbot}
                PaperProps={{
                    sx: {
                        width: 480,
                        bgcolor: "background.default",
                    },
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            borderBottom: 1,
                            borderColor: "divider",
                            backgroundColor: "#ff4d6d",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <ChatIcon sx={{ color: "white" }} />
                        <Typography variant="h6" sx={{ color: "white", fontWeight: "medium" }}>
                            AI Assistant
                        </Typography>
                    </Box>

                    {/* Messages Area */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            p: 2,
                            bgcolor: "#f5f5f5",
                        }}
                    >
                        {chatMessages.map((message, index) => (
                            <Box key={index}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            message.sender === "user" ? "flex-end" : "flex-start",
                                        mb: message.text.includes("Negative Review Alert") ? 1 : 2,
                                    }}
                                >
                                    {message.text.includes("Do you want some call campaign suggestions?") && (
                                        <Box sx={{ display: "flex", gap: 1, ml: 2, mb: 2 }}>
                                            <Button variant="outlined" onClick={handleCallCampaignNo}>
                                                NO
                                            </Button>
                                            <Button variant="contained" onClick={handleCallCampaignYes}>
                                                YES
                                            </Button>
                                        </Box>
                                    )}
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            maxWidth: "75%",
                                            backgroundColor:
                                                message.sender === "user" ? "#ff4d6d" : "white",
                                            borderRadius:
                                                message.sender === "user"
                                                    ? "20px 20px 4px 20px"
                                                    : "20px 20px 20px 4px",
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                whiteSpace: "pre-line",   // allows \n to create new lines
                                                color: message.sender === "user" ? "white" : "text.primary",
                                            }}
                                        >
                                            {message.text}
                                        </Typography>

                                    </Paper>
                                </Box>

                                {message.text.includes("Negative Review Alert") && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            gap: 1,
                                            ml: 2,
                                            mb: 2,
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            onClick={handleNoClick}
                                            size="small"
                                            sx={{
                                                borderColor: "#ff4d6d",
                                                color: "#ff4d6d",
                                                "&:hover": {
                                                    borderColor: "#ff1a43",
                                                    backgroundColor: "rgba(255, 77, 109, 0.04)",
                                                },
                                            }}
                                        >
                                            NO
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleYesClick}
                                            size="small"
                                            sx={{
                                                backgroundColor: "#ff4d6d",
                                                "&:hover": {
                                                    backgroundColor: "#ff1a43",
                                                },
                                            }}
                                        >
                                            YES
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ))}



                        {/* {reviewConfirmation?.userResponse === "Y" && reviewInsights && (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    backgroundColor: "white",
                                    borderRadius: 2,
                                    boxShadow: 1,
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                    Review Insights
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <strong>Positive Points:</strong> {reviewInsights.positivePoints}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <strong>Negative Points:</strong> {reviewInsights.negativePoints}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <strong>Overall Summary:</strong> {reviewInsights.insights}
                                </Typography>
                            </Box>
                        )} */}

                        {/* 
  If we have callCampaignStrategies in props, let's show them. 
  We only expect 1 if you filtered, but let's map anyway.
*/}
                        {callCampaignStrategies.map((strategy) => (
                            <Box
                                key={strategy.id}
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    backgroundColor: "white",
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    mb: 2
                                }}
                            >
                                {/* Strategy name (click to expand/collapse) */}
                                <Typography
                                    variant="h6"
                                    sx={{ cursor: "pointer", color: "#ff4d6d", fontWeight: "bold" }}
                                    onClick={() => {
                                        // If already expanded, collapse. Otherwise expand.
                                        setExpandedStrategyId(
                                            expandedStrategyId === strategy.id ? null : strategy.id
                                        );
                                    }}
                                >
                                    {strategy.strategyName}
                                </Typography>

                                {/* Show the description only if expandedStrategyId === this strategy’s id */}
                                {expandedStrategyId === strategy.id && (
                                    <Box
                                        sx={{
                                            mt: 1,
                                            p: 1,
                                            border: "1px solid #ccc",
                                            borderRadius: 1,
                                            backgroundColor: "#fafafa"
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {strategy.description}
                                        </Typography>
                                        <Button
                                            variant="text"
                                            sx={{ mt: 1, color: "#ff4d6d" }}
                                            onClick={() => setExpandedStrategyId(null)}
                                        >
                                            Close
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ))}

                    </Box>

                    {/* Input Area */}
                    <Box
                        sx={{
                            p: 2,
                            borderTop: 1,
                            borderColor: "divider",
                            backgroundColor: "background.paper",
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Type your message..."
                            variant="outlined"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                },
                            }}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 2,
                            }}
                        >
                            <Button
                                onClick={toggleChatbot}
                                variant="outlined"
                                sx={{
                                    borderColor: "#ff4d6d",
                                    color: "#ff4d6d",
                                    "&:hover": {
                                        borderColor: "#ff1a43",
                                        backgroundColor: "rgba(255, 77, 109, 0.04)",
                                    },
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleChatSubmit}
                                sx={{
                                    backgroundColor: "#ff4d6d",
                                    "&:hover": {
                                        backgroundColor: "#ff1a43",
                                    },
                                }}
                            >
                                Send
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default Chatbot;
