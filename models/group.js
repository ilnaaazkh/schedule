const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupScheme = new Schema(
  {
    group_code: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

const Group = mongoose.model("Group", groupScheme);

module.exports = Group;
