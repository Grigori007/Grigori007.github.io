import { TextureLoader, MeshStandardMaterial, MeshBasicMaterial, Mesh, Vector3, Euler, PlaneGeometry } from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

const textureLoader = new TextureLoader();

export function loadTexture(mapTexturePath, roughTexturePath, model, metalness, roughness) {
    const customMaterial = new MeshStandardMaterial({
        map: textureLoader.load(mapTexturePath),
        //map: textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png'),
        metalness: metalness,
        roughness: roughness,
        flatShading: false
    });

    if (roughTexturePath) {
        customMaterial.roughnessMap = textureLoader.load(roughTexturePath);
    }

    customMaterial.needsUpdate = true;

    model.traverse((child) => {
        console.log(child);
    });

    model.traverse((child) => {
        if (child.isMesh) {
            child.material = customMaterial;
            child.material.needsUpdate = true;
        }
    });
}

export function loadLogo(model, logoPath, renderLogoOnBothSides = true) {
    const overlayMaterialWithLogo = new MeshBasicMaterial({
        map: textureLoader.load(logoPath),
        transparent: true
    });

    const plane = new Mesh(new PlaneGeometry(0.98, 0.98), overlayMaterialWithLogo);
    plane.position.y = -0.51;
    plane.rotation.x = Math.PI / 2;
    plane.rotation.z = Math.PI;
    model.add(plane);

    if (renderLogoOnBothSides) {
        const plane2 = new Mesh(new PlaneGeometry(0.98, 0.98), overlayMaterialWithLogo);
        plane2.position.y = 0.51;
        plane2.rotation.x = Math.PI / 2;
        plane2.rotation.z = Math.PI;
        plane2.rotation.y = Math.PI;
        model.add(plane2);
    }
}