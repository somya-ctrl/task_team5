// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },

//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },

//   password: {
//     type: String,
//     required: true
//   },

//   googleId: {
//     type: String,
//     unique: true,
//     sparse: true
//   },

  
//   gender: {
//     type: String,
//     enum: ['Male', 'Female', 'Other'],
//     default: null
//   },

//   age: {
//     type: Number,
//     default: null
//   },

//   phone: {
//     type: String,
//     default: null
//   },
//   profession: {
//     type: String,
//     default: null
//   }

// }, {
//   timestamps: true
// });

// const User = mongoose.model('User', UserSchema);
// module.exports = User;
const mongoose = require('mongoose');

// Emoji regex (blocks emojis)
const emojiRegex = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}]/u;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name must be less than 50 characters"],
    validate: [
      {
        validator: function(value) {
          return !emojiRegex.test(value);  // no emojis
        },
        message: "Name cannot contain emojis"
      },
      {
        // OPTIONAL: allow alphabets & spaces only
        validator: function(value) {
          return /^[A-Za-z\s]+$/.test(value);
        },
        message: "Name can contain only letters and spaces"
      }
    ]
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
    min: [5, "Age must be at least 5"],
    max: [120, "Age must be less than 120"],
    default: null
  },

  phone: {
    type: String,
    default: null
  },

  profession: {
    type: String,
    default: null
  }

}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

