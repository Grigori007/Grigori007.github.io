import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import bossaAnimacjaModelPath from "./assets/BOSSA_ANIMACJA.glb";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, mixer, clock;

clock = new THREE.Clock();

scene = new THREE.Scene();
scene.background = new THREE.Color(0x555555);

// Camera
camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 100000
);
camera.position.set(0, 1.5, 3);

// Renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(2, 2, 5);
scene.add(light);

const loader = new GLTFLoader();

loader.load(
  bossaAnimacjaModelPath,
  (gltf) => {
    const model = gltf.scene;
    // scaleModel(model);
    console.log(model);
    scene.add(model);

    //
    model.traverse((obj) => {
      //console.log(obj);
    if (obj.isMesh && obj.morphTargetInfluences) {
      // Set morph to 50%
      // console.log(obj);
      //obj.morphTargetInfluences[0] = 0.5; 
    }
  });
    //

    // Set up animation mixer
    mixer = new THREE.AnimationMixer(model);

    console.log(gltf.animations);

    // Play all animations (you can pick one instead)
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  },
  undefined,
  (error) => {
    console.error('Error loading GLB:', error);
  }
);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(10, 10, 10);

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
  controls.update();
}

function scaleModel(model) {
  // Compute bounding box
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  // Center the model
  model.position.sub(center);

  // Scale the model to fit into view
  const maxDimension = Math.max(size.x, size.y, size.z);
  const scaleFactor = 100 / maxDimension; // Adjust 2 for how "big" you want it
  model.scale.setScalar(scaleFactor);
}




animate();