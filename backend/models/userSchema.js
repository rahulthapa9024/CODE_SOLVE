const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photoURL: {
    type: String,
    default: "", // optional photo URL
  },
  problemSolved: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'problem',
      unique: true
    }],
  },
  difficultyCount: {
    easy: {
      type: Number,
      default: 0
    },
    medium: {
      type: Number,
      default: 0
    },
    hard: {
      type: Number,
      default: 0
    },
    solvedPoin:{
      type: Number,
      default: 0
    }
  }

  
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
