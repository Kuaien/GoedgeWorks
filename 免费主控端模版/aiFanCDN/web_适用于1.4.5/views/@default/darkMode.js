// set class on html "dark/light"
document.documentElement.classList.remove("light");
document.documentElement.classList.remove("dark");

let darkMode = localStorage.getItem("teaDarkMode");
if (darkMode === "dark") {
  document.documentElement.classList.add("dark");
}else{
  document.documentElement.classList.add("light");
}