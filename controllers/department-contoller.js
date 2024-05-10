const Department = require("../models/department");

const getDepartments = async (req, res) => {
  Department.find({})
    .then((departments) => res.send(departments))
    .catch((error) => console.log(error));
};

const createDepartment = async (req, res) => {
  const department = await Department.create(req.body);
  res.status(200).send(department._id);
};

const getDepartmentById = async (req, res) => {
  const department = await Department.findById(req.params.id);
  res.status(200).send(department);
};

const deleteDepartment = async (req, res) => {
  const department = await Department.findOneAndDelete(req.params.id);

  res.status(200).send(department._id);
};

const updateDepartment = async (req, res) => {
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res.status(200).send(department._id);
};

module.exports = {
  getDepartments,
  createDepartment,
  getDepartmentById,
  deleteDepartment,
  updateDepartment,
};
