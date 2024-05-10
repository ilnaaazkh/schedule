const express = require("express");
const { getEducators } = require("../controllers/educator-contoller");

const router = express.Router();

router.get("/", getEducators);

module.exports = router;
