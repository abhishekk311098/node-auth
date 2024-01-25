const User = require("../Models/User");
const ErrorHandler = require("../Utils/ErrorHandler");
const CustomError = require("../Utils/CustomError");
const { CUSTOM_ERROR, STATUS_CODE } = require("../Utils/Constants");
const { logger } = require("../Middleware/logging");

const { USER_NOT_FOUND } = CUSTOM_ERROR;
const { SUCCESS, NOT_FOUND, INTERNAL_SERVER_ERROR } = STATUS_CODE;

const updateUserDetails = ErrorHandler(async (req, res, next) => {
  const { firstName, lastName, role } = req.body;

  const user = await User.findById(req.session.user._id);

  if (!user) next(new CustomError(USER_NOT_FOUND, NOT_FOUND));

  user.firstName = firstName;
  user.lastName = lastName;
  user.role = role;

  await user.save({ validateBeforeSave: false });

  logger.info(`User updated successfully`);
  res
    .status(200)
    .json({ status: "success", message: "user updated successfully" });
});

const deleteUser = ErrorHandler(async (req, res, next) => {
  const user = await User.deleteOne({ _id: req.session.user._id });
  if (user.deletedCount > 0) {
    logger.info(`User deleted successfully`);
    res
      .status(SUCCESS)
      .json({ status: "success", message: "user deleted successfully" });
  } else {
    logger.error("user not exist");
    next(new CustomError("user not exist", INTERNAL_SERVER_ERROR));
  }
});

module.exports = { updateUserDetails, deleteUser };
