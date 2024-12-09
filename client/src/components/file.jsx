import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const AddQuestions = ({ quizId, token }) => {
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctOption: "" },
  ]);
  const [message, setMessage] = useState("");

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctOption = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctOption: "" }]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/quiz/${quizId}/questions`,
        { questions },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Questions added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add questions. Please try again.");
    }
  };

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Questions to Quiz
      </Typography>

      {questions.map((question, qIndex) => (
        <Box key={qIndex} sx={{ marginBottom: 3 }}>
          <TextField
            label={`Question ${qIndex + 1}`}
            value={question.text}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            fullWidth
            margin="normal"
          />
          <Typography variant="subtitle1">Options:</Typography>
          {question.options.map((option, optIndex) => (
            <TextField
              key={optIndex}
              label={`Option ${optIndex + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
              fullWidth
              margin="normal"
            />
          ))}
          <TextField
            label="Correct Option"
            value={question.correctOption}
            onChange={(e) => handleCorrectOptionChange(qIndex, e.target.value)}
            fullWidth
            margin="normal"
            helperText="Enter the correct option text"
          />
          <IconButton onClick={() => removeQuestion(qIndex)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineIcon />}
        onClick={addQuestion}
        sx={{ marginBottom: 2 }}
      >
        Add Another Question
      </Button>

      <Button variant="contained" onClick={handleSubmit} fullWidth>
        Submit Questions
      </Button>

      {message && (
        <Typography
          variant="body1"
          color={message.includes("successfully") ? "green" : "error"}
          sx={{ marginTop: 2 }}
        >
          {message}
        </Typography>
      )}
    </Paper>
  );
};

export default AddQuestions;
