const express = require("express");
const { createLesson } = require("../controllers/lesson.controller.js");

const router = express.Router();

router.post("/", createLesson);

module.exports = router;
