import * as THREE from 'three';
//import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PMREMGenerator } from 'three';
import "./css/index.css";
//import tdsModelPath from './assets/katana.3ds';
// import mustangModelPath from "./assets/mustang_GT.glb";
import mustangModelPath from "./assets/mustang_GT_no_bottom.glb";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
//import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import hdrPath1 from "./assets/qwantani_moonrise_4k.hdr";
// import hdrPath2 from "./assets/HDR_blue_nebulae-1.hdr";
// import exrPath1 from "./assets/NightSkyHDRI009_4K-HDR.exr";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.x = -3;
camera.position.y = 2.2;
camera.position.z = -2.8;

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.75;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true;

const pmrem = new THREE.PMREMGenerator(renderer);
pmrem.compileEquirectangularShader();
//renderer.setAnimationLoop(animation);

// Load HDR environment map
new RGBELoader()
//new EXRLoader()
  .setPath('./assets/') // make sure your HDRI is here
  .load('qwantani_moonrise_4k.hdr', function(hdrTexture) {
    const envMap = pmrem.fromEquirectangular(hdrTexture).texture;
    
    scene.environment = envMap;
    scene.background = envMap;

    hdrTexture.dispose();
    pmrem.dispose();
  });

document.body.appendChild(renderer.domElement);

// Lighting
// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
// scene.add(ambientLight);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
// scene.add(hemiLight);

// const dirLight = new THREE.DirectionalLight(0xffffff, 3);
// dirLight.position.set(10, 10, 10);
// scene.add(dirLight);

//const tdsLoader = new TDSLoader();

// let loadedModel = null;

// tdsLoader.load(tdsModelPath, function (object) {
//     // Scale or position the model if needed
// 	loadedModel = object;
// 	console.log(object)
//     object.scale.set(0.01, 0.01, 0.01); // Adjust scaling for large 3ds models

// 	object.traverse(child => {
// 		if (child.isMesh) {
// 		  child.material = new THREE.MeshNormalMaterial(); // For debug visibility
// 		}
// 	});

//     scene.add(object);
// });
const gltfLoader = new GLTFLoader()
gltfLoader.load(mustangModelPath, function(object) {
	// loadedModel = object;
	//object.scale.set(0.01, 0.01, 0.01); // Adjust scaling for large 3ds models

	scene.add(object.scene);

	const overlay = document.getElementById('loader-overlay');
  	overlay.classList.add('fade-out');
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

// const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

function animation( time ) {
	// if (loadedModel) {
	// 	loadedModel.rotation.x = time / 2000;
	// 	loadedModel.rotation.y = time / 1000;
	// }

	// mesh.rotation.x = time / 2000;
	// mesh.rotation.y = time / 1000;

	renderer.render(scene, camera);
}