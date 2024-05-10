const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const disciplineScheme = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { versionKey: false }
);

const Discipline = mongoose.model("Discipline", disciplineScheme);

module.exports = Discipline;
