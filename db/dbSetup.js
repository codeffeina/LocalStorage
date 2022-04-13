const { FolderModel } = require("../models");
const Utils = require("../utils");
const path = require("path");
const FolderRepo = require("../repositories/folder.repository");

// checks if the home folder exists, if it doesn't it creates it
async function createCollections() {
  try {
    if (!(await FolderRepo.exists({ name: "home" }))) {
      await FolderModel.insertMany({
        name: "home",
        path: path.join(Utils.pathToImages, "home"),
        files: [],
      });
      let homeDir = await FolderRepo.getFolders({ name: "home" }, "name path");
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

async function deleteFolderWithoutExistingCollection() {
  try {
    let folders = Utils.readDirContent(Utils.pathToImages);
    for (let folder of folders) {
      if (!(await FolderRepo.exists({ name: folder }))) {
        Utils.removeDir(Utils.pathToImages, folder);
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
    await deleteFolderWithoutExistingCollection();
  } catch (error) {
    throw new Error(error);
  }
};
