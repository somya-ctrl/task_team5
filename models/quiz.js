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

module.exports = mongoose.model('Quiz', QuizSchema);