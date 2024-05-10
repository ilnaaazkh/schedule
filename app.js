require("dotenv").config();
const express = require("express");
const educatorRouter = require("./routes/educator-routes");
const departmentRouter = require("./routes/department-routes.js");
const { connectToDatabase } = require("./models/index.js");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/educator", educatorRouter);
app.use("/departments", departmentRouter);

const start = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () =>
      console.log(`Сервер запущен по адресу: http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
};

start();
