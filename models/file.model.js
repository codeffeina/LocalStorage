const { Schema, model, connect } = require("mongoose");

connect("mongodb://localhost:27017/CloudStorage").then(() => {
  console.log("Database connected");
});

const FileSchema = new Schema({
  name: String,
  path: String,
  size: Number,
  type: { type: String },
  created_at: Date,
  folder: String, // save in which folder is the file stored
});

module.exports = model("File", FileSchema);
