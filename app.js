require("dotenv").config();
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const express = require("express");
const routes = require("./routes/app.routes");
const app = express();

// Settings
fs.mkdirSync(path.join(__dirname, "public", "images"));
fs.mkdirSync(path.join(__dirname, "public", "images", "home"));
app.set("view engine", "hbs");
app.set("port", process.env.PORT || 3001);

// Middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.redirect("/app/home");
});
app.use("/app", routes);

// Initialization
app.listen(app.get("port"), () => {
  console.log(`Listening on port ${app.get("port")}`);
});
