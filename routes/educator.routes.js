const express = require("express");
const {
  createEducator,
  getEducators,
} = require("../controllers/educator.contoller.js");

const router = express.Router();

router.post("/", createEducator);
// router.post("/", createDepartment);
router.get("/", getEducators);
// router.delete("/:id", deleteDepartment);
// router.put("/:id", updateDepartment);

module.exports = router;
