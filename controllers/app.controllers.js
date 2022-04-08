const path = require("path");
const fs = require("fs");
const { FileModel, FolderModel } = require("../models/file.model");
const pathToHome = path.join(__dirname, "..", "public", "images", "home");
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
  console.log(1, urlName);
  let folder = FOLDERS.find((folder) => folder.name === urlName);
  let files = await FileModel.find({ folder_id: folder._id });
  files = files.map((file) => {
    file.url = urlName;
    return file;
  });
  // console.log("files", files);

  res.render("folder", {
    layout: "main",
    url: urlName,
    FOLDERS,
    files,
  });
};

exports.uploadFile = async function (req, res) {
  try {
    const file = req.files.file.file;
    const { url } = req.body;
    await fs.renameSync(file.path, path.join(pathToHome, file.name));
    const fileDoc = new FileModel();

    // console.log("Extracting url", url);

    fileDoc.name = file.name;
    fileDoc.path = path.join(pathToHome, file.name);
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

    // console.log("Folders", FOLDERS);
    // finds the folder this file belongs to
    let folder = FOLDERS.find((folder) => folder.name === url);
    // console.log("folder found ?", folder);
    fileDoc.folder_id = folder._id;
    await fileDoc.save();
    console.log(fileDoc);

    res.redirect("/app/" + req.body.url);
  } catch (err) {
    console.log(err);
    res.redirect("/app/");
  }
};
