import * as THREE from 'three';

    import Stats from 'three/addons/libs/stats.module.js';

    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
    import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
    import {GLTFLoader} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


    let renderer, scene, camera, mixer;
    let stats, meshKnot, fish;

function lerp(x, y, a) {
    return (1 - a) * x + a * y
}

function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start)
}

const animationScripts = []



function playScrollAnimations() {
    animationScripts.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func()
        }
    })
}

let scrollPercent = 0

document.body.onscroll = () => {
    scrollPercent =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight || document.body.scrollHeight) -
                document.documentElement.clientHeight)) * 300
    document.getElementById('scrollProgress').innerText =
        'Scroll : ' + scrollPercent.toFixed(2)
}

    init();

    function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    document.body.appendChild( renderer.domElement );


    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 5, - 15 );

    scene = new THREE.Scene();

    RectAreaLightUniformsLib.init();

    const rectLight1 = new THREE.RectAreaLight( 0xff0000, 5, 4, 10 );
    rectLight1.position.set( - 5, 5, 5 );
    scene.add( rectLight1 );

    const rectLight2 = new THREE.RectAreaLight( 0x00ff00, 5, 4, 10 );
    rectLight2.position.set( 0, 5, 5 );
    scene.add( rectLight2 );

    const rectLight3 = new THREE.RectAreaLight( 0x0000ff, 5, 4, 10 );
    rectLight3.position.set( 5, 5, 5 );
    scene.add( rectLight3 );

    scene.add( new RectAreaLightHelper( rectLight1 ) );
    scene.add( new RectAreaLightHelper( rectLight2 ) );
    scene.add( new RectAreaLightHelper( rectLight3 ) );

    const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
    const matStdFloor = new THREE.MeshStandardMaterial( { color: 0xbcbcbc, roughness: 0.1, metalness: 0 } );
    const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    scene.add( mshStdFloor );

    const geoKnot = new THREE.TorusKnotGeometry( 1.5, 0.5, 200, 16 );
    const matKnot = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );
    meshKnot = new THREE.Mesh( geoKnot, matKnot );
    meshKnot.position.set( 0, 5, 0 );
    scene.add( meshKnot );

        const loader = new GLTFLoader().setPath("../threejs/models/");
        loader.load("clown_fish.glb", function (gltf) {
            const { animations } = gltf;
            fish = gltf.scene;
            mixer = new THREE.AnimationMixer(fish);
            animations.forEach( function ( clip ) {
                mixer.clipAction( clip ).play();
            } );
            animations.clampWhenFinished = true;
            scene.add(fish);
            fish.position.set( 0, 5, 0 )
            fish.rotation.y = Math.PI/2

        });

        // animationScripts.push({
        //     start: 0,
        //     end: 300,
        //     func: () => {
        //         fish.rotation.y += -0.002
        //     }
        // })

        const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.copy( meshKnot.position );
    controls.update();

    //

    window.addEventListener( 'resize', onWindowResize );

    stats = new Stats();
    document.body.appendChild( stats.dom );

}

    function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = ( window.innerWidth / window.innerHeight );
    camera.updateProjectionMatrix();

}

    function animation( time ) {

    meshKnot.rotation.y = time / 1000;
    playScrollAnimations()
    renderer.render( scene, camera );

    stats.update();

}
