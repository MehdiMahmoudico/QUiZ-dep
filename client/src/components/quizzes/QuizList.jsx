import React from "react";
import { Grid2, Box, Pagination } from "@mui/material";
import QuizCard from "./QuizCard";
import { useState } from "react";

const QuizList = ({ quizzes, itemsPerPage = 4, onStart , onDelete}) => {
  const [currentPage, setCurrentPage] = useState(1);
  //Calculate quizzes for current page

  const indexOfLastQuiz = currentPage * itemsPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - itemsPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  // change page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <Grid2
        container
        spacing={3}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {currentQuizzes.map((quiz) => (
          <Grid2 item xs={12} sm={6} md={4} key={quiz.id}>
            <QuizCard
              name={quiz.name}
              description={quiz.description}
              level={quiz.level}
              questionsCount={quiz.questionsCount}
              image={quiz.image}
              id={quiz._id}
              onStart={() => onStart(quiz.id)}
              onDelete={() => onDelete(quiz._id)}
            />
          </Grid2>
        ))}
      </Grid2>

      {/* Add a pagination*/}

      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          count={Math.ceil(quizzes.length / itemsPerPage)} // total of pages
          page={currentPage} // Page active
          onChange={handlePageChange} // generate change page
          color="primary"
        />
      </Box>
    </div>
  );
};

export default QuizList;
