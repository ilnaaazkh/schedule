const express = require("express");
const {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} = require("../controllers/building.controller.js");

const router = express.Router();

router.get("/", getBuildings);
router.post("/", createBuilding);
router.get("/:id", getBuildingById);
router.delete("/:id", deleteBuilding);
router.put("/:id", updateBuilding);

module.exports = router;
