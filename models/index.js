require("dotenv").config();
const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    mongoose.connect(process.env.URL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Ошибка подключения к MongoDB: ", error);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
};
