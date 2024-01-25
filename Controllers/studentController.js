
const { body, validationResult } = require("express-validator");
const Student = require("../Models/Student");
const ErrorHandler = require("../Utils/ErrorHandler");
const CustomError = require("../Utils/CustomError");
const { CUSTOM_ERROR, STATUS_CODE } = require("../Utils/Constants");
const { logger } = require("../Middleware/logging");

const { STUDENT_NOT_EXIST ,VALIDATION_FAILED} = CUSTOM_ERROR;
const { CREATED, SUCCESS, INTERNAL_SERVER_ERROR,BAD_REQUEST } = STATUS_CODE;

const addStudent = ErrorHandler(async (req, res, next) => {
  const validationRules = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("userName").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("skills").isArray().withMessage("Skills must be an array"),
    body("courses").isArray().withMessage("Courses must be an array"),
  ];

  await Promise.all(validationRules.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(BAD_REQUEST).json({
      status: "Error",
      message: VALIDATION_FAILED,
      errors: errors.array(),
    });
  }
  const { firstName, lastName, userName, email, skills, courses } = req.body;
  const student = await Student.create({
    firstName,
    lastName,
    userName,
    email,
    skills,
    courses,
  });
  res.status(CREATED).json({ status: "Success", data: { student } });
});

const getAllStudent = ErrorHandler(async (req, res, next) => {
  const students = await Student.find({});
  res.status(SUCCESS).json({ status: "Success", data: { students } });
});

const deleteStudent = ErrorHandler(async (req, res, next) => {
  const user = await Student.deleteOne({ _id: req.params.id });
  if (user.deletedCount > 0) {
    logger.info(`User deleted successfully`);
    res
      .status(SUCCESS)
      .json({ status: "success", message: "user deleted successfully" });
  } else {
    logger.error(STUDENT_NOT_EXIST);
    next(new CustomError(STUDENT_NOT_EXIST, INTERNAL_SERVER_ERROR));
  }
});

module.exports = { addStudent, getAllStudent, deleteStudent };