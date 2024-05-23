const express = require("express");
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/room.contoller.js");

const router = express.Router();

router.post("/", createRoom);
router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/:id", updateRoom);
router.delete("/:id", deleteRoom);

module.exports = router;
