import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "Beginner",
    questionsCount: 1,
  });
  const [image, setImage] = useState(null);
  const [quizId, setQuizId] = useState(null); // To store created quiz ID
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([]); // Questions array
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    type: "Multiple",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = new FormData();
    quizData.append("name", formData.name);
    quizData.append("description", formData.description);
    quizData.append("level", formData.level);
    quizData.append("questionsCount", formData.questionsCount);
    if (image) quizData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/quiz",
        quizData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Quiz created successfully:", response.data);
      setQuizId(response.data.Quiz._id);
      setMessage("Quiz created successfully! Add questions now.");
    } catch (err) {
      console.error("Error creating quiz:", err);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index][field] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: "", isCorrect: false }],
    });
  };

  const removeOption = (index) => {
    const updatedOptions = currentQuestion.options.filter(
      (_, i) => i !== index
    );
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const addQuestion = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/quiz/${quizId}/questions`,
        {
          quizId,
          ...currentQuestion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions([...questions, response.data]);
      setCurrentQuestion({
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        type: "Multiple",
      });
      setMessage("Question added successfully!");
    } catch (err) {
      console.error("Error adding question:", err);
      setMessage(
        "An error occurred while adding the question. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 2,
        marginTop: "70px",
      }}
    >
      <Paper sx={{ padding: 3, width: "100%", maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          Create Quiz
        </Typography>

        {/* Quiz Creation Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Quiz Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Level</InputLabel>
            <Select name="level" value={formData.level} onChange={handleChange}>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Number of Questions"
            name="questionsCount"
            type="number"
            value={formData.questionsCount}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            type="file"
            onChange={handleImageChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Create Quiz
          </Button>
        </form>

        {quizId && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Add Questions
            </Typography>

            {/* Add Question Form */}
            <TextField
              label="Question Text"
              name="question"
              value={currentQuestion.question}
              onChange={handleQuestionChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={currentQuestion.type}
                onChange={handleQuestionChange}
              >
                <MenuItem value="Multiple">Multiple</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
              </Select>
            </FormControl>

            {currentQuestion.options.map((option, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TextField
                  label={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(index, "text", e.target.value)
                  }
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(index, "isCorrect", e.target.checked)
                      }
                    />
                  }
                  label="Correct"
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeOption(index)}
                  disabled={currentQuestion.options.length <= 2}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button
              onClick={addOption}
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Option
            </Button>
            {formData.questionsCount > questions.length ? (
              <Button
                onClick={addQuestion}
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Add Question
              </Button>
            ) : (
              navigate("/main")
            )}
          </>
        )}

        {message && (
          <Typography color="primary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CreateQuiz;
