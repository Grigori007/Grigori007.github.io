import { initBaseScene, initCubeScene, initAnimationToggleWidget, disposeModels } from "./cube";
import mainTexturePath from "./assets/textures/v3/simple_gold_texture.png";
import greenMarbleTexturePath from "./assets/textures/v3/green_marble_simple_texture.png";
import roughTexturePath from "./assets/textures/v3/simple_rough_texture.png";
import logoPath from "./assets/textures/v3/Zloto.png";

const toggleAnimation = initAnimationToggleWidget();

const CubeConfigs = {
    // Gold: {
    //     cubeModelPath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip2/src/assets/kostka.glb",
    //     mainTexturePath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip2/src/assets/textures/v2/bake_specColor_mirror_wiekszy_napis_small.png",
    //     gifPath: "todo",
    //     roughTexturePath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip2/src/assets/textures/v2/bake_rough_gold-gray.png",
    //     hdrPath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip2/src/assets/textures/v2/GSG_PRO_STUDIOS_METAL_040_sm(2).exr",
    //     toggleAnimation: toggleAnimation,
    //     metalness: 0.99,
    //     roughness: 0.7,
    //     backgroundColor: 0x192134
    // }
    Gold: {
        mainTexturePath: mainTexturePath,
        logoPath: logoPath,
        roughTexturePath: roughTexturePath,
        hdrPath: "https://cdn.jsdelivr.net/gh/Grigori007/Grigori007.github.io@wip2/src/assets/textures/v2/GSG_PRO_STUDIOS_METAL_040_sm(2).exr",
        toggleAnimation: toggleAnimation,
        metalness: 0.99,
        roughness: 0.7,
        backgroundColor: 0x192134
    }
};

initBaseScene();
initCubeScene(CubeConfigs.Gold);