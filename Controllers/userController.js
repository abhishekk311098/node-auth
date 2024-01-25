const User = require("../Models/User");
const ErrorHandler = require("../Utils/ErrorHandler");
const CustomError = require("../Utils/CustomError");
const { CUSTOM_ERROR, STATUS_CODE } = require("../Utils/Constants");

const { USER_NOT_FOUND } = CUSTOM_ERROR;
const { NOT_FOUND } = STATUS_CODE;

const updateUserDetails = ErrorHandler(async (req, res, next) => {
  const { firstName, lastName } = req.body;

  const user = await User.findById(req.session.user._id);

  if (!user) next(new CustomError(USER_NOT_FOUND, NOT_FOUND));

  user.firstName = firstName;
  user.lastName = lastName;

  await user.save({ validateBeforeSave: false });
  
  logger.info(`User updated successfully`);
  res
    .status(200)
    .json({ status: "success", message: "user updated successfully" });
});

module.exports = { updateUserDetails };
