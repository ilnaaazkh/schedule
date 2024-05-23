const Room = require("../models/room.js");

const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    const newRoom = await room.populate("buildingId");

    const roomResponse = {
      _id: newRoom._id,
      number: newRoom.number,
      building_number: newRoom.buildingId.number,
      address: newRoom.buildingId.address,
    };

    res.status(200).json(roomResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("buildingId");

    const roomResponse = rooms.map((room) => ({
      _id: room._id,
      number: room.number,
      building_number: room.buildingId.number,
      address: room.buildingId.address,
    }));
    res.status(200).json(roomResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate("buildingId");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomResponse = {
      _id: room._id,
      number: room.number,
      building_number: room.buildingId.number,
      address: room.buildingId.address,
    };
    res.status(200).json(roomResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByIdAndUpdate(id, req.body);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const updatedRoom = await Room.findById(id).populate("buildingId");

    const roomResponse = {
      _id: updatedRoom._id,
      number: updatedRoom.number,
      building_number: updatedRoom.buildingId.number,
      address: updatedRoom.buildingId.address,
    };

    res.status(200).json(roomResponse);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = Room.findByIdAndDelete(id);

    if (!room) {
      return req.status(404).json({ message: "Room not found" });
    }

    const roomResponse = {
      _id: room._id,
      number: room.number,
      building_number: room.buildingId.number,
      address: room.buildingId.address,
    };

    res.status(200).json(roomResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
