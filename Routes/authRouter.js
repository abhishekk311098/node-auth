const express = require("express");
const { register, login, logout, forgotPassword, resetPassword, updatePassword } = require("../Controllers/authController");
const authenticate = require("../Middleware/authenticate");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-password", authenticate, updatePassword);
router.get("/logout", authenticate, logout);

module.exports = router;
