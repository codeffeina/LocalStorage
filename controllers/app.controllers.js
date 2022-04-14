const fs = require("fs");
const Utils = require("../utils");
const FileRepo = require("../repositories/file.repository");
const FolderRepo = require("../repositories/folder.repository");
let FOLDERS = []; // this var will hold the names and IDs of the folders created to avoid ask the db each time

function checkUrl(res, url) {
  let checkedUrl = url;
  if (/%20/.test(url)) {
    checkedUrl = req.url.replace(/%20/g, "").substring(1);
  }
  // extract the folder name from the url
  let folder = FOLDERS.find((folder) => folder.name === checkedUrl);
  if (folder === undefined) {
    return res.redirect("/app/home");
  }
}

exports.folderViewController = async function (req, res) {
  try {
    // find all folders in the db
    FOLDERS = await FolderRepo.getFolders({}, "name");
    // if the url contains any space, it will be removed and redirect
    let url = req.url.substring(1);
    // if the url is invalid, the user is redirected
    checkUrl(res, url);
    let folder = FOLDERS.find((folder) => folder.name === url);
    let files = await FileRepo.getFiles({ folder_id: folder._id });
    files = files.map((file) => {
      file.url = url;
      return file;
    });

    res.render("folder", {
      layout: "main",
      url,
      FOLDERS,
      files,
      showMessage: req.app.locals.showMessage,
    });
    // set the showMessage to false after the view have been render
    req.app.locals.showMessage = false;
    req.app.locals.showMessageFolder = false;
    return;
  } catch (error) {
    throw new Error(error);
  }
};

exports.uploadFile = async function (req, res) {
  try {
    const data = req.files.file.file;
    const { url } = req.body;

    // check if the type of the file is allowed
    // file.type = "image/jpg", for instance.
    if (!Utils.allowTypes.includes(data.type.split("/")[0])) {
      fs.rmSync(data.path);
      req.app.locals.showMessage = true;
      res.redirect("/app/" + req.body.url);
      return;
    }
    req.app.locals.showMessage = false;

    await FileRepo.createFile(data, url, FOLDERS);

    res.redirect("/app/" + url);
  } catch (err) {
    console.log(err);
    res.redirect("/app/");
  }
};

exports.createFolder = async function (req, res) {
  let { folder, url } = req.body;
  folder = folder.trim().replace(/ /g, "");
  if (folder.length === 0) {
    return res.redirect("/app/");
  }

  if (Utils.exists(Utils.joinPaths(Utils.pathToImages, folder))) {
    req.app.locals.showMessageFolder = { state: true, folder };
    res.redirect("/app/" + url);
    return;
  }
  try {
    fs.mkdirSync(Utils.joinPaths(Utils.pathToImages, folder));
    await FolderRepo.createFolder({
      name: folder,
      path: Utils.joinPaths(Utils.pathToImages, folder),
    });
    res.redirect("/app/" + url);
  } catch (error) {
    fs.rmdirSync(Utils.joinPaths(Utils.pathToImages, folder));
    console.error(error);
    res.redirect("/app/");
  }
};

exports.deleteFile = async function (req, res) {
  try {
    const { id } = req.query;
    if (id === undefined || !(await FileRepo.existsFile({ _id: id }))) {
      return res.json({
        OK: false,
        status: 404,
        msg: "The file doesn't exists",
      });
    }
    // finds the file in the database
    let file = await FileRepo.findById(id);
    // remove the file from the folder
    fs.rmSync(file.path);
    // remove the file from the database
    await FileRepo.findByIdAndDelete(id);

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
