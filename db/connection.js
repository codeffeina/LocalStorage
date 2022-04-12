const { connect } = require("mongoose");
const { FolderModel } = require("../models");

async function setupDB() {
  try {
    await connect("mongodb://localhost:27017/CloudStorage");
    if (!(await FolderModel.exists({ name: "home" }))) {
      await FolderModel.insertMany({ name: "home" });
    }
    console.log("Database connection!");
  } catch (err) {
    console.error(err);
    return;
  }
}

setupDB();
