const path = require("path");
const fs = require("fs");
const { FileModel, FolderModel } = require("../models/file.model");
const pathToImages = path.join(__dirname, "..", "public", "images");
let FOLDERS = []; // this var will hold the names and IDs of the folders created to avoid ask the db each time

exports.folderViewController = async function (req, res) {
  // if the url contains any space, it will be removed and redirect
  if (/%20/.test(req.url)) {
    let folder = req.url.replace(/%20/g, "").substring(1);
    res.redirect("/app/" + folder);
    return;
  }

  FOLDERS = await FolderModel.find();

  let urlName = req.url.substring(1);
  let folder = FOLDERS.find((folder) => folder.name === urlName);
  if (folder === undefined) {
    return res.redirect("/app/");
  }
  let files = await FileModel.find({ folder_id: folder._id });
  files = files.map((file) => {
    file.url = urlName;
    return file;
  });

  res.render("folder", {
    layout: "main",
    url: urlName,
    FOLDERS,
    files,
  });
};

exports.uploadFile = async function (req, res) {
  try {
    const fileDoc = new FileModel();
    const file = req.files.file.file;
    const { url } = req.body;
    fs.renameSync(file.path, path.join(pathToImages, url, file.name));

    fileDoc.name = file.name;
    fileDoc.path = path.join(pathToImages, url, file.name);
    fileDoc.size = file.size;
    fileDoc.type = file.type.split("/")[0];
    fileDoc.format = file.type.split("/")[1];

    switch (fileDoc.type) {
      case "image":
        fileDoc.isImage = true;
        break;
      case "video":
        fileDoc.isVideo = true;
        break;
      case "audio":
        fileDoc.isAudio = true;
        break;
    }

    // finds the folder this file belongs to
    let folder = FOLDERS.find((folder) => folder.name === url);
    fileDoc.folder_id = folder._id;
    await fileDoc.save();

    res.redirect("/app/" + req.body.url);
  } catch (err) {
    console.log(err);
    res.redirect("/app/");
  }
};

exports.createFolder = async function (req, res) {
  try {
    let { folder, url } = req.body;
    folder = folder.trim().replace(/ /g, "");
    if (folder.length === 0) {
      return res.redirect("/app/");
    }
    fs.mkdirSync(path.join(pathToImages, folder));

    const newFolder = new FolderModel();
    newFolder.name = folder;
    await newFolder.save();

    res.redirect("/app/" + url);
  } catch (error) {
    console.error(error);
    res.redirect("/app/");
  }
};
