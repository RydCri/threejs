import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import Stats from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/libs/stats.module.js";
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {GLTFLoader} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

init()

function init() {
    let cube, mixer, meshKnot, light1, light2, light3, light4;
    const scene = new THREE.Scene()

    const gridHelper = new THREE.GridHelper(10, 10, 0xaec6cf, 0xaec6cf)
    scene.add(gridHelper)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //lights
    const sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

    light1 = new THREE.PointLight( 0xff0040,.01);
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    scene.add( light1 );

    light2 = new THREE.PointLight( 0x0040ff,.01);
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
    scene.add( light2 );

    light3 = new THREE.PointLight( 0x80ff80,.01);
    light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
    scene.add( light3 );

    light4 = new THREE.PointLight( 0xffaa00,.01);
    light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
    scene.add( light4 );

    RectAreaLightUniformsLib.init();

    const rectLight1 = new THREE.RectAreaLight(0xff6600, 5, 4, 10);
    rectLight1.position.set(-5, 5, 5);
    scene.add(rectLight1);

    const rectLight2 = new THREE.RectAreaLight(0x000000, 5, 4, 10);
    rectLight2.position.set(0, 5, 5);
    scene.add(rectLight2);

    const rectLight3 = new THREE.RectAreaLight(0x0669ff, 5, 4, 10);
    rectLight3.position.set(5, 5, 5);
    scene.add(rectLight3);

    scene.add(new RectAreaLightHelper(rectLight1));
    scene.add(new RectAreaLightHelper(rectLight2));
    scene.add(new RectAreaLightHelper(rectLight3));

    const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
    const matStdFloor = new THREE.MeshStandardMaterial({color: 0xbcbcbc, roughness: 0.1, metalness: 0});
    const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
    scene.add(mshStdFloor);

    const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16);
    const matKnot = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0, metalness: 0});
    meshKnot = new THREE.Mesh(geoKnot, matKnot);
    meshKnot.position.set(0, 5, 0);
    scene.add(meshKnot);


    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0xfffff,
        wireframe: true,
    })
    // let obj;
    const loader = new GLTFLoader().setPath("../threejs/models/");
    loader.load("milk_box.glb", function (gltf) {
        const {animations} = gltf;
        cube = gltf.scene;
        cube.scale.set(10, 10, 10)
        mixer = new THREE.AnimationMixer(cube);
        animations.forEach(function (clip) {
            mixer.clipAction(clip).play();
        });
        animations.clampWhenFinished = true;
        scene.add(cube);
    });
    cube = loader;

    function update() {
        renderer.render(scene, camera);
    }

    cube = new THREE.Mesh(geometry, material)
    cube.position.set(0, 0.5, -10)
    scene.add(cube)
    const ambientLight = new THREE.AmbientLight(0x555555)
    scene.add(ambientLight);
    window.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    }

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
            let g = material.color.g
            g -= 0.05
            if (g <= 0) {
                g = 1.0
            }
            material.color.g = g
            meshKnot.rotation.y += 0.001


            const clock = new THREE.Clock();
            const time = Date.now() * 0.0005;
            const delta = clock.getDelta();
            light1.position.x = Math.sin( time * 0.7 ) * 30;
            light1.position.y = Math.cos( time * 0.5 ) * 40;
            light1.position.z = Math.cos( time * 0.3 ) * 30;

            light2.position.x = Math.cos( time * 0.3 ) * 30;
            light2.position.y = Math.sin( time * 0.5 ) * 40;
            light2.position.z = Math.sin( time * 0.7 ) * 30;

            light3.position.x = Math.sin( time * 0.7 ) * 30;
            light3.position.y = Math.cos( time * 0.3 ) * 40;
            light3.position.z = Math.sin( time * 0.5 ) * 30;

            light4.position.x = Math.sin( time * 0.3 ) * 30;
            light4.position.y = Math.cos( time * 0.7 ) * 40;
            light4.position.z = Math.sin( time * 0.5 ) * 30;


        },
    })

    //add an animation that moves the cube through first 40 percent of scroll
    animationScripts.push({
        start: 0,
        end: 40,
        func: () => {
            camera.lookAt(cube.position)
            camera.position.set(0, 1, 2)
            cube.position.z = lerp(-6, 2, scalePercent(0, 40))
            //console.log(cube.position.z)
        },
    })

    //add an animation that rotates the cube between 40-60 percent of scroll
    animationScripts.push({
        start: 40,
        end: 60,
        func: () => {
            camera.lookAt(cube.position)
            camera.position.set(0, 1, 2)
            cube.rotation.z = lerp(0, Math.PI, scalePercent(40, 60))
            //console.log(cube.rotation.z)
        },
    })

    //add an animation that moves the camera between 60-80 percent of scroll
    animationScripts.push({
        start: 60,
        end: 80,
        func: () => {
            camera.position.x = lerp(0, 58, scalePercent(60, 80))
            camera.position.y = lerp(1, 9, scalePercent(60, 80))
            camera.lookAt(cube.position)
        },
    })

    //add an animation that auto rotates the cube from 80 percent of scroll
    animationScripts.push({
        start: 80,
        end: 101,
        func: () => {
            //auto rotate
            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
        },
    })

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

    const stats = new Stats()
    document.body.appendChild(stats.dom)

    function animate() {
        // var delta = clock.getDelta();
        requestAnimationFrame(animate)
        requestAnimationFrame(update);
        playScrollAnimations()
        update()
        render()

        stats.update();
    }

    function render() {
        renderer.render(scene, camera)
    }

    window.scrollTo({top: 0, behavior: 'smooth'})
    animate()
}