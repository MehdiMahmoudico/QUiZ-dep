import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const UpdateQuiz = () => {
  const { id } = useParams(); // Get the quiz ID from the URL
  console.log("Quiz ID:", id);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "Beginner",
    questionsCount: 1,
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  useEffect(() => {
    // Fetch existing quiz data

    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/quiz/${id}`);
        const quiz = response.data;
        setFormData({
          name: quiz.name,
          description: quiz.description,
          level: quiz.level,
          questionsCount: quiz.questionsCount,
        });
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setMessage("Failed to load quiz details.");
      }
    };

    fetchQuizData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append("name", formData.name);
    formDataWithImage.append("description", formData.description);
    formDataWithImage.append("level", formData.level);
    formDataWithImage.append("questionsCount", formData.questionsCount);

    if (image) {
      formDataWithImage.append("image", image);
    }

    try {
      await axios.patch(`http://localhost:8000/api/quiz/${id}`, formDataWithImage,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Quiz updated successfully!");
      setErrors({});
      setSuccessMessage("Quiz updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage("An error occurred. Please try again.");
      }
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
      }}
    >
      <Paper sx={{ padding: 3, width: "100%", maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom textAlign={"center"}>
          Update Quiz
        </Typography>

        {message && (
          <Typography color="error" sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <InputLabel htmlFor="custom-input">Quiz Name :</InputLabel>
          <TextField
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="text"
          />
          {errors.name && <Typography color="error">{errors.name.message}</Typography>}

          <InputLabel htmlFor="custom-input">Description :</InputLabel>
          <TextField
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          {errors.description && <Typography color="error">{errors.description.message}</Typography>}

          <InputLabel htmlFor="custom-input">Level :</InputLabel>
          <FormControl fullWidth>
            <Select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          {errors.level && <Typography color="error">{errors.level.message}</Typography>}

          <InputLabel htmlFor="custom-input">Number of Questions :</InputLabel>
          <TextField
            name="questionsCount"
            value={formData.questionsCount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          {errors.questionsCount && (
            <Typography color="error">{errors.questionsCount.message}</Typography>
          )}

          <InputLabel htmlFor="custom-input">Quiz Image :</InputLabel>
          <TextField
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
          />
          {errors.image && <Typography color="error">{errors.image.message}</Typography>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Update Quiz
          </Button>
        </form>

        {successMessage && (
          <Typography variant="body1" color="green" sx={{ mt: 2, textAlign: "center" }}>
            {successMessage}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateQuiz;
