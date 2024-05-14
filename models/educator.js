const { default: mongoose } = require("mongoose");
const mogoose = require("mongoose");
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
      type: mogoose.Types.ObjectId,
      ref: "departments",
    },
  },
  {
    versionKey: false,
  }
);

const Educator = mongoose.model("Educator", educatorScheme);

module.exports = Educator;
