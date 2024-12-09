import React from "react";
import { Box, Typography } from "@mui/material";
import QuizList from "../components/quizzes/QuizList"; //

import { useState, useEffect } from "react";
import axiosInstance from "./config/axiosApi";

const Main = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  useEffect(() => {
    // Simulate data from Json server
    axiosInstance
      .get("api/quiz")
      .then((response) => setQuizzes(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleStartQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    console.log(`Quiz ${quizId} started`);
  };

  const handleDeleteQuiz = (quizId) => {
    axiosInstance
      .delete(`api/quiz/${quizId}`)
      .then(() => {
        // Update the quizzes state to exclude the deleted quiz
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
      })
      .catch((error) => {
        console.error("Error deleting quiz:", error);
      });
  };
  
  return (
    <div>
      <Box sx={{ padding: "20px", margin: "25px" }}>
        <Typography
          variant="h4"
          color="primary"
          sx={{ fontWeight: "bold", marginBottom: "25px", padding: "15px" }}
        >
          Choose a Quiz from the list below and Enjoy!
        </Typography>

        <QuizList quizzes={quizzes} onStart={handleStartQuiz} onDelete ={handleDeleteQuiz}  />
        
      </Box>
    </div>
  );
};

export default Main;
