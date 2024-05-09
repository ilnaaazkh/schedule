require("dotenv").config();
const express = require("express");

const port = process.env.PORT || 3000;

const app = express();

app.get("/", (_, res) => res.send("Hello world"));

app.listen(port, () =>
  console.log(`Сервер запущен по адресу: http://localhost:${port}`)
);
