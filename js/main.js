import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/STLLoader.js";
import { SimplifyModifier } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/modifiers/SimplifyModifier.js";

const length_x = (26.2768497467041 + 26.2768497467041);
const length_y = (61.50607681274414 + 61.57312774658203);
const length_z = (13.852421760559082 + 0.015190325677394867);

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
// loader.load('models/F1_Scaled_Decimated.stl', (geometry) => {
loader.load('models/CompiledModel.stl', (geometry) => {

  // set up the buffer geometry
  bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.array), 3));
  bufferGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.array.length), 3));

  // update the color of individual vertices
  const colors = bufferGeometry.attributes.color;
  for (let i = 0; i < colors.count; i++) {
    colors.setXYZ(i, 0.8, 0.8, 0.8);
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


camera.position.z = 2;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

function calculatePressures(bufferGeometry) {
  // Calculate the pressure value for each vertex
  const pressures = new Float32Array(bufferGeometry.attributes.position.array.length / 3);
  for (let i = 0; i < pressures.length; i++) {
    const x = bufferGeometry.attributes.position.getX(i);
    const y = bufferGeometry.attributes.position.getY(i);
    const z = bufferGeometry.attributes.position.getZ(i);

    // Replace this with your own pressure calculation logic
    // pressures[i] = Math.sin(x * y);
    pressures[i] = Math.sin((x/length_x)*(y/length_y)*(z/length_z));
  }
  return pressures;
}


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
    // const index = data.index;

    const colorAttribute = bufferGeometry.attributes.color;
    
    // Pressures Updating (based on geometry)
    const pressures = calculatePressures(bufferGeometry);
    for (let i = 0; i < colorAttribute.count; i++) {
      colorAttribute.setXYZ(i, 0.1, 0.1, 1-pressures[i]);
    }
    

    // Entire Thing Updated
    // for (let i = 0; i < colorAttribute.count; i++) {
    //   colorAttribute.setXYZ(i, red, green, blue);
    // }

    // Bulk updating colours based on array of indexes
    // array.forEach(function (item, index) {
    //   colorAttribute.setXYZ(item, red, green, blue);
    //   // colorAttribute.setXYZ(item, red, 0, blue);
    //   // colorAttribute.setXYZ(item, red, 0, 0);
    // });
    // colorAttribute.setXYZ(index, 1, 0, 0);
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
