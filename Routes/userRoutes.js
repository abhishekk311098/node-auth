const express = require("express");
const {
  updateUserDetails,
  deleteUser,
} = require("../Controllers/userController");
const authenticate = require("../Middleware/authenticate");

const router = express.Router();

router.patch("/update-user", authenticate, updateUserDetails);
router.delete("/", authenticate, deleteUser);

module.exports = router;
