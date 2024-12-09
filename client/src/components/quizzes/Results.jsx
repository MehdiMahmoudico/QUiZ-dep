import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupération des données du quiz depuis l'URL
  const { answers, quizData, quizDetails } = location.state;

  const [score, setScore] = useState(0);

  //const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (answers && quizData) {
      let correctAnswers = 0;
      answers.forEach((question) => {
        const userAnswer = answers[question._id];
        const correctOption = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.text);
        if (Array.isArray(userAnswer)) {
          if (
            userAnswer.every((answer) => correctOption.includes(answer)) &&
            userAnswer.length === correctOption.length
          ) {
            correctAnswers++;
          }
        } else if (correctOption.includes(userAnswer)) {
          correctAnswers++;
        }
      });

      setScore(Math.round((correctAnswers / quizData.length) * 100));
    }
  }, [answers, quizData]);

  const isSuccess = score === 100;

  const message = isSuccess
    ? "Congratulations!"
    : "Unfortunately, you lost the quiz.";
  const messageColor = isSuccess ? "green" : "red";

  return (
    <div>
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h4" sx={{ color: messageColor }}>
          {message}
        </Typography>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">
            You answered 5 out of 5 questions.
          </Typography>
          <Typography variant="h6">Time spent: 10 minutes</Typography>
          <Typography variant="h6">Your score: 100%</Typography>
        </Box>

        {/* Boutons */}
        <Box sx={{ marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/quiz")}
          >
            Retake Quiz
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginLeft: 2 }}
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
          <Button
            variant="outlined"
            sx={{ marginLeft: 2 }}
            onClick={() => navigate("/view-results")}
          >
            View Results
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Results;
