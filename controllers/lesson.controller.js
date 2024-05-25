const Lesson = require("../models/lesson");
const Group = require("../models/group");
const Educator = require("../models/educator");

const createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonsByGroupCode = async (req, res) => {
  try {
    const { group_code } = req.query;
    const { week_parity } = req.query;
    const group = await Group.findOne({ group_code: group_code });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const lessons = await Lesson.find({
      groups: { $elemMatch: { group_code } },
      parity: week_parity,
    });

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonsByEducatorId = async (req, res) => {
  try {
    const { educatorId } = req.query;
    const { week_parity } = req.query;
    const educator = await Educator.findById(educatorId);

    if (!educator) {
      return res.status(404).json({ message: "Educator not found" });
    }

    const lessons = await Lesson.find({
      "educator._id": educatorId,
      parity: week_parity,
    });

    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessons = async (req, res) => {
  if (req.query.group_code && req.query.week_parity) {
    await getLessonsByGroupCode(req, res);
  } else if (req.query.educatorId && req.query.week_parity) {
    await getLessonsByEducatorId(req, res);
  } else {
    res.status(400).json({ message: "Invalid query parameters" });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByIdAndUpdate(id, req.body);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    const updLesson = await Lesson.findById(id);
    res.status(200).json(updLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLesson,
  getLessons,
  deleteLesson,
  updateLesson,
};
