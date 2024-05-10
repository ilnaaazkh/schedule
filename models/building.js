const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buildingScheme = new Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

const Building = mongoose.model("Building", buildingScheme);

module.exports = Building;
