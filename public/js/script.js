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
