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
