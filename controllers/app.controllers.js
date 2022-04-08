const path = require("path");
const fs = require("fs");
const FileModel = require("../models/file.model");
const pathToHome = path.join(__dirname, "..", "public", "images", "home");

exports.folderViewController = function (req, res) {
  // if the url contains any space, it will be removed and redirect
  if (/%20/.test(req.url)) {
    let folder = req.url.replace(/%20/g, "").substring(1);
    res.redirect("/app/" + folder);
  }
  res.render("folder", { layout: "main", url: req.url });
};

exports.uploadFile = async function (req, res) {
  try {
    const file = req.files.file.file;
    const fileDoc = {};
    await fs.renameSync(file.path, path.join(pathToHome, file.name));

    fileDoc.name = file.name;
    fileDoc.path = path.join(pathToHome, file.name);
    fileDoc.size = file.size;
    fileDoc.type = file.type;
    fileDoc.created_at = new Date();
    fileDoc.folder = req.body.url.substring(1);
    console.log(fileDoc, fileDoc.folder);

    res.redirect("/app/" + fileDoc.folder);
  } catch (err) {
    console.log(err);
    res.redirect("/app/");
  }
};
