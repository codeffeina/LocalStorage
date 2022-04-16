const path = require("path");
const fs = require("fs");
const pathToImages = path.join(__dirname, "..", "public", "images");

module.exports = {
  pathToImages,
  allowTypes: ["audio", "image", "video"],
  renameTo: function (oldPath, newPath) {
    fs.renameSync(oldPath, newPath);
  },
  exists: function (path) {
    return fs.existsSync(path);
  },
  setType: function (file) {
    switch (file.type) {
      case "image":
        file.isImage = true;
        break;
      case "video":
        file.isVideo = true;
        break;
      case "audio":
        file.isAudio = true;
        break;
    }
  },
  setFolder: function (FOLDERS, file, url) {
    let folder = FOLDERS.find((folder) => folder.name === url);
    file.folder_id = folder._id;
  },
  setupFolders: function () {
    if (!fs.existsSync(pathToImages)) {
      fs.mkdirSync(pathToImages);
      fs.mkdirSync(path.join(pathToImages, "home"));
    }
  },
  readDirContent: function (path) {
    try {
      let content = fs.readdirSync(path);
      return content;
    } catch (error) {
      throw new Error(error);
    }
  },
  removeDir: function (...pathToDir) {
    try {
      fs.rmdirSync(path.join(...pathToDir));
    } catch (error) {
      throw new Error(error);
    }
  },
  joinPaths: function (...paths) {
    return path.join(...paths);
  },
};
