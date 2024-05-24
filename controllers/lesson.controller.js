const Lesson = require("../models/lesson");

const createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLesson,
};
