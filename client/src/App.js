import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import React, { useContext } from "react";
import Login from "./components/Login";
import { AuthProvider, AuthContext } from "./components/context/AuthContext";
import Register from "./components/Register";
import Stats from "./components/Stats";
import QuizList from "./components/quizzes/QuizList";
import Main from "./components/Main";
import StartQuiz from "./components/quizzes/StartQuiz";
import { QuizProvider } from "./components/context/QuizContext";
import Results from "./components/quizzes/Results";
import CreateQuizz from "./components/admin/CreateQuiz";
import UpdateQuizz from "./components/admin/UpdateQuiz";
import Dashboard from "./components/admin/Dashboard";
import ProtectedRoute from "./components/context/ProtectedRoute";
import Adminroute from "./components/context/Adminroute";
import EditQuizQuestions from "./components/admin/EditQuizQuestions"; // Correct import
import GoogleLoginCallback from './components/GoogleCallback';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <MainRoutes />
    </AuthProvider>
  );
}

const MainRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/google-callback" element={<GoogleLoginCallback />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/main" /> : <Login />}
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Main>
              <QuizList />
            </Main>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/start-quiz/:id"
        element={
          <ProtectedRoute>
            <StartQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:id"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-quiz"
        element={
          <Adminroute>
            <CreateQuizz />
          </Adminroute>
        }
      />
      <Route
        path="/edit-quiz/:id"
        element={
          <Adminroute>
            <UpdateQuizz />
          </Adminroute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <Adminroute>
            <Dashboard />
          </Adminroute>
        }
      />
      <Route
        path="/edit-question/:quizId"
        element={
          <Adminroute>
            <EditQuizQuestions />
          </Adminroute>
        }
      />

    </Routes>
  );
};

export default App;