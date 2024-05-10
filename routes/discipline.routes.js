const express = require("express");
const {
  getDisciplines,
  getDisciplineById,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
} = require("../controllers/discipline.controller.js");

const router = express.Router();

router.get("/", getDisciplines);
router.post("/", createDiscipline);
router.get("/:id", getDisciplineById);
router.delete("/:id", deleteDiscipline);
router.put("/:id", updateDiscipline);

module.exports = router;
