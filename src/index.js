import { initCubeScene } from "./cube";
import cubeModelPath from "./assets/kostka.glb";
import goldWithCaptionTexture from "./assets/textures/v2/bake_specColor_mirror_wiekszy_napis_small.png";
//import goldWithCaptionTexture from "./assets/textures/bake_specColor_mirror_wiekszy_napis.png";
// import roughTexture from "./assets/textures/v2/bake_rough_gold_small.png";
//import roughTexture from "./assets/textures/v2/bake_rough_gold.jpg";

//import roughTexture from "./assets/textures/bake_rough_gold.png";
//import roughTexture from "./assets/textures/v2/bake_rough_gold_jasne.jpg"; // to moze byc w razie czego na jutro
//import roughTexture from "./assets/textures/v2/bake_rough_gold-dark.png";
//import roughTexture from "./assets/textures/v2/bake_rough_gold-light_2.png";
//import roughTexture from "./assets/textures/v2/bake_rough_gold-dark_2.png";
import roughTexture from "./assets/textures/v2/bake_rough_gold-gray.png";
//import hdr from "./assets/textures/moon_lab_1k.hdr";
//import hdr from "./assets/textures/v2/GSG_PRO_STUDIOS_METAL_040_sm_obrot.exr";

import hdr from "./assets/textures/v2/GSG_PRO_STUDIOS_METAL_040_sm(2).exr";
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
    location.reload();
});

initCubeScene(cubeModelPath, goldWithCaptionTexture, roughTexture, hdr, toggleAnimation);