const CUSTOM_ERROR = {
  EMAIL_AND_PASSWORD_MISSING: "Please provide userName & Password for login",
  INCORRECT_CREDENTIALS:"Incorrect email or password", 
  USER_NOT_FOUND:"We couldn't find the user with given email",
  VALIDATION_FAILED:"Validation failed",
  ERROR_SENDING_EMAIL:"There was an error sending password reset email. Please try again later",
  WRONG_PASSWORD:"The current password you provided is wrong",
  PLEASE_PROVIDE_PASSWORD:"Please provide password and confirm password",
  STUDENT_NOT_EXIST:"Unable to delete Student, Student doesn't Exist"
};

const STATUS_CODE = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CREATED:201
};

module.exports = { CUSTOM_ERROR, STATUS_CODE };
