const { FolderModel } = require("../models");

exports.getFolders = async function (query, select = "") {
  try {
    let folders = await FolderModel.find(query).select(select).lean();
    return folders;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

exports.getOneFolder = async function (query) {
  try {
    let folder = await FolderModel.findOne(query);
    return folder;
  } catch (error) {
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
    await FolderModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};

exports.exists = async function (query) {
  try {
    let result = await FolderModel.exists(query);
    return result ? true : false;
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteOne = async function (query) {
  try {
    await FolderModel.findOneAndDelete(query);
  } catch (error) {
    throw new Error(error);
  }
};
