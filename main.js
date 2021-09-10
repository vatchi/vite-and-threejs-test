import './style.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { quotes } from './data/quotes';

function getRandomQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  const blockquote = document.querySelector('.quote__blockquote');
  blockquote.innerHTML = quotes[random].text;
}
const newQuoteButton = document.querySelector('.quote__new-quote');
newQuoteButton.addEventListener('click', getRandomQuote);

getRandomQuote();

const scene = new THREE.Scene();

const fov = 75;
const near = 0.1;
const far = 500;

const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  near,
  far
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(5);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  './models/love.glb',
  function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.position.setX(-3);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const spaceTexture = new THREE.TextureLoader().load('./textures/space.jpg');
scene.background = spaceTexture;

const moonTexture = new THREE.TextureLoader().load('./textures/moon.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);

scene.add(moon);

moon.position.z = -25;
moon.position.setX(-30);

function animate() {
  requestAnimationFrame(animate);
  moon.rotation.x += 0.0015;
  moon.rotation.y += 0.0015;

  controls.update();

  renderer.render(scene, camera);
}

animate();
