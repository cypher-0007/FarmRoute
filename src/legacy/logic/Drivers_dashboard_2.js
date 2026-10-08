

export function initialize() {

    const sideBar = document.getElementById("side-bar");
    const sideBtn = document.getElementById("side-btn");
    const closeSide = document.getElementById("closeside-btn");

    // CLOSE & OPEN SIDE-BAR
    sideBtn.addEventListener("click", () => sideBar.classList.remove("max-md:hidden"))
    closeSide.addEventListener("click", () => sideBar.classList.add("max-md:hidden"))

    // ONLINE / OFFLINE TOGGLE
    const goOnlineBtn = document.getElementById("go-online-btn");
    const onlineLabel = document.getElementById("online-label");
    let isOnline = false;

    goOnlineBtn.addEventListener("click", () => {
        isOnline = !isOnline;
        if (isOnline) {
            onlineLabel.textContent = "Online — Visible to Farmers";
            goOnlineBtn.classList.remove("bg-green-600", "hover:bg-green-500");
            goOnlineBtn.classList.add("bg-gray-700", "hover:bg-gray-600");
        } else {
            onlineLabel.textContent = "Go Online";
            goOnlineBtn.classList.remove("bg-gray-700", "hover:bg-gray-600");
            goOnlineBtn.classList.add("bg-green-600", "hover:bg-green-500");
        }
    });

  return {};
}
