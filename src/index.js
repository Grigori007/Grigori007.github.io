import * as THREE from 'three';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import "./css/index.css";
import modelPath from './assets/katana.3ds';

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 3;

const scene = new THREE.Scene();
const loader = new TDSLoader();

let loadedModel = null;

loader.load(modelPath, function (object) {
    // Scale or position the model if needed
	loadedModel = object;
	console.log(object)
    object.scale.set(0.01, 0.01, 0.01); // Adjust scaling for large 3ds models

	object.traverse(child => {
		if (child.isMesh) {
		  child.material = new THREE.MeshNormalMaterial(); // For debug visibility
		}
	});

    scene.add(object);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

// animation

function animation( time ) {
	if (loadedModel) {
		loadedModel.rotation.x = time / 2000;
		loadedModel.rotation.y = time / 1000;
	}

	// mesh.rotation.x = time / 2000;
	// mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}