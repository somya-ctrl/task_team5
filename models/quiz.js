const mongoose = require('mongoose');
const QuizSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: {
      type: [String], 
      required: true,
    },
    prediction: String,
    probability: Number,
    score_text: String,
    score: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', QuizSchema);
