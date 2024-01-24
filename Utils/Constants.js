const CUSTOM_ERROR = {
  EMAIL_AND_PASSWORD_MISSING: "Please provide userName & Password for login",
  INCORRECT_CREDENTIALS:"Incorrect email or password", 
  USER_NOT_FOUND:"We couldn't find the user with given email"
};

const STATUS_CODE = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

module.exports = { CUSTOM_ERROR, STATUS_CODE };
