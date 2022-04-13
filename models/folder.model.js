const { Schema, model } = require("mongoose");

const FolderSchema = new Schema({
  name: String,
  path: String,
});

module.exports = model("Folder", FolderSchema);
