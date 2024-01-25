const express = require("express");
const authenticate = require("../Middleware/authenticate");
const {
  addStudent,
  getAllStudent,
  deleteStudent,
} = require("../Controllers/studentController");
const restrict = require("../Middleware/restrict");

const router = express.Router();

router.post("/", authenticate, addStudent);
router.get("/",authenticate, getAllStudent);
router.delete(
  "/:id",
  authenticate,
  restrict("admin", "super_admin"),
  deleteStudent
);

module.exports = router;
