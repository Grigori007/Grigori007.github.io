import { initCubeScene } from "./cube";
//import "./css/index.css"

// --- Init localStorage value ---
let toggleAnimation = localStorage.getItem("toggleAnimation");

if (toggleAnimation === null) {
    toggleAnimation = "false";
    localStorage.setItem("toggleAnimation", toggleAnimation);
}
toggleAnimation = (toggleAnimation === "true");

// --- Sync UI with stored value ---
const switchEl = document.getElementById("animationSwitch");
switchEl.checked = toggleAnimation;

// --- Update storage on toggle ---
switchEl.addEventListener("change", () => {
    toggleAnimation = switchEl.checked;
    localStorage.setItem("toggleAnimation", toggleAnimation);
    console.log("toggleAnimation:", toggleAnimation);
    location.reload();
});

initCubeScene(toggleAnimation);