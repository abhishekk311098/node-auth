const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
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
    role:{
      type:String,
      enum:['user','admin','super_admin'],
      default:'user'
    },
    password: {
      type: String,
      required: [true, "Please Enter a password"],
      minLength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      minLength: 8,
      validate: {
        validator: function (val) {
          return val == this.password;
        },
        message: "Password & Confirm password doesn't match!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (password, passwordDB) {
  return await bcrypt.compare(password, passwordDB);
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
