const path = require("path");
const multiparty = require("connect-multiparty");
const { Router } = require("express");
const router = Router();
const ViewController = require("../controllers/app.controllers");

// This middleware will be use to upload the files to the folders, by default to 'home'
const multipartyMiddleware = multiparty({
  uploadDir: path.join(__dirname, "..", "public", "images", "home"),
});

router.get("/", (req, res) => {
  res.redirect("/app/home");
});

router.get("/:folder", ViewController.folderViewController);

router.post("/upload-file", multipartyMiddleware, ViewController.uploadFile);

module.exports = router;
