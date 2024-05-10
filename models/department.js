const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentScheme = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    short_title: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Department = mongoose.model("Department", departmentScheme);

module.exports = Department;
