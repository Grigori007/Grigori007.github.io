import { initBaseScene, initCubeScene, disposeModels, disposeWholeScene } from "./cube";

const CubeConfigs = {
    Gold: {
        mainTexturePath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip3/src/assets/textures/v3/simple_gold_texture.png",
        logoPath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip3/src/assets/textures/v3/Zloto.png",
        roughTexturePath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip3/src/assets/textures/v3/simple_rough_texture.png",
        hdrPath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip3/src/assets/textures/v2/GSG_PRO_STUDIOS_METAL_040_sm(2).exr",
        metalness: 0.99,
        roughness: 0.7,
        backgroundColor: 0x192134,
        enableAnimation: false,
        showAnimationControls:  true
    },
    Marble: {
        mainTexturePath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip3/src/assets/textures/v3/green_marble_simple_texture.png",
        logoPath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip3/src/assets/textures/v3/Zloto.png",
        roughTexturePath: null,
        hdrPath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip3/src/assets/textures/v2/GSG_PRO_STUDIOS_METAL_040_sm(2).exr",
        metalness: 0.99,
        roughness: 0.7,
        backgroundColor: 0x192134,
        enableAnimation: false,
        showAnimationControls:  true
    }
};

initBaseScene();
initCubeScene(CubeConfigs.Gold);