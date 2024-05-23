const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomScheme = new Schema({
  number: {
    type: Number,
    required: true,
  },
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },
});

const Room = mongoose.model("Room", roomScheme);

module.exports = Room;
