const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Educator = require("./educator.js");

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

departmentScheme.pre("findOneAndDelete", async function (next) {
  const departmentId = this._conditions["_id"];
  try {
    const result = await Educator.deleteMany({ departmentId });
  } catch (error) {
    console.error(
      "Ошибка поддержания целостности данных при удалении Department:",
      error
    );
  }
  next();
});

const Department = mongoose.model("Department", departmentScheme);

module.exports = Department;
