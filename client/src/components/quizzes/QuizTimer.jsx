import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import { useLocation } from "react-router-dom";

const QuizTimer = ({ total, onTimeUp }) => {
  const location = useLocation();
  const { totalQuestion } = location.state || {};

  const [timeLeft, setTimeLeft] = useState(total * 15 || totalQuestion * 15);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const timerColor = timeLeft <= 5 ? "red" : "green";
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TimerIcon
        sx={{ fontSize: 32, color: timeLeft <= 5 ? "red" : "green" }}
      />

      <Typography
        variant="h6"
        sx={{
          color: timerColor,
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        {timeLeft}s
      </Typography>
    </Box>
  );
};

export default QuizTimer;