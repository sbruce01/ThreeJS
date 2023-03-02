import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/STLLoader.js";
import { SimplifyModifier } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/modifiers/SimplifyModifier.js";



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// set up shader material
const shaderMaterial = new THREE.ShaderMaterial({
  vertexColors: true,
  vertexShader: `
    varying vec3 vColor;

    void main() {
      vColor = color;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `
});

let bufferGeometry;

const loader = new STLLoader();
loader.load('models/F1_Scaled_Decimated.stl', (geometry) => {

  // set up the buffer geometry
  bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.array), 3));
  bufferGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.array.length), 3));

  // update the color of individual vertices
  const colors = bufferGeometry.attributes.color;
  for (let i = 0; i < colors.count; i++) {
    colors.setXYZ(i, Math.random(), Math.random(), Math.random());
  }
  colors.needsUpdate = true;

  // create the mesh using the buffer geometry and shader material
  const mesh = new THREE.Mesh(bufferGeometry, shaderMaterial);
  scene.add(mesh);
  
  // add orbit controls for click and drag rotation
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
});


camera.position.z = 100;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

function setupWebSocket() {
  const socket = new WebSocket('ws://localhost:5222');

  socket.addEventListener('open', () => {
    console.log('WebSocket connection established');
  });

  socket.addEventListener('message', event => {
    // parse the incoming message as a JSON object
    const data = JSON.parse(event.data);
    const red = data.red;
    const green = data.green;
    const blue = data.blue;
    const array = data.index;
    
    // modify vertex colors based on data
    const colorAttribute = bufferGeometry.attributes.color;
    // for (let i = 0; i < colorAttribute.count; i++) {
    //   colorAttribute.setXYZ(i, red, green, blue);
    // }

    array.forEach(function (item, index) {
      // colorAttribute.setXYZ(item, red, green, blue);
      colorAttribute.setXYZ(item, red, 0, blue);
    });

    colorAttribute.needsUpdate = true;
  });

  socket.addEventListener('close', event => {
    console.log(`WebSocket connection closed with code ${event.code}`);
  });
}

document.getElementById('connect-button').addEventListener('click', () => {
    console.log('Button Clicked');
    setupWebSocket();
  });
