import React, { useState, useEffect } from "react";
import {
    DataGrid,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import { Container, Typography, CircularProgress, Alert, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch quizzes from the backend
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/quiz");
                setQuizzes(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch quizzes");
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    // Handle Delete
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) {
            console.error("Token is undefined. Ensure the user is logged in.");
            return;
        }
    
        try {
            await axios.delete(`http://localhost:8000/api/quiz/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            // Update the local state
            setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };
    

    // Handle Edit
    const handleEdit = async (id) => {
       
    };

    // DataGrid column definitions
    const columns = [
        { field: "id", headerName: "id", width: 150 },
        { field: "name", headerName: "Name", width: 150 },
        {
            field: "level",
            headerName: "Level",
            width: 150
        },
        {
            field: "questionsCount",
            headerName: "questionsCount",
            width: 150
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 400,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Button variant="outlined">Edit</Button>}
                    label="Edit"
                    component={Link}
                    to={`/edit-quiz/${params.row.id}`}
                />,
                <GridActionsCellItem
                icon={<Button variant="outlined">Edit questions</Button>}
                label="Edit"
                component={Link}
                to={`/edit-question/${params.row.id}`}
            />,
                <GridActionsCellItem
                    icon={<Button variant="outlined" color="error">Delete</Button>}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}
                />,
            ],
        }
    ];

    // Map quizzes to DataGrid rows
    const rows = quizzes.map((quiz) => ({
        id: quiz._id,
        name: quiz.name,
        level: quiz.level,
        questionsCount: quiz.questionsCount
    }));

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Quiz Table
            </Typography>

            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={Link}
                to="/add-quiz"
            >
                Add Quiz
            </Button>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
                </div>
            )}
        </Container>
    );
};

export default Dashboard;
