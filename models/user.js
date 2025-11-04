const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: null
  },

  age: {
    type: Number,
    default: null
  },

  phone: {
    type: String,
    default: null
  }

}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
