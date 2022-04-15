let { setup } = require("./dbSetup");
const { connect } = require("mongoose");

async function setupDB() {
  try {
    await connect("mongodb://localhost:27017/LocalStorage");
    console.log("Database connection!");
    await setup();
  } catch (err) {
    console.error(err);
    return;
  }
}

setupDB();
