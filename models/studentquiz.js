const mongoose = require('mongoose');

const studentQuizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prediction: { type: Number, required: true },
  stress_level: { type: String, required: true },
  confidence: {
    low: Number,
    moderate: Number,
    high: Number,
  },
  stress_score: { type: Number },
  recommendation: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('studentquiz', studentQuizSchema);
