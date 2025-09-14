import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { loadTexture, loadLogo } from "./textureLoader";
import { centerModel } from "./orbitControls";
import { initRotationByMouseDragging } from "./dragRotation";

let scene = null;
let camera = null;
let renderer = null;
let enableAnimationManually = false;

const ObjectName = "CUBE";

export function initBaseScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    camera.position.set(2, 0, 1);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

export function initCubeScene(sceneConfig) {
    const {
        mainTexturePath,
        roughTexturePath,
        logoPath,
        hdrPath,
        metalness,
        roughness,
        backgroundColor,
        enableAnimation,
        showAnimationControls,
        rednerLogoOnBothSides,
        envLightXRotationInPiRadians,
        envLightYRotationInPiRadians
    } = sceneConfig;

    if (!enableAnimation && showAnimationControls) {
        renderUIForTogglingAnimation();
    }

    // Clock
    const clock = new THREE.Clock();

    // Background
    scene.background = new THREE.Color(backgroundColor);

    // HDR
    const pmrem = new THREE.PMREMGenerator(renderer);
    //pmrem.compileEquirectangularShader();

    // Load HDR environment map
    const exrLoader = new EXRLoader();
    exrLoader.load(hdrPath, function(hdrTexture) {
        hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

        // Background mesh
        const backgroundGeo = new THREE.SphereGeometry(100, 64, 64);
        backgroundGeo.scale(-1, 1, 1); // flip normals inward
        const backgroundMat = new THREE.MeshBasicMaterial({ map: hdrTexture });
        const backgroundMesh = new THREE.Mesh(backgroundGeo, backgroundMat);

        // Rotate the background + lightning
        backgroundMesh.rotation.x = envLightXRotationInPiRadians * Math.PI;
        backgroundMesh.rotation.y = envLightYRotationInPiRadians * Math.PI;
        scene.add(backgroundMesh);

        // Lightning environment (PMREM)
        const tmpScene = new THREE.Scene();
        tmpScene.add(backgroundMesh.clone()); // clone with the same rotation
        const envMap = pmrem.fromScene(tmpScene).texture;

        backgroundMesh.removeFromParent();

        //const envMap = pmrem.fromEquirectangular(hdrTexture).texture;
        scene.environment = envMap;
        //scene.background = envMap;

        hdrTexture.dispose();
        pmrem.dispose();
    });

    //let velocityRef = null;
    //let dampingRef = 1;
    let model = new THREE.Mesh(new RoundedBoxGeometry(
        1,   // width
        1,   // height
        1,   // depth
        5,   // segments per edge (higher = smoother corners)
        0.04  // corner radius
    )); 

    centerModelAtOrigin(model);
    loadTexture(mainTexturePath, roughTexturePath, model, metalness, roughness);

    model.name = ObjectName;
    scene.add(model);

    loadLogo(model, logoPath, rednerLogoOnBothSides);

    const { velocity, damping } = initRotationByMouseDragging(renderer, model);
    //dampingRef = damping;
    //velocityRef = velocity;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function centerModelAtOrigin(model) {
        centerModel(renderer, camera);

        // Adjusting initial position
        model.rotation.x = - 4.5 * Math.PI;
        model.rotation.y = - 1 * Math.PI;
        model.rotation.z = - 0.5 * Math.PI;
    }

    function renderWithoutRotation() {
        requestAnimationFrame(renderWithoutRotation);
        renderer.render(scene, camera);
    }

    //#region Dragging with intertia @TODO
    // function renderWithMouseDragging() {
    //     requestAnimationFrame(renderWithMouseDragging);

    //     if (model && velocityRef) {
    //         model.rotation.z -= velocityRef.z * 0.005; // horizontal drag rotates around Y
    //         model.rotation.y += velocityRef.y * 0.005; // vertical drag rotates around X

    //         // Apply damping (slowly reduce velocity)
    //         velocityRef.z *= dampingRef;
    //         velocityRef.y *= dampingRef;
    //     }

    //     renderer.render(scene, camera);
    // }
    //#endregion

    function renderWithRotation() {
        requestAnimationFrame(renderWithRotation);

        if (model) {
            const delta = clock.getDelta();
            //model.rotation.x += delta * 0.5; // radians per second
            model.rotation.y += delta * 0.5;
            model.rotation.z += delta * 0.5;
        }

        renderer.render(scene, camera);
    }

    if (enableAnimationManually || enableAnimation) {
        renderWithRotation();
    }
    else {
        //renderWithMouseDragging();
        renderWithoutRotation();
    }
}

export function disposeModels() {
    const objectToRemove = scene.getObjectByName(ObjectName);
    scene.remove(objectToRemove);

    scene.traverse(child => {
        if (child.isMesh && child.geometry) {
            child.geometry.dispose();
        }

        if (Array.isArray(child.material)) {
            child.material.forEach((material) => disposeMaterial(material));
        } else if (child.material) {
            disposeMaterial(child.material);
        }
    });

    function disposeMaterial(material) {
        for (const key in material) {
            if (material[key] && material[key].isTexture) {
                material[key].dispose();
            }
        }

        material.dispose();
    }
}

export function disposeWholeScene() {
    // Clear models and materials
    disposeModels();

    // Clear scene elements
    scene && scene.clear();

    // Clear renderer
    renderer && renderer.renderLists.dispose();

    scene = null;
    camera = null;
    renderer = null;
}

function renderUIForTogglingAnimation() {
    const span = document.createElement("span");
    span.className = "slider";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "animationSwitch";

    input.checked = (localStorage.getItem("toggleAnimation") === "true");

    input.addEventListener("change", () => {
        const checked = input.checked;
        localStorage.setItem("toggleAnimation", checked);
        location.reload();
    });

    const label = document.createElement("label");
    label.className = "switch";

    const h2 = document.createElement("h2");
    h2.innerText = "Animation Toggle";

    const div = document.createElement("div");
    div.id = "ui";

    label.appendChild(input);
    label.appendChild(span);
    div.appendChild(h2);
    div.appendChild(label);
    document.body.appendChild(div);

    let toggleAnimation = localStorage.getItem("toggleAnimation");

    if (toggleAnimation === null) {
        toggleAnimation = "false";
        localStorage.setItem("toggleAnimation", toggleAnimation);
    }

    enableAnimationManually = (toggleAnimation === "true");
}