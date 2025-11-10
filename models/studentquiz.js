const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
    unique: true, // each field name like "anxiety_level" should be unique
  },
  question: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: false, // only for questions with scale
  },
  max: {
    type: Number,
    required: false,
  },
  scale: {
    type: Map,
    of: String, // e.g., { "0": "Never", "5": "Very often" }
    required: false,
  },
  options: {
    type: Map,
    of: String, // e.g., { "0": "No", "1": "Yes" }
    required: false,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
