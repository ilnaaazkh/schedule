require("dotenv").config();
const express = require("express");
const path = require("path");
const apiRoutes = require("./routes/index.routes.js");
const { connectToDatabase } = require("./models/index.js");
const roleMiddleware = require("./middleware/role.middleware.js");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
//app.use(express.static("./public/html"));
app.use(express.static("./public/css"));
app.use(express.static("./public/imgs"));
app.use(express.static("./public/js"));
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/index.html"));
});

app.get("/teachers", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/teachers.html"));
});

app.get("/students", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/students.html"));
});

app.get("/admin", roleMiddleware(["USER"]), (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/admin.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/login.html"));
});

app.get("/buildings", roleMiddleware(["USER"]), (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/buildings.html"));
});

app.get("/departments", roleMiddleware(["USER"]), (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/departments.html"));
});

app.get("/disciplines", roleMiddleware(["USER"]), (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/disciplines.html"));
});

app.get("/educators", roleMiddleware(["USER"]), (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/educators.html"));
});

app.get("/groups", roleMiddleware(["USER"]), (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/groups.html"));
});

app.get("/scheduling", roleMiddleware(["USER"]), (req, res) => {
  res.sendFile(path.join(__dirname, "./public/html/scheduling.html"));
});

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
