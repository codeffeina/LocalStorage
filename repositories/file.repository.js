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

exports.getFiles = async function (query) {
  try {
    let file = await FileModel.find(query);
    return file;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

exports.existsFile = async function (query) {
  try {
    let exists = await FileModel.exists(query);
    return exists ? true : false;
  } catch (error) {
    throw new Error(error);
  }
};

exports.findById = async function (id) {
  try {
    let file = await FileModel.findById(id);
    return file;
  } catch (error) {
    throw new Error(error);
  }
};

exports.findByIdAndDelete = async function (id) {
  try {
    await FileModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteMany = async function (query) {
  try {
    await FileModel.deleteMany(query);
  } catch (error) {
    throw new Error(error);
  }
};
