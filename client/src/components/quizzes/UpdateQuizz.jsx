import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';

const UpdateQuizz = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "Beginner",
    questionsCount: 1,
  });
  const { id } = useParams()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [level, setLevel] = useState("")
  const [questionsCount, setQuestionsCount] = useState(0)
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/quiz/${id}`)
      .then(res => {
        console.log(res.data)
        setName(res.data.name);
        setDescription(res.data.description);
        setQuestionsCount(res.data.questionsCount);

      })
      .catch(err => {
        console.log(err)
      })
  }, [id])


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  }

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
      const response = await axios.patch(`http://localhost:8000/api/quiz/${id}`, formDataWithImage, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Quiz created successfully!");
      setErrors({});
      setFormData({ name: "", description: "", level: "Beginner", questionsCount: 1 });
      setImage(null);
      setSuccessMessage('Form submitted successfully!');

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 2,
      }}
    >
      <Paper sx={{ padding: 3, width: '100%', maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom textAlign={"center"}>
          Update Quiz
        </Typography>

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
          <Typography> {errors.name && <p className="error-message">{errors.name.message}</p>}
          </Typography>
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
          <Typography>{errors.description && <p className="error-message">{errors.description.message}</p>}</Typography>
          <InputLabel htmlFor="custom-input">Level :</InputLabel>
          <FormControl fullWidth>
            <InputLabel id="simple-select-label">Choose an Option</InputLabel>
            <Select
              labelId="simple-select-label"
              value={selectedValue}
              onChange={handleSelectChange}
              label="Choose an Option"
              variant="outlined"
            >
              <MenuItem value={"Beginner"}>Beginner</MenuItem>
              <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
              <MenuItem value={"Advanced"}>Advanced</MenuItem>
            </Select>
          </FormControl>
          <Typography>
            {errors.level && <p className="error-message">{errors.level.message}</p>}
          </Typography>
          <InputLabel htmlFor="custom-input">Number of questions :</InputLabel>
          <TextField
            name="questionsCount"
            value={formData.questionsCount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <Typography>
            {errors.questionsCount && <p className="error-message">{errors.questionsCount.message}</p>}
          </Typography>
          <InputLabel htmlFor="custom-input">Quiz Image :</InputLabel>
          <TextField
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
          />
          <Typography>
            {errors.image && <p className="error-message">{errors.image.message}</p>}
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Quiz
          </Button>
        </form>

        {successMessage && (
          <Typography
            variant="body1"
            color="green"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            {successMessage}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default UpdateQuizz