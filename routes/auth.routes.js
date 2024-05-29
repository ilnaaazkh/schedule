const express = require("express");
const {
  getUsers,
  registration,
  login,
  deleteUser,
} = require("../controllers/auth.controller.js");
const { check } = require("express-validator");
const router = express.Router();

router.post(
  "/registration",
  [
    check("username", "Username cannot be empty").notEmpty(),
    check("password", "Password must contain at least 5 symbols").isLength(
      4,
      10
    ),
  ],
  registration
);
router.post("/login", login);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

module.exports = router;
