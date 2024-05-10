const express = require("express");
const {
  getDepartments,
  createDepartment,
  getDepartmentById,
  deleteDepartment,
  updateDepartment,
} = require("../controllers/department-contoller.js");
const router = express.Router();

router.get("/", getDepartments);
router.post("/", createDepartment);
router.get("/:id", getDepartmentById);
router.delete("/:id", deleteDepartment);
router.put("/:id", updateDepartment);

module.exports = router;
