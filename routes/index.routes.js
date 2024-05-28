const express = require("express");
const educatorRouter = require("./educator.routes.js");
const departmentRouter = require("./department.routes.js");
const groupRouter = require("./group.routes.js");
const disciplineRouter = require("./discipline.routes.js");
const buildingsRouter = require("./building.routes.js");
const lessonsRouter = require("./lesson.routes.js");
const authRouter = require("./auth.routes.js");
const router = express.Router();

router.use("/educators", educatorRouter);
router.use("/departments", departmentRouter);
router.use("/groups", groupRouter);
router.use("/disciplines", disciplineRouter);
router.use("/buildings", buildingsRouter);
router.use("/lessons", lessonsRouter);
router.use("/auth", authRouter);

module.exports = router;
