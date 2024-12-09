import React from "react";
import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import TimerIcon from "@mui/icons-material/Timer";
import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosApi";
import QuizTimer from "./QuizTimer";
//import quizData from "../quizData.json";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const StartQuiz = () => {
  const { id } = useParams();

  const [quizData, setQuizData] = useState([]);
  const [quizDetails, setQuizDetails] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [viewResult, setViewResult] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(null);
  //const [totalTime, setTotalTime] = useState([]);
  const [resultsSaved, setResultsSaved] = useState(false);
  useEffect(() => {
    axiosInstance
      .get(`api/quiz/${id}/questions`)

      .then((response) => {
        console.log(response.data);
        setQuizData(response.data);

        return axiosInstance.get(`api/quiz/${id}`);
      })
      .then((response) => {
        console.log(response.data.questionsCount);
        setQuizDetails(response.data);
        setTotalQuestions(response.data.questionsCount);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    if (quizData.length > 0) {
      // setTotalQuestions(quizDetails.numberOfQ);
      //setTotalTime(timePerQuestion * quizData.length);
    }
  }, [quizData]);

  const navigate = useNavigate();
  const currentQuestion = quizData[currentQuestionIndex];

  if (!quizData.length) {
    return <div>Loading quiz...</div>;
  }

  const handleOptionChange = (value, checked) => {
    const updatedAnswers = { ...answers };
    if (currentQuestion.type === "Single") {
    updatedAnswers[currentQuestion._id] = [value];
    
    } else {
      const currentAnswers = new Set(updatedAnswers[currentQuestion._id] || []);
      if (checked) {
        currentAnswers.add(value);
      } else {
        currentAnswers.delete(value);
      }
      updatedAnswers[currentQuestion._id] = [...currentAnswers];
    }
    setAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    let correctAnswers = 0; // Initialize correct answer count
    const pointsPerAnswer = 10; // Each answer is worth 10 points

    quizData.forEach((question) => {
      const userAnswers = answers[question._id] || []; // Get the user's answers for the current question

      // For Single Choic choice questions
      if (question.type === "Single") {
        const selectedOption = question.options.find(
          (option) => option.text === userAnswers[0]
        );
        if (selectedOption && selectedOption.isCorrect) {
          correctAnswers++; // Increment correct answers count
        }
      } else {
        // For multiple choice questions (if applicable)
        const correctAnswersSet = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.text);
        const userAnswersSet = new Set(userAnswers);

        if (
          correctAnswersSet.length === userAnswersSet.size &&
          correctAnswersSet.every((answer) => userAnswersSet.has(answer))
        ) {
          correctAnswers++; // Increment correct answers count
        }
      }
    });

    // Set the total score (number of correct answers * points per answer)
    const totalScore = correctAnswers * pointsPerAnswer;
    setScore(totalScore); // Update the score state with the total score
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
      calculateScore(quizData);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetQuiz = () => {
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
    //setTimeLeft(quizData.length * timePerQuestion);
  };

  // timeUp
  const handleTimeUp = () => {
    setQuizFinished(true); // Marque le quiz comme terminé
    calculateScore(); // Calcule le score final
  };

  const saveresults = ()=>{
    const dataform= {
      userId: localStorage.getItem('userId'),
      quizId: id,
      score: score,
      totalQuestions: totalQuestions,
      answeredQuestions: quizData.length,
    }
    console.log(dataform);
    axios.post("/api/quiz-results", dataform)
    .then(response => {
      console.log(response.data);
      setResultsSaved(true); // Set resultsSaved to true after saving results
    })
    
  }

  const isSuccess = score === quizData.length * 10;

  const message = isSuccess
    ? "Congratulations!"
    : "Unfortunately, you lost the quiz.";
  const messageColor = isSuccess ? "green" : "red";
  console.log(currentQuestion.type);
  return (
    <div>
      {!quizFinished ? (
        <>
          <Box
            sx={{
              maxWidth: 800,
              margin: "auto",
              padding: 3,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              textAlign: "center",
            }}
          >
            {/* Top*/}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                paddingBottom: 2,
              }}
            >
              {/* Quiz Icon and Title */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <QuizIcon sx={{ fontSize: 60, color: "blue" }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {quizDetails.name} Quiz
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Quiz of {quizData.length} Questions
                  </Typography>
                </Box>
              </Box>
              {/* Timer Icon */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <QuizTimer total={totalQuestions} onTimeUp={handleTimeUp} />
              </Box>
            </Box>
            {/* Question*/}
            <Box>
              {/* Question Number */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "blue",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "white",
                  }}
                >
                  {currentQuestionIndex + 1}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ textAlign: "left", flex: 1 }}>
                    {currentQuestion?.question}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "right",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    - {currentQuestionIndex + 1} of {quizData.length} -
                  </Typography>
                </Box>
              </Box>

              {/* Choices */}

              {currentQuestion.options.map((option, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    padding: 2,
                    marginBottom: 2,
                    textAlign: "left",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "#f9f9f9",
                      borderColor: "#blue",
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      currentQuestion.type === "Single" ? (
                        <Radio
                          checked={
                            answers[currentQuestion._id]?.[0] === option.text ||
                            false
                          }
                          onChange={() => handleOptionChange(option.text, true)}
                        />
                      ) : (
                        <Checkbox
                          checked={
                            answers[currentQuestion._id]?.includes(
                              option.text
                            ) || false
                          }
                          onChange={(e) =>
                            handleOptionChange(option.text, e.target.checked)
                          }
                        />
                      )
                    }
                    label={option.text}
                  />
                </Box>
              ))}
            </Box>

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                marginTop: 4,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "blue",
                  "&:hover": {
                    backgroundColor: "darkblue",
                  },
                }}
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "blue",
                  "&:hover": {
                    backgroundColor: "darkblue",
                  },
                }}
                onClick={handleNext}
              >
                Next
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <>
          {/* Result*/}
          <Box sx={{ padding: 4, textAlign: "center" }}>
            <Typography variant="h4" sx={{ color: messageColor }}>
              {message}
            </Typography>

            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You answered {score / 10} out of {quizData.length} questions
                correctly.
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Your score: {score} / {quizData.length * 10} (
                {(score / (quizData.length * 10)) * 100}%)
              </Typography>
            </Box>

            {viewResult && (
  <Box sx={{ marginTop: 4 }}>
    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
      Quiz Summary
    </Typography>

    {quizData.map((question) => {
      const userAnswers = answers[question._id] || [];
      const correctAnswers = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.text);
      const isCorrect =
        correctAnswers.length === userAnswers.length &&
        correctAnswers.every((answer) => userAnswers.includes(answer));

      return (
        <Box key={question.id} sx={{ marginBottom: 2 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              color: isCorrect ? "green" : "red",
            }}
          >
            {question.question}
          </Typography>
          <Typography variant="body2">
            Your Answer : {userAnswers.join(", ")}{" "}
            {isCorrect ? "(Correct)" : "(Incorrect)"}
          </Typography>
          {!isCorrect && (
            <Typography variant="body2" sx={{ color: "red" }}>
              Correct Answer : {correctAnswers.join(", ")}
            </Typography>
          )}
        </Box>
      );
    })}
    {!resultsSaved && (
      <Button variant="contained" color="primary" onClick={saveresults}>
        Save Results!
      </Button>
    )}
  </Box>
)}
            {/* Boutons */}
            <Box sx={{ marginTop: 4 }}>
              <Button variant="contained" color="primary" onClick={resetQuiz}>
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
                onClick={() => setViewResult(!viewResult)}
              >
                {viewResult ? "Hide Results" : "View Results"}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default StartQuiz;