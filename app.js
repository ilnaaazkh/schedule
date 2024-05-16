require("dotenv").config();
const express = require("express");
const apiRoutes = require("./routes/index.routes.js");
const { connectToDatabase } = require("./models/index.js");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.static("./public/html"));
app.use(express.static("./public/css", { extensions: ["css"] }));
app.use(express.static("./public/imgs"));
app.use(express.static("./public/js"));
app.use("/api", apiRoutes);

const start = async () => {
  connectToDatabase()
    .then(() => {
      console.log("База данных успешно подключена");
      app.listen(PORT, () =>
        console.log(`Сервер запущен по адресу: http://localhost:${PORT}`)
      );
    })
    .catch(() => {
      console.log("Не удалось установить соединение с базой данных");
    });
};

start();
