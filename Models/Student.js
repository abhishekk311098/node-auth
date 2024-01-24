const mongoose = require("mongoose");
const validator = require("validator");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      required: [true, "Please Enter your userName"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a Valid Email"],
    },
    skills: { type: [String], default: [] },
    courses: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
