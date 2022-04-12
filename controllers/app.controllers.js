const path = require("path");
const fs = require("fs");
const { FileModel, FolderModel } = require("../models/");
const Utils = require("../utils");
let FOLDERS = []; // this var will hold the names and IDs of the folders created to avoid ask the db each time

exports.folderViewController = async function (req, res) {
  // if the url contains any space, it will be removed and redirect
  if (/%20/.test(req.url)) {
    let folder = req.url.replace(/%20/g, "").substring(1);
    res.redirect("/app/" + folder);
    return;
  }

  // find all folders in the db
  FOLDERS = await FolderModel.find().select("name").lean();
  console.log(FOLDERS);

  // extract the folder name from the url
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
    showMessage: req.app.locals.showMessage,
  });
  // set the showMessage to false after the view have been render
  req.app.locals.showMessage = false;
  req.app.locals.showMessageFolder = false;
  return;
};

exports.uploadFile = async function (req, res) {
  try {
    const fileDoc = new FileModel();
    const file = req.files.file.file;
    const { url } = req.body;

    // check if the type of the file is allowed
    // file.type = "image/jpg", for instance.
    if (!Utils.allowTypes.includes(file.type.split("/")[0])) {
      fs.rmSync(file.path);
      req.app.locals.showMessage = true;
      res.redirect("/app/" + req.body.url);
      return;
    }
    req.app.locals.showMessage = false;
    Utils.renameTo(file.path, path.join(Utils.pathToImages, url, file.name));

    fileDoc.name = file.name;
    fileDoc.path = path.join(Utils.pathToImages, url, file.name);
    fileDoc.size = file.size;
    fileDoc.type = file.type.split("/")[0];
    fileDoc.format = file.type.split("/")[1];
    // set the type of the file
    Utils.setType(fileDoc);
    // finds the folder this file belongs to
    Utils.setFolder(FOLDERS, fileDoc);
    // saved the document in the database
    await fileDoc.save();

    res.redirect("/app/" + url);
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

    if (Utils.exists(path.join(pathToImages, folder))) {
      req.app.locals.showMessageFolder = { state: true, folder };
      res.redirect("/app/" + url);
      return;
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

exports.deleteFile = async function (req, res) {
  try {
    const { id } = req.query;
    if (id === undefined || !FileModel.exists({ _id: id })) {
      return res.json({
        OK: false,
        status: 404,
        msg: "The file doesn't exists",
      });
    }
    // finds the file in the database
    let file = await FileModel.findById(id);
    // remove the file from the folder
    fs.rmSync(file.path);
    // remove the file from the database
    await FileModel.findByIdAndDelete(id);

    return res.json({
      OK: true,
      status: 200,
      msg: "File remove successfully!",
    });
  } catch (error) {
    console.error(error);
    res.json({ OK: false, status: 500, msg: "We couldn't remove the file" });
  }
};
