const Student = require("../Models/Student");
const ErrorHandler = require("../Utils/ErrorHandler");
const CustomError = require("../Utils/CustomError");
const { CUSTOM_ERROR, STATUS_CODE } = require("../Utils/Constants");

const { EMAIL_AND_PASSWORD_MISSING, INCORRECT_CREDENTIALS } = CUSTOM_ERROR;
const { BAD_REQUEST } = STATUS_CODE;

const addStudent = ErrorHandler(async (req, res, next) => {
  const { firstName, lastName, userName, email, skills, courses } = req.body;
  const student = await Student.create({
    firstName,
    lastName,
    userName,
    email,
    skills,
    courses,
  });

  res.status(201).json({ status: "Success", data: { student } });
});

const getAllStudent = ErrorHandler(async (req, res, next) => {
  const students = await Student.find({});
  res.status(201).json({ status: "Success", data: { students } });
});

const deleteStudent = ErrorHandler(async (req, res, next) => {
  const user = await Student.deleteOne({ _id: req.params.id });
  if (user.deletedCount > 0) {
    res
      .status(200)
      .json({ status: "success", message: "user deleted successfully" });
  } else {
    next(
      new CustomError("Unable to delete Student, Student doesn't Exist", 500)
    );
  }
});

module.exports = { addStudent, getAllStudent, deleteStudent };
