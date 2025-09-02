import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { loadTexture } from "./textureLoader";
import { initOrbitControls } from "./orbitControls";
import { initRotationByMouseDragging } from "./dragRotation";

export function initCubeScene(modelPath, specularTexturePath, roughTexture, hdrPath, renderWithAnimation, renderNonEnvMapLights = false, showLightVectors = false) {
    // Clock
    const clock = new THREE.Clock();

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x192134)

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    // camera.position.set(2, 0, 1);
    camera.position.set(2, 0, 1);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // HDR
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

        // Load HDR environment map
    const exrLoader = new EXRLoader();
    //const rgbeLoader = new RGBELoader();
    exrLoader.load(hdrPath, function(hdrTexture) {
        const envMap = pmrem.fromEquirectangular(hdrTexture).texture;
        
        scene.environment = envMap;
        //scene.background = envMap;

        hdrTexture.dispose();
        pmrem.dispose();
    });

    // Attach renderer to HTML document
    document.body.appendChild(renderer.domElement);

    if (renderNonEnvMapLights) {
        // Lights 
        const hemishpereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5)
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        const light = new THREE.DirectionalLight(0xffffff, 0.1);
        const light2 = new THREE.DirectionalLight(0xffffff, 0.1);

        hemishpereLight.position.set(0, 20, 0);
        light.position.set(5, 5, 10);
        light2.position.set(5, 5, -5);

        // Attach light to the scene
        scene.add(hemishpereLight);
        scene.add(light);
        scene.add(light2);
        scene.add(ambientLight);

        if (showLightVectors) {
            const lightHelper = new THREE.DirectionalLightHelper(light, 0.1);
            const light2Helper = new THREE.DirectionalLightHelper(light2, 0.1);

            scene.add(lightHelper);
            scene.add(light2Helper);
        }
    }

    // GLB/GLTF loader
    const loader = new GLTFLoader();

    let velocityRef = null;
    let model = null;
    let dampingRef = 1;
    loader.load(modelPath,
        (gltf) => {
            model = gltf.scene;

            centerModelAtOrigin(model);

            loadTexture(specularTexturePath, roughTexture, model, 0.99, 0.7, null);

            // Add model to scene
            scene.add(model);

            const { velocity, damping } = initRotationByMouseDragging(renderer, model);
            dampingRef = damping;
            velocityRef = velocity;
        },
        undefined,
        (error) => console.log(`Error while loading .glb file: ${error}`)
    );

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Controls
    initOrbitControls(renderer, camera);

    function centerModelAtOrigin(model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center); // Moving model to (0, 0, 0)

        // Adjusting initial position
        model.rotation.x = - 4.5 * Math.PI;
        model.rotation.y = - 1 * Math.PI;
        model.rotation.z =  - 0.5 * Math.PI;

        // model.rotation.x = - 4.5 * Math.PI;
        // model.rotation.y = - 1 * Math.PI;
        // model.rotation.z =  - 2.0 * Math.PI;
    }

    function renderWithoutRotation() {
        requestAnimationFrame(renderWithoutRotation);
        renderer.render(scene, camera);
    }

    function renderWithMouseDragging() {
        requestAnimationFrame(renderWithMouseDragging);

        if (model && velocityRef) {
            model.rotation.z -= velocityRef.z * 0.005; // horizontal drag rotates around Y
            model.rotation.y += velocityRef.y * 0.005; // vertical drag rotates around X

            // Apply damping (slowly reduce velocity)
            velocityRef.z *= dampingRef;
            velocityRef.y *= dampingRef;
        }

        renderer.render(scene, camera);
    }

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

    if (renderWithAnimation) {
        renderWithRotation();
    }
    else {
        //renderWithMouseDragging();
        renderWithoutRotation();
    }
}
