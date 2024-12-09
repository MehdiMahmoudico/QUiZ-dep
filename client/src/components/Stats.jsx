import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";

const Stats = () => {
  const { token } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }
        console.log(`Fetching results for userId: ${userId}`);
        const response = await axios.get(
          `http://localhost:8000/api/quiz-results/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log('Response:', response.data);
        setResults(response.data);
      } catch (err) {
        console.error("Error fetching quiz results:", err);
        setError("Error fetching quiz results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  const handleDelete = async (resultId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/quiz-results/user/${resultId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResults(results.filter(result => result._id !== resultId));
    } catch (err) {
      console.error("Error deleting quiz result:", err);
      setError("Error deleting quiz result");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Quiz Results
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <List>
          {results.map((result) => (
            <ListItem key={result._id} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(result._id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText
                primary={`Quiz: ${result.quizName}`}
                secondary={`Score: ${result.score} / ${result.totalQuestions * 10}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Stats;