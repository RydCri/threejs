import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';


const params = {
    threshold: 0.74,
    strength: 0.315,
    radius: 0,
    exposure: 1
};
    let camera,
        composer,
        clock,
        delta,
        meshKnot,
        light1,
        light2,
        light3,
        light4,
        renderer,
        stats;

    let mixer, mixer2, mixer3
init()
function init() {

    const container = document.getElementById( 'container' );

    stats = new Stats();
    container.appendChild( stats.dom );

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild( renderer.domElement );

    const scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set(0, 13, -55);
    camera.lookAt(0,0,0)
    scene.add( camera );

    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.maxPolarAngle = Math.PI * 0.5;

    // scene.add( new THREE.AmbientLight( 0xcccccc ) );

    const pointLight = new THREE.PointLight( 0xffffff, 10 );
    camera.add( pointLight );

    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), .815, 0.1, 0.9 );
    // bloomPass.threshold = params.threshold;
    // bloomPass.strength = params.strength;
    // bloomPass.radius = params.radius;

    const outputPass = new OutputPass();

    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    composer.addPass( outputPass );
    function playScrollAnimations() {
        animationScripts.forEach((a) => {
            if (scrollPercent >= a.start && scrollPercent < a.end) {
                a.func()
            }
        })
    }

    let scrollPercent = 0

    document.body.onscroll = () => {
        //calculate the current scroll progress as a percentage
        scrollPercent =
            ((document.documentElement.scrollTop || document.body.scrollTop) /
                ((document.documentElement.scrollHeight || document.body.scrollHeight) -
                    document.documentElement.clientHeight)) * 100
        document.getElementById('scrollProgress').innerText =
            'Scroll Progress : ' + scrollPercent.toFixed(2)
    }
    function update() {
        renderer.render(scene, camera);
    }
    //lights
    // const sphere = new THREE.SphereGeometry( 0.05, 16, 8 );
    //
    // light1 = new THREE.PointLight( 0xff0040,.01);
    // light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    // scene.add( light1 );
    //
    // light2 = new THREE.PointLight( 0x0040ff,.01);
    // light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
    // scene.add( light2 );
    //
    // light3 = new THREE.PointLight( 0x80ff80,.01);
    // light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
    // scene.add( light3 );
    //
    // light4 = new THREE.PointLight( 0xffaa00,.01);
    // light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
    // scene.add( light4 );

    RectAreaLightUniformsLib.init();

    const rectLight1 = new THREE.RectAreaLight(0xff00ff, 8, 40, 40);
    rectLight1.position.set(25, 20, 0);
    rectLight1.rotateX(Math.PI / 180 * -90)
    rectLight1.rotateZ(Math.PI/2)
    scene.add(rectLight1);

    // const rectLight2 = new THREE.RectAreaLight(0x000000, 5, 4, 10);
    // rectLight2.position.set(0, 5, 5);
    // scene.add(rectLight2);

    const rectLight3 = new THREE.RectAreaLight(0x200589, 8, 40, 40);
    rectLight3.position.set(-25, 20, 0);
    // rectLight3.rotation.y = Math.PI/2
    rectLight3.rotateX(Math.PI / 180 * -90)
    rectLight3.rotateZ(Math.PI/2)
    scene.add(rectLight3);

    // scene.add(new RectAreaLightHelper(rectLight1));
    // scene.add(new RectAreaLightHelper(rectLight2));
    // scene.add(new RectAreaLightHelper(rectLight3));

    // const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
    // const matStdFloor = new THREE.MeshStandardMaterial({color: 0xbcbcbc, roughness: 0.1, metalness: 1});
    // const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
    // scene.add(mshStdFloor);

    // const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16);
    // const matKnot = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0, metalness: 0});
    // meshKnot = new THREE.Mesh(geoKnot, matKnot);
    // meshKnot.position.set(0, 5, 0);
    // scene.add(meshKnot);




    const someFish = new GLTFLoader().setPath('../threejs/models/')
    someFish.load( 'justGreen.glb', function ( gltf ) {

        const model = gltf.scene;
        model.position.set(0,0,0)
        scene.add( model );

        mixer = new THREE.AnimationMixer( model );
        const clip = gltf.animations[ 0 ];
        mixer.clipAction( clip.optimize() ).play();

        animate();
},
function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error) {
    console.log(error);
}
);
    someFish.load( 'justRed.glb', function ( gltf ) {

            const model = gltf.scene;
            model.position.set(2,10,-62)
            scene.add( model );

            mixer2 = new THREE.AnimationMixer( model );
            mixer2.timeScale = 0.80
            const clip = gltf.animations[ 0 ];
            mixer2.clipAction( clip.optimize() ).play();

            animate();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log(error);
        }
    );
    someFish.load( 'justBlue.glb', function ( gltf ) {

            const model = gltf.scene;
            model.position.set(0,0,0)
            scene.add( model );

            mixer3 = new THREE.AnimationMixer( model );
            const clip = gltf.animations[ 0 ];
            mixer3.timeScale = 0.72
            mixer3.clipAction( clip.optimize()).play();

            animate();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log(error);
        }
    );

// let goldy = new GLTFLoader().setPath("../threejs/models/");
    // goldy.load("goldyFish_red.glb", function (gltf) {
    //     const {animations} = gltf;
    //     goldy = gltf.scene;
    //     goldy.position.set(0,22,10)
    //     goldy.scale.set(.4, .4, .4)
    //     mixer = new THREE.AnimationMixer(goldy);
    //     animations.forEach(function (clip) {
    //         mixer.clipAction(clip).play();
    //     });
    //     animations.clampWhenFinished = true;
    //     scene.add(goldy);
    // });


    //
    // let galaxy = new GLTFLoader().setPath("../threejs/models/");
    // galaxy.load("someFish.glb", function (gltf) {
    //     const {animations} = gltf;
    //     galaxy = gltf.scene;
    //     galaxy.scale.set(10,10,10)
    //     galaxy.position.set(-20,0,5)
    //     mixer = new THREE.AnimationMixer(galaxy);
    //     animations.forEach(function (clip) {
    //         mixer.clipAction(clip).play();
    //     });
    //     animations.clampWhenFinished = true;
    //     scene.add(galaxy);
    // });

    // const ambientLight = new THREE.AmbientLight(0x555555)
    // scene.add(ambientLight);


    /* Liner Interpolation
    * lerp(min, max, ratio)
    * eg,
    * lerp(20, 60, .5)) = 40
    * lerp(-20, 60, .5)) = 20
    * lerp(20, 60, .75)) = 50
    * lerp(-20, -10, .1)) = -.19
    */
    function lerp(x, y, a) {
        return (1 - a) * x + a * y
    }

    // Used to fit the lerps to start and end at specific scrolling percentages
    function scalePercent(start, end) {
        return (scrollPercent - start) / (end - start)
    }
    const animationScripts = []

    //add an animation that flashes the cube through 100 percent of scroll
    animationScripts.push({
        start: 0,
        end: 101,
        func: () => {
            const time = Date.now() * 0.0005;
            // bloomPass.strength = .09 * scrollPercent
            // galaxy.rotation.y += 0.001
            // meshKnot.rotation.y += 0.001
// console.log(camera.position)


            // const delta = clock.getDelta();
            // light1.position.x = Math.sin( time * 0.7 ) * 30;
            // light1.position.y = Math.cos( time * 0.5 ) * 40;
            // light1.position.z = Math.cos( time * 0.3 ) * 30;
            //
            // light2.position.x = Math.cos( time * 0.3 ) * 30;
            // light2.position.y = Math.sin( time * 0.5 ) * 40;
            // light2.position.z = Math.sin( time * 0.7 ) * 30;
            //
            // light3.position.x = Math.sin( time * 0.7 ) * 30;
            // light3.position.y = Math.cos( time * 0.3 ) * 40;
            // light3.position.z = Math.sin( time * 0.5 ) * 30;
            //
            // light4.position.x = Math.sin( time * 0.3 ) * 30;
            // light4.position.y = Math.cos( time * 0.7 ) * 40;
            // light4.position.z = Math.sin( time * 0.5 ) * 30;

        },
    })

    //add an animation that moves the cube through first 40 percent of scroll
    animationScripts.push({
        start: 0,
        end: 40,
        func: () => {
            camera.position.set(0, 13, -55);
            camera.lookAt(0,0,0)
            // camera.position.set(-50, 19, -15);
            // camera.lookAt(someFish)
            // cube.position.z = lerp(0 , -12, scalePercent(0, 40))
            // //console.log(cube.position.z)
        },
    })

    //add an animation that rotates the cube between 40-60 percent of scroll
    animationScripts.push({
        start: 40,
        end: 60,
        func: () => {
            rectLight1.width = lerp(0, 52, scalePercent(40,60))
            // camera.lookAt(vaporWave.position)
            // camera.position.z = lerp(88, 120, scalePercent(60, 80))
            // camera.position.y = lerp(8, 12, scalePercent(60, 80))

            // vaporWave.rotation.z = lerp(0, Math.PI, scalePercent(40, 60))
            //console.log(cube.rotation.z)
        },
    })

    //add an animation that moves the camera between 60-80 percent of scroll
    animationScripts.push({
        start: 60,
        end: 80,
        func: () => {
            camera.position.z = lerp(-52, 37, scalePercent(60, 80))
            camera.position.y = lerp(9, 12, scalePercent(60, 80))
            // camera.rotation.z = lerp(0, 1, scalePercent(60, 80))
        },
    })

    //add an animation that auto rotates the cube from 80 percent of scroll
    animationScripts.push({
        start: 80,
        end: 101,
        func: () => {
            // camera.position.y = lerp(9, 0, scalePercent(80, 101));
            // camera.position.z = lerp(10, -32, scalePercent(80, 101));
            // camera.rotation.x = Math.PI/2
        },
    })

const gui = new GUI();

const bloomFolder = gui.addFolder( 'bloom' );

bloomFolder.add( params, 'threshold', 0.0, 1.0 ).onChange( function ( value ) {

    bloomPass.threshold = Number( value );

} );

bloomFolder.add( params, 'strength', 0.0, 3.0 ).onChange( function ( value ) {

    bloomPass.strength = Number( value );

} );

gui.add( params, 'radius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

    bloomPass.radius = Number( value );

} );

const toneMappingFolder = gui.addFolder( 'tone mapping' );

toneMappingFolder.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

    renderer.toneMappingExposure = Math.pow( value, 4.0 );

} );

window.addEventListener( 'resize', onWindowResize );


function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
    composer.setSize( width, height );
}
    function animate() {
        // clock = new THREE.Clock()
        delta = clock.getDelta()
        if (mixer) {
            mixer.update(delta);
        }
        if (mixer2) {
            mixer2.update(delta)
        }
        if (mixer3) {
            mixer3.update(delta)
        }
        requestAnimationFrame(animate)
        // requestAnimationFrame(update);
        playScrollAnimations()
        update()
        render()
        stats.update();

        composer.render();
    }

    function render() {
        renderer.render(scene, camera)
        composer.render();

    }

    window.scrollTo({top: 0, behavior: 'smooth'})
    animate()
}
