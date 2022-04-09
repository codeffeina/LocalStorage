const { default: mongoose } = require("mongoose");
const { Schema, model, connect } = require("mongoose");

async function setupDB() {
  try {
    connect("mongodb://localhost:27017/CloudStorage");
    let folders = await FolderModel.find({});
    if (folders.length === 0) {
      await FolderModel.insertMany({ name: "home" });
    }
    console.log("Database connection!");
  } catch (err) {
    console.error(err);
    return;
  }
}

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

const FolderSchema = new Schema({
  name: String,
});

const FileModel = model("File", FileSchema);
const FolderModel = model("Folder", FolderSchema);

setupDB();

module.exports = {
  FileModel,
  FolderModel,
};
