const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const User = require("../Models/User");
const ErrorHandler = require("../Utils/ErrorHandler");
const CustomError = require("../Utils/CustomError");
const sendMail = require("../Utils/email");
const { CUSTOM_ERROR, STATUS_CODE } = require("../Utils/Constants");
const { logger } = require("../Middleware/logging");

const {
  EMAIL_AND_PASSWORD_MISSING,
  INCORRECT_CREDENTIALS,
  USER_NOT_FOUND,
  ERROR_SENDING_EMAIL,
  WRONG_PASSWORD,
} = CUSTOM_ERROR;
const {
  BAD_REQUEST,
  NOT_FOUND,
  SUCCESS,
  INTERNAL_SERVER_ERROR,
  CREATED,
  UNAUTHORIZED,
} = STATUS_CODE;

const register = ErrorHandler(async (req, res, next) => {
  const validationRules = [
    body("userName").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ];

  await Promise.all(validationRules.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(400).json({
      status: "Error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { userName, email, password, confirmPassword } = req.body;
  const newUser = await User.create({
    userName,
    email,
    password,
    confirmPassword,
  });
  newUser.password = undefined;

  logger.info(`User created: ${newUser._id}`);
  res.status(CREATED).json({ status: "Success", data: { user: newUser } });
});

const login = ErrorHandler(async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    const error = new CustomError(EMAIL_AND_PASSWORD_MISSING, BAD_REQUEST);
    return next(error);
  }

  const user = await User.findOne({ userName }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    const error = new CustomError(INCORRECT_CREDENTIALS, BAD_REQUEST);
    return next(error);
  }
  user.password = undefined;
  req.session.user = user;

  logger.info(`User login with userName:${user.userName}`);

  return res.status(SUCCESS).json({
    status: "success",
    data: { user },
  });
});

const logout = ErrorHandler(async (req, res, next) => {
  req.session.destroy((err) => {
    res.status(SUCCESS).json({ message: "User logout successfully" });
  });
});

const forgotPassword = ErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new CustomError(USER_NOT_FOUND, NOT_FOUND);
    next(error);
  }

  const resetToken = user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;
  const message = `We have recieved a password reset url.Please use the below link to reset the password\n\n ${resetUrl} \n\n This reset password link is valid only for 10 minutes.`;

  try {
    await sendMail({
      email: user.email,
      subject: "Password change request recieved",
      message: message,
    });
    logger.info(`Password reset link send to the user email:${user.email}`);
    res.status(SUCCESS).json({
      status: "success",
      message: "password reset link send to the user email.",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    logger.error(ERROR_SENDING_EMAIL);
    return next(new CustomError(ERROR_SENDING_EMAIL, INTERNAL_SERVER_ERROR));
  }
});

const resetPassword = ErrorHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    logger.error("Token is invalid or Expired");
    next(new CustomError("Token is invalid or Expired", BAD_REQUEST));
  }

  if (!password || !confirmPassword) logger.error(PLEASE_PROVIDE_PASSWORD);
  next(new CustomError(PLEASE_PROVIDE_PASSWORD, BAD_REQUEST));

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  logger.info(`Password changed successfully for user:${user.userName}`);
  res
    .status(SUCCESS)
    .json({ status: "success", message: "password changed successfully" });
});

const updatePassword = ErrorHandler(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;

  const user = await User.findById(req.session.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword, user.password))) {
    logger.error(WRONG_PASSWORD);
    return next(new CustomError(WRONG_PASSWORD, BAD_REQUEST));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();

  logger.info(`Password updated successfully for user:${user.userName}`);
  res
    .status(SUCCESS)
    .json({ status: "success", message: "password updated successfully" });
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
};
