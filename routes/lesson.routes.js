const express = require("express");
const {
  createLesson,
  getLessons,
  deleteLesson,
  updateLesson,
} = require("../controllers/lesson.controller.js");

const router = express.Router();

router.post("/", createLesson);
router.get("/", getLessons);
router.delete("/:id", deleteLesson);
router.put("/:id", updateLesson);

module.exports = router;
