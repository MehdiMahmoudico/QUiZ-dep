import React, { useContext, useEffect, useState } from "react";
import { getLevelColor } from "../config/Utils";
import { Card, CardContent, Typography, CardMedia, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosApi";
import { AuthContext } from "../context/AuthContext";
import axios from "../../api/axios";

const QuizCard = ({ name, description, level, questionsCount, image, id,onDelete }) => {
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const { role} = useContext(AuthContext);
    useEffect(() => {
        if (id) {
            axiosInstance
                .get(`api/quiz/${id}`)
                .then((response) => {
                    setTotal(response.data.questionsCount);
                })
                .catch((err) => {
                    console.error("Error fetching quiz:", err);
                });
        } else {
            console.error("id is undefined");
        }
    }, [id]);

    const handleStart = () => {
      console.log(total); // get total number of questions from questionsCount prop
        navigate(`/start-quiz/${id}`, {
            state: { totalQuestion: total },
            
        });
    };
    const handleDelete = () => {
        if (role !== 'admin') {
          return;
        }
      
        axiosInstance
          .delete(`api/quiz/${id}`)
          .then(() => {
            onDelete(id); // Call the onDelete callback to update the quizzes in the parent
          })
          .catch((error) => {
            console.error("Error deleting quiz:", error);
          });
      };
      

    return (
        <Card
            sx={{
                maxWidth: 345,
                margin: "20px auto",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "scale(1.05)", boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" },
            }}
        >
            <CardMedia
                component="img"
                height="140"
                image={`http://107.22.157.99/${image}`}
                alt={name}
                sx={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
            />
            <CardContent>
                <Typography variant="h5" component="div" color="primary" sx={{ fontWeight: "bold" }}>
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: "10px" }}>
                    {description}
                </Typography>
                <Box sx={{ marginTop: "10px", display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: "bold", color: getLevelColor(level), marginBottom: "10px" }}>
                        {level}
                    </Typography>
                    <Typography>Questions: {questionsCount}</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: "20px" }}
                    onClick={handleStart}
                >
                    Start Quiz
                </Button>
                {role === 'admin' && (
                    <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: "20px" }}
                      onClick={() => handleDelete(id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </Button>
                    
                  )}
            </CardContent>
        </Card>
    );
};

export default QuizCard;
