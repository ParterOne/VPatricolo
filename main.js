import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//Try assetsInclude: ['**/*.gltf'].

// ------ Scene Setup -------


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile){camera.fov = 45; // adjust field of view for mobile
camera.position.setZ(100);
camera.position.setY(-15);
camera.position.setX(5.5);
camera.updateProjectionMatrix();
}else{camera.position.setZ(30);}

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', onWindowResize, false);



// ------ Responsive Window -------

function onWindowResize() {
  // Update the size of the renderer
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update the aspect ratio of the camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// ------ GLTF Loader -------

const loader = new GLTFLoader();

let gltf;

loader.load( 'gltf/Test 2.gltf', function ( _gltf ) {
  
  gltf = _gltf;

  //gltf.scene.rotation.y = Math.PI / 2;
  gltf.scene.scale.set(5,5,5);
  gltf.scene.position.set(0,5,0);
  gltf.scene.castShadow = true; //default is false
  gltf.scene.receiveShadow = true; //default
	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

// ------ HDRI Setup -------

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.6;
const rgbeLoader = new RGBELoader();
const hdriUrl = 'hdr/studio_small_02_2k.hdr';
rgbeLoader.load( hdriUrl, function ( texture ) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  //scene.background = texture;
  scene.environment = texture;
} );

// ------ Follow Mouse -------


if (!isMobile){
  
  document.addEventListener('mousemove', onMouseMove, false);
  function onMouseMove(event) {
    var mouseX = window.innerWidth / 2 - event.clientX;
    var mouseY = window.innerHeight / 2 - event.clientY;
    gltf.scene.rotation.y = -Math.PI * 0.5 * mouseX / window.innerWidth;
    gltf.scene.rotation.x = -Math.PI * 0.5 * mouseY / window.innerHeight;
    gltf.scene.updateMatrix();
  }
}

// Set up animation loop
function animate() {
  console.log(camera.fov); // log the current camera FOV
  requestAnimationFrame( animate );

  if (gltf) {
    if (typeof isMobile !== 'undefined' && isMobile){
      //gltf.scene.rotation.x += 0.01;
      gltf.scene.rotation.y += 0.01;
    }

    renderer.render( scene, camera );
  }
}

animate()