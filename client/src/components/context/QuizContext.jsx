import { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});

  // save the answers
  const saveAnswer = (questionId, userAnswers) => {
    setAnswers((prev) => ({ ...prev, [questionId]: userAnswers }));
  };

  // reset the answers
  const resetAnswers = () => {
    setAnswers({});
  };

  // reset the score
  const resetScore = () => {
    setScore(0);
  };

  // calculate the score
  const calculateScore = (quizData) => {
    let scoreTotal = 0;
    quizData.forEach((question) => {
      // bonnes réponses
      const correctAnswer = question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.text);

      // réponses de l'utilisateur
      const userAnswers = answers[question.id] || [];

      // vérifier si les longueurs sont identiques et si toutes les réponses de l'utilisateur sont correctes
      if (
        userAnswers.length === correctAnswer.length &&
        userAnswers.every((answer) => correctAnswer.includes(answer))
      ) {
        scoreTotal++;
      }
    });

    setScore(Math.round((scoreTotal / quizData.length) * 100));
  };

  return (
    <QuizContext.Provider
      value={{
        answers,
        saveAnswer,
        score,
        calculateScore,
        resetAnswers,
        resetScore,
        setScore,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
