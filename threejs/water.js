import * as THREE from 'three';

    import Stats from 'three/addons/libs/stats.module.js';

    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
    import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
    import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let clock, controls, scene, camera, renderer, mixer, mixer2, model;


initScene();
animate();

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.outputEncoding = THREE.sRGBEncoding;    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    document.body.appendChild(renderer.domElement);

    renderer.setSize(window.innerWidth, window.innerHeight);
}

scene.background = new THREE.Color("#f8edeb");

// LIGHT
const light = new THREE.AmbientLight(0xffffff,.1);


//HELPERS
const axesHelper = new THREE.AxesHelper(5);
let gridHelper = new THREE.GridHelper(30, 30);

scene.add(light, axesHelper, gridHelper);

//GLTF START

const GLTFloader = new GLTFLoader().setPath('../threejs/models/');

GLTFloader.load('goldyFish_red.glb', function (gltf) {
    model = gltf;

    mixer = new THREE.AnimationMixer(gltf.scene);

    mixer.clipAction(gltf.animations[0]).play();

    model.scene.position.set(3,4,1)
    scene.add(model.scene);
});

GLTFloader.load('goldyFish_blue.glb', function (gltf) {
    model = gltf;

    mixer2 = new THREE.AnimationMixer(gltf.scene);

    mixer2.clipAction(gltf.animations[0]).play()

    model.scene.position.set(-3,4,1)
    scene.add(model.scene);
});


camera.position.set(0, 20, 50);


function animate() {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();

    if (mixer) {
        mixer.update(delta);
    }
    if (mixer2) {
        mixer2.update(delta + 22000)
    }

    renderer.render(scene, camera);


}