const { FolderModel } = require("../models");

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

exports.setup = async function () {
  try {
    await createCollections();
  } catch (error) {
    throw new Error(error);
  }
};
