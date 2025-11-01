const mongoose = require('mongoose');
const QuizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: {
    type: [Number], 
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  status: {
    type: String, 
  },
  suggestion: {
    type: String, 
  },
}, {
  timestamps: true,
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
});

module.exports = mongoose.model("Questions", questionSchema);
module.exports = mongoose.model('Quiz', QuizSchema);