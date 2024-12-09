import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EditQuizQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    type: "Multiple",
  });
  const [message, setMessage] = useState("");

  // Fetch questions for the specific quiz
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/quiz/${quizId}/questions`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching quiz questions", error);
      }
    };

    fetchQuizQuestions();
  }, [quizId, token]);

  // Handle delete question
  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/quiz/${quizId}/questions/${questionId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Remove the deleted question from the state
      setQuestions(questions.filter(q => q._id !== questionId));
    } catch (error) {
      console.error("Error deleting question", error);
    }
  };

  // Start editing a question
  const startEditingQuestion = (question) => {
    setEditingQuestion({ ...question });
  };

  // Handle question change during editing
  const handleQuestionChange = (e) => {
    setEditingQuestion({
      ...editingQuestion,
      [e.target.name]: e.target.value
    });
  };

  // Handle option change during editing
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...editingQuestion.options];
    updatedOptions[index][field] = value;
    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions
    });
  };

  // Add a new option
  const addOption = () => {
    setEditingQuestion({
      ...editingQuestion,
      options: [...editingQuestion.options, { text: "", isCorrect: false }]
    });
  };

  // Remove an option
  const removeOption = (index) => {
    const updatedOptions = editingQuestion.options.filter(
      (_, i) => i !== index
    );
    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions
    });
  };

  // Save edited question
  const saveEditedQuestion = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/quiz/${quizId}/questions/${editingQuestion._id}`,
        editingQuestion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the questions list
      setQuestions(questions.map(q =>
        q._id === editingQuestion._id ? editingQuestion : q
      ));

      // Clear editing state
      setEditingQuestion(null);
    } catch (error) {
      console.error("Error updating question", error);
    }
  };

  // Handle question change during adding
  const handleAddQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  // Handle option change during adding
  const handleAddOptionChange = (index, field, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index][field] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  // Add a new option during adding
  const addAddOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: "", isCorrect: false }],
    });
  };

  // Remove an option during adding
  const removeAddOption = (index) => {
    const updatedOptions = currentQuestion.options.filter(
      (_, i) => i !== index
    );
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  // Add question
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
      setAddingQuestion(false);
    } catch (err) {
      console.error("Error adding question:", err);
      setMessage(
        "An error occurred while adding the question. Please try again."
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Quiz Questions
      </Typography>

      {questions.length === 0 ? (
        <Typography variant="body1">No questions found for this quiz.</Typography>
      ) : (
        <Grid container spacing={3}>
          {questions.map((question) => (
            <Grid item xs={12} key={question._id}>
              {editingQuestion && editingQuestion._id === question._id ? (
                // Editing Form
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Edit Question
                  </Typography>
                  
                  <TextField
                    label="Question Text"
                    name="question"
                    value={editingQuestion.question}
                    onChange={handleQuestionChange}
                    fullWidth
                    margin="normal"
                  />

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select
                      name="type"
                      value={editingQuestion.type}
                      onChange={handleQuestionChange}
                    >
                      <MenuItem value="Multiple">Multiple</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                    </Select>
                  </FormControl>

                  {editingQuestion.options.map((option, index) => (
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
                        disabled={editingQuestion.options.length <= 2}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      onClick={addOption}
                      variant="contained"
                      color="secondary"
                    >
                      Add Option
                    </Button>
                    <Box>
                      <Button
                        onClick={() => setEditingQuestion(null)}
                        variant="outlined"
                        sx={{ mr: 2 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveEditedQuestion}
                        variant="contained"
                        color="primary"
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ) : (
                // Question Display
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        {question.question}
                      </Typography>
                      <Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={() => startEditingQuestion(question)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteQuestion(question._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Type: {question.type}
                    </Typography>
                    
                    {question.options && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Options:</Typography>
                        {question.options.map((option, optIndex) => (
                          <Box 
                            key={optIndex} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              bgcolor: option.isCorrect ? 'success.light' : 'transparent',
                              p: 1,
                              borderRadius: 1,
                              mb: 0.5
                            }}
                          >
                            <Typography variant="body2">
                              {option.text} 
                              {option.isCorrect && " (Correct)"}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setAddingQuestion(true)}
        >
          Add New Question
        </Button>
      </Box>

      {addingQuestion && (
        <Paper sx={{ padding: 3, width: "100%", maxWidth: 600, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add Question
          </Typography>

          <TextField
            label="Question Text"
            name="question"
            value={currentQuestion.question}
            onChange={handleAddQuestionChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={currentQuestion.type}
              onChange={handleAddQuestionChange}
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
                  handleAddOptionChange(index, "text", e.target.value)
                }
                fullWidth
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={option.isCorrect}
                    onChange={(e) =>
                      handleAddOptionChange(index, "isCorrect", e.target.checked)
                    }
                  />
                }
                label="Correct"
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeAddOption(index)}
                disabled={currentQuestion.options.length <= 2}
              >
                Remove
              </Button>
            </Box>
          ))}
          <Button
            onClick={addAddOption}
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Option
          </Button>
          <Button
            onClick={addQuestion}
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Question
          </Button>
          <Button
            onClick={() => setAddingQuestion(false)}
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Paper>
      )}

      {message && (
        <Typography color="primary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default EditQuizQuestions;