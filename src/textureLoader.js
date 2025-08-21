import { TextureLoader, MeshStandardMaterial } from 'three';

const textureLoader = new TextureLoader();

export function loadTexture(texturePath, model, metalness, roughness, anisotropy = undefined) {
    textureLoader.load(texturePath, (texture) => {
        model.traverse((child) => {
            if (child.isMesh) {
                if (anisotropy != null) {
                    texture.anisotropy = anisotropy;
                }

                child.material = new MeshStandardMaterial({
                    map: texture,
                    metalness: metalness,
                    roughness: roughness,
                    flatShading: false
                });

                child.material.needsUpdate = true;
            }
        });
    });
}