const { default: mongoose } = require("mongoose");
const { Schema, model } = require("mongoose");

const FileSchema = new Schema({
  name: String,
  path: String,
  size: Number,
  type: { type: String },
  format: { type: String },
  created_at: {
    type: Date,
    default: Date.now,
  },
  folder_id: mongoose.Types.ObjectId, // save in which folder is the file stored,
  isVideo: {
    type: Boolean,
    default: false,
  },
  isImage: {
    type: Boolean,
    default: false,
  },
  isAudio: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("File", FileSchema);
