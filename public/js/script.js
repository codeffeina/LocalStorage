function deleteFile(id) {
  axios({
    method: "delete",
    url: "/app/file",
    params: {
      id,
    },
  }).then((response) => {
    window.location.reload();
  });
}

function deleteFolder(folder) {
  axios({
    method: "delete",
    url: "/app/deleteFolder",
    params: {
      folder,
    },
  }).then((response) => {
    window.location.href = "http://localhost:3001/";
  });
}

function showSpinner() {
  document.getElementById("loading-folder").style.display = "block";
  document.getElementById("folder-input").style.display = "none";
}
