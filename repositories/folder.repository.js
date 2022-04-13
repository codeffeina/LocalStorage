const { FolderModel, FileModel } = require("../models");

exports.getFolders = async function (query, select = "") {
  try {
    let folders = await FolderModel.find(query).select(select).lean();
    return folders;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

exports.createFolder = async function (data) {
  try {
    let folder = new FolderModel(data);
    await folder.save();
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
