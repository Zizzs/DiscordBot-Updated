let mongoose = require("mongoose");

let event = new mongoose.Schema({
  title: String,
  date: Date,
  url: String,
  type: String
});

module.exports = event;
