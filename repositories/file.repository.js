const { FileModel } = require("../models");
const utils = require("../utils");
const path = require("path");
exports.createFile = async function (data, url, FOLDERS) {
  utils.renameTo(data.path, path.join(utils.pathToImages, url, data.name));
  try {
    const file = new FileModel();
    file.name = data.name;
    file.path = path.join(utils.pathToImages, url, data.name);
    file.size = data.size;
    file.type = data.type.split("/")[0];
    file.format = data.type.split("/")[1];
    utils.setType(file);
    utils.setFolder(FOLDERS, file, url);
    await file.save();
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
};
