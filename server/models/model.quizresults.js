const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  score: {
    type: Number,

  },
  timeSpent: {
    type: Number, 
  },
  correctAnswers: {
    type: Number,
  },
  totalQuestions: {
    type: Number,
  },
  dateAttempted: {
    type: Date,
    default: Date.now,
  },
});
const QuizResult = mongoose.model("QuizResult", QuizResultSchema);
module.exports = QuizResult;

