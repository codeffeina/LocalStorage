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

function showSpinner() {
  document.getElementById("loading-folder").style.display = "block";
  document.getElementById("folder-input").style.display = "none";
}
