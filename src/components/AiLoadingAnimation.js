// src/components/AiLoadingAnimation.js

import React from "react";
import { motion } from "framer-motion";
import { CircularProgress, Typography, Box } from "@mui/material";



const AiLoadingAnimation = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* <CircularProgress sx={{ color: "#ff4d6d" }} size={70} /> */}
        <l-reuleaux
  size="100"
  stroke="8"
  stroke-length="0.2"
  bg-opacity="0.1"
  speed="1.2"
  color="blue"
/>

      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Typography sx={{ mt: 2, color: "#ff4d6d", fontWeight: 600 }}>
          AI is analyzing your data...
        </Typography>
      </motion.div>
    </Box>
  );
};

export default AiLoadingAnimation;
