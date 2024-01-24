const express = require("express");
const { updateUserDetails } = require("../Controllers/userController");
const authenticate = require("../Middleware/authenticate");

const router = express.Router();

router.patch("/update-user", authenticate, updateUserDetails);

module.exports = router;
