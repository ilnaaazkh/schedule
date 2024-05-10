const Building = require("../models/building");

const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find({});
    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await Building.findById(id);
    if (!building) {
      res.status(404).json({ message: "Building not found" });
    }
    res.status(200).json(building);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBuilding = async (req, res) => {
  try {
    const building = await Building.create(req.body);
    res.status(200).json(building);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await Building.findByIdAndUpdate(id, req.body);
    if (!building) {
      res.status(404).json({ message: "Building not found" });
    }
    const updatedBuilding = await Building.findById(id);
    res.status(200).json(updatedBuilding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await Building.findByIdAndDelete(id);
    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }
    res.status(200).json({ message: "Building deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
};
