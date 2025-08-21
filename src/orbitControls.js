import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initOrbitControls(renderer, camera) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    controls.target.set(0, 0, 0);
    controls.update();
}