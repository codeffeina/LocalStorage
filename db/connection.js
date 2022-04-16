let { setup } = require("./dbSetup");
const { connect } = require("mongoose");
const { DB_HOST, DB_PORT, DB_NAME } = process.env;

async function setupDB() {
  try {
    await connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    console.log("Database connection!");
    await setup();
  } catch (err) {
    console.error(err);
    return;
  }
}

setupDB();
