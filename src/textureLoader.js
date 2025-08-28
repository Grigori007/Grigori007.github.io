import { TextureLoader, MeshStandardMaterial, Mesh } from 'three';

const textureLoader = new TextureLoader();

export function loadTexture(mapTexturePath, roughTexturePath, model, metalness, roughness, anisotropy = undefined) {
    const customMaterial = new MeshStandardMaterial({
        map: textureLoader.load(mapTexturePath),
        roughnessMap: textureLoader.load(roughTexturePath),
        metalness: metalness,
        roughness: roughness,
        flatShading: false
    });

    customMaterial.needsUpdate = true;

    model.traverse((child) => {
        if (child.isMesh) {
            if (anisotropy != null) {
                texture.anisotropy = anisotropy;
            }

            child.material = customMaterial;
            child.material.needsUpdate = true;
        }
    });

}