const Discipline = require("../models/discipline.js");

const getDisciplines = async (_, res) => {
  try {
    const disciplines = await Discipline.find({});
    res.status(200).json(disciplines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDisciplineById = async (req, res) => {
  try {
    const { id } = req.params;
    const discipline = await Discipline.findById(id);
    if (!discipline) {
      return res.status(404).json({ message: "Discipline not found" });
    }
    res.status(200).json(discipline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDiscipline = async (req, res) => {
  try {
    const discipline = await Discipline.create(req.body);
    res.status(200).json(discipline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDiscipline = async (req, res) => {
  try {
    const { id } = req.params;
    const discipline = await Discipline.findByIdAndUpdate(id, req.body);
    if (!discipline) {
      res.status(404).json({ message: "Discipline not found" });
    }
    const updatedDiscipline = await Discipline.findById(id);
    res.status(200).json(updatedDiscipline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDiscipline = async (req, res) => {
  try {
    const { id } = req.params;
    const discipline = await Discipline.findByIdAndDelete(id);
    if (!discipline) {
      res.status(404).json({ message: "Discipline not found" });
    }
    res.status(200).json({ message: "Discipline deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDisciplines,
  getDisciplineById,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
};
