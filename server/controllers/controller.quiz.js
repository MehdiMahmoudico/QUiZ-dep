const Quiz = require("../models/model.quiz");
const multer = require("multer");
const path = require("path");
const QuizResult = require("../models/model.quizresults");


exports.addQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questions } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    questions.forEach((q) => {
      quiz.questions.push(q);
    });

    await quiz.save();
    res.json({ message: "Questions added successfully!" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err });
  }
};


// Add a Question to a Quiz
module.exports.addQuestionToQuiz = (req, res) => {
  Quiz.findOneAndUpdate(
      { _id: req.params.quizId },
      { $push: { questions: req.body } }, 
      { new: true, runValidators: true }
  )
      .then((updatedQuiz) => res.json({ Quiz: updatedQuiz }))
      .catch((err) => res.status(400).json(err));
};

// Get All Questions of a Quiz
module.exports.getQuestionsFromQuiz = (req, res) => {
  Quiz.findOne({ _id: req.params.quizId })
      .then((quiz) => {
          if (!quiz) {
              return res.status(404).json({ message: "Quiz not found" });
          }
          res.json(quiz.questions);
      })
      .catch((err) => res.status(400).json(err));
};

// Update a Specific Question
module.exports.updateQuestionInQuiz = (req, res) => {
  Quiz.findOneAndUpdate(
      { _id: req.params.quizId, "questions._id": req.params.questionId },
      {
          $set: {
              "questions.$": req.body, 
          },
      },
      { new: true, runValidators: true }
  )
      .then((updatedQuiz) => res.json({ Quiz: updatedQuiz }))
      .catch((err) => res.status(400).json(err));
};

// Delete a Specific Question
module.exports.deleteQuestionFromQuiz = (req, res) => {
  Quiz.findOneAndUpdate(
      { _id: req.params.quizId },
      { $pull: { questions: { _id: req.params.questionId } } }, 
      { new: true }
  )
      .then((updatedQuiz) => res.json({ Quiz: updatedQuiz }))
      .catch((err) => res.status(400).json(err));
};




// create quiz results
module.exports.saveQuizResult = (req, res) => {
  const { userId, quizId, score, timeSpent, correctAnswers, totalQuestions } = req.body;

  QuizResult.create({ userId, quizId, score, timeSpent, correctAnswers, totalQuestions })
    .then((quizResult) => {
      res.status(201).json({ message: "Quiz saved ", quizResult });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//get quiz results
module.exports.getUserQuizResults = (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching results for userId: ${userId}`);
  
  QuizResult.find({ userId })
    .populate("quizId", "name")
    .then((results) => {
      const formattedResults = results.map(result => ({
        _id: result._id,
        quizName: result.quizId.name,
        score: result.score,
        totalQuestions: result.totalQuestions,
      }));
      console.log('Results:', formattedResults);
      res.status(200).json(formattedResults);
    })
    .catch((err) => {
      console.error("Error fetching quiz results:", err);
      res.status(400).json(err);
    });
};;

//Delete quiz results
module.exports.deleteQuizResult = (req, res) => {
  QuizResult.findByIdAndDelete({ _id: req.params.resultId })
   .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Quiz result not found" });
      }
      res.json({ message: "Quiz result deleted successfully!" });
    })
   .catch((err) => res.status(500).json({ message: "An error occurred", error: err }));
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
      const allowedExtensions = /jpeg|jpg|png/;
      const extension = path.extname(file.originalname).toLowerCase();
      if (allowedExtensions.test(extension)) {
          cb(null, true);
      } else {
          cb(new Error("Only .jpeg, .jpg, and .png formats are allowed!"));
      }
  },
});

module.exports.findALLQuiz = (req, res) => {
    Quiz.find()
      .then((Quiz) => {
    //   console.log("all Quiz", Quiz);
        res.json(Quiz);   
      })
      .catch((err) => {
        res.status(400).json(err);
        
      });
  };
  
  module.exports.findOneSingleQuiz = (req, res) => {
    Quiz.findOne({ _id: req.params.id })
      .then((oneSingleQuiz) => {
        res.json(oneSingleQuiz );
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };
  
  module.exports.createNewQuiz = (req, res) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
  
      const quizData = {
        ...req.body,
        image: req.file ? req.file.path : undefined,
      };
  
      Quiz.create(quizData)
        .then((newlyCreatedQuiz) => {
          res.json({ Quiz: newlyCreatedQuiz });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    });
  };
  
  module.exports.updateExistingQuiz = (req, res) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
  
      const updatedData = {
        ...req.body,
        ...(req.file && { image: req.file.path }), 
      };
  
      Quiz.findOneAndUpdate({ _id: req.params.id }, updatedData, {
        new: true,
        runValidators: true,
      })
        .then((updatedQuiz) => {
          res.json({ Quiz: updatedQuiz });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    });
  };
  
  module.exports.deleteAnExistingQuiz = (req, res) => {
    Quiz.deleteOne({ _id: req.params.id })
      .then((result) => {
        res.json({ result: result });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };