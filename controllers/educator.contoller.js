const Educator = require("../models/educator.js");

const createEducator = async (req, res) => {
  try {
    const body = req.body;
    const educator = await Educator.create(body);

    const newEducator = await educator.populate("departmentId");

    const educatorContract = {
      _id: newEducator._id,
      firstName: newEducator.firstName,
      middleName: newEducator.middleName,
      lastName: newEducator.lastName,
      department_title: newEducator.departmentId.title,
      department_short_title: newEducator.departmentId.short_title,
    };

    res.status(200).json(educatorContract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEducators = async (_, res) => {
  try {
    const educators = await Educator.find().populate("departmentId");

    const educatorsContract = educators.map((e) => ({
      _id: e._id,
      firstName: e.firstName,
      middleName: e.middleName,
      lastName: e.lastName,
      department_title: e.departmentId.title,
      department_short_title: e.departmentId.short_title,
    }));

    res.status(200).json(educatorsContract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEducatorById = async (req, res) => {
  try {
    const { id } = req.params;

    const educator = await Educator.findById(id).populate("departmentId");

    if (!educator) {
      return res.status(404).json({ message: "Educator not found" });
    }

    const educatorContract = {
      _id: educator._id,
      firstName: educator.firstName,
      middleName: educator.middleName,
      lastName: educator.lastName,
      department_title: educator.departmentId.title,
      department_short_title: educator.departmentId.short_title,
    };

    res.status(200).json(educatorContract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEducator = async (req, res) => {
  try {
    const { id } = req.params;
    const educator = await Educator.findByIdAndUpdate(id, req.body);
    if (!educator) {
      return res.status(404).json({ message: "Educator not found" });
    }
    const updatedEductor = await Educator.findById(id).populate("departmentId");

    const educatorContract = {
      _id: updatedEductor._id,
      firstName: updatedEductor.firstName,
      middleName: updatedEductor.middleName,
      lastName: updatedEductor.lastName,
      department_title: updatedEductor.departmentId.title,
      department_short_title: updatedEductor.departmentId.short_title,
    };

    res.status(200).json(educatorContract);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

const deleteEducator = async (req, res) => {
  try {
    const { id } = req.params;
    const educator = await Educator.findByIdAndDelete(id);

    if (!educator) {
      return res.status(404).json({ message: "Educator not found" });
    }

    const educatorPopulated = await educator.populate("departmentId");

    const educatorContract = {
      _id: educatorPopulated._id,
      firstName: educatorPopulated.firstName,
      middleName: educatorPopulated.middleName,
      lastName: educatorPopulated.lastName,
      department_title: educatorPopulated.departmentId.title,
      department_short_title: educatorPopulated.departmentId.short_title,
    };

    res.status(200).json(educatorContract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEducator,
  getEducators,
  getEducatorById,
  updateEducator,
  deleteEducator,
};
