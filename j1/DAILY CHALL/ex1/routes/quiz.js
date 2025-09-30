const express = require("express");
const router = express.Router();

const triviaQuestions = [
  {
    question: "What is the capital of France?",
    answer: "Paris",
    options: ["Paris", "London", "Berlin", "Madrid"]
  },
  {
    question: "Which planet is known as the Red Planet?",
    answer: "Mars",
    options: ["Mars", "Earth", "Jupiter", "Venus"]
  },
  {
    question: "What is the largest mammal in the world?",
    answer: "Blue whale",
    options: ["Elephant", "Blue whale", "Shark", "Giraffe"]
  },
];

let score = 0;
let currentQuestion = 0;


router.get("/", (req, res) => {
  currentQuestion = 0;
  score = 0;
  res.json({ question: triviaQuestions[currentQuestion].question, options: triviaQuestions[currentQuestion].options });
});


router.post("/", (req, res) => {
  const { answer } = req.body;
  if (answer === triviaQuestions[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;

  if (currentQuestion >= triviaQuestions.length) {
    res.json({ message: "Quiz terminé", score });
  } else {
    res.json({
      question: triviaQuestions[currentQuestion].question,
      options: triviaQuestions[currentQuestion].options,
      score
    });
  }
});

// Obtenir le score final
router.get("/score", (req, res) => {
  res.json({ score });
});

module.exports = router;
