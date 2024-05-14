const Educator = require("../models/educator.js");
const Department = require("../models/department.js");

// {
//   firstName,
//   middleName,
//   lastName,
//   department
// }

const createEducator = async (req, res) => {
  try {
    const body = req.body;

    const department = await Department.findOne({ title: body.department });

    const educator = await Educator.create({
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      departmentId: department._id,
    });

    res.status(200).json(educator);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEducators = async (_, res) => {
  try {
    const educators = await Educator.find().populate("departmentId");
    const educatorsResponse = educators.map((educator) =>
      Object({
        firstName: educator.firstName,
        middleName: educator.middleName,
        lastName: educator.lastName,
        departmentTitle: educator.departmentId.title,
      })
    );
    res.status(200).json(educatorsResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEducator,
  getEducators,
};
