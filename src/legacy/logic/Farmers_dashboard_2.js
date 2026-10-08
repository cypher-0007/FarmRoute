

export function initialize() {

    const sideBar = document.getElementById("side-bar");
    const sideBtn = document.getElementById("side-btn");
    const closeSide = document.getElementById("closeside-btn");
    
    sideBtn.addEventListener("click", () => sideBar.classList.remove("max-md:hidden"))
    closeSide.addEventListener("click", () => sideBar.classList.add("max-md:hidden"))

  return {};
}
