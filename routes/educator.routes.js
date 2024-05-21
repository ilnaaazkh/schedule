const express = require("express");
const {
  createEducator,
  getEducators,
  getEducatorById,
  updateEducator,
  deleteEducator,
} = require("../controllers/educator.contoller.js");

const router = express.Router();

router.post("/", createEducator);
router.get("/", getEducators);
router.get("/:id", getEducatorById);
router.put("/:id", updateEducator);
router.delete("/:id", deleteEducator);

module.exports = router;
