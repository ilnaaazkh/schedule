const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const educatorScheme = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Educator = mongoose.model("Educator", educatorScheme);

module.exports = Educator;
