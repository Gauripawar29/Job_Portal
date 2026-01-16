const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["student", "employer"],
      default: "student",
    },
    location: String,
    experience: String,
    skills: [String],
    github: String,
    resume: {
      filename: String,
      filepath: String,
    },
    document: {
      filename: String,
      filepath: String,
    },
    photo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
