const { default: mongoose } = require("mongoose");
const { Schema, model } = require("mongoose");

const FolderSchema = new Schema({
  name: String,
  path: String,
  files: {
    type: [mongoose.Types.ObjectId],
    default: undefined,
  },
});

module.exports = model("Folder", FolderSchema);
