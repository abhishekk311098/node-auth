const CustomError = require("../Utils/CustomError");

const restrict = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.session.user.role)) {
      next(
        new CustomError(
          "You do not have permission to perform this action",
          403
        )
      );
    }
    next();
  };
};

module.exports = restrict;
