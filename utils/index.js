const path = require("path");
const fs = require("fs");

module.exports = {
  pathToImages: path.join(__dirname, "..", "public", "images"),
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
    console.log(folder);
    file.folder_id = folder._id;
  },
  setupFolders: function () {
    let pathToImages = path.join(__dirname, "..", "public", "images");
    if (!fs.existsSync(pathToImages)) {
      fs.mkdirSync(pathToImages);
      fs.mkdirSync(path.join(pathToImages, "home"));
    }
  },
};
