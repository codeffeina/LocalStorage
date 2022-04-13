const { FolderModel } = require("../models");
const Utils = require("../utils");
const FolderRepo = require("../repositories/folder.repository");

// checks if the home folder exists, if it doesn't it creates it
async function createCollections() {
  try {
    if (!(await FolderModel.exists({ name: "home" }))) {
      await FolderModel.insertMany({ name: "home" });
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function deleteCollectionWithoutExistingFolder() {
  try {
    let folders = await FolderModel.find({}).select("path");
    for (let folder of folders) {
      if (!Utils.exists(folder.path)) {
        await FolderRepo.findByIdAndDelete(folder._id);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}

exports.setup = async function () {
  try {
    await createCollections();
    await deleteCollectionWithoutExistingFolder();
  } catch (error) {
    throw new Error(error);
  }
};
