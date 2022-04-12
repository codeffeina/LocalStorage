const { Schema, model } = require("mongoose");

const FolderSchema = new Schema({
  name: String,
});

module.exports = model("Folder", FolderSchema);
