const url = window.location.pathname.split("/")[2];
const linkActive = document.getElementById(url);
linkActive.classList.add("active");
linkActive.setAttribute("aria-current", "page");
console.log(linkActive);
