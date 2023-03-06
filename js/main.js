import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/STLLoader.js";
import {csv} from "https://cdn.skypack.dev/d3-fetch@3";

const positions = [];
const scale_value = 3;

csv("../example_data/Pressure/FASTBACK_Pressure_Tapping_Map.csv").then((data) => {
  for (let i = 0; i < data.length; i++) {
    positions.push(parseFloat(scale_value*data[i].x), parseFloat(scale_value*data[i].y), parseFloat(scale_value*data[i].z));
  }
});

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
let wireframe;

const loader = new STLLoader();
// loader.load('models/F1_Scaled_Decimated.stl', (geometry) => {
loader.load('models/CompiledModel.stl', (geometry) => {

  // set up the buffer geometry
  bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.array), 3));
  // bufferGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.array.length), 3));
  wireframe = new THREE.WireframeGeometry( bufferGeometry );  
  
  wireframe.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.array.length), 3));
  
  
  // update the color of individual vertices
  const colors = wireframe.attributes.color;
  for (let i = 0; i < colors.count; i++) {
    colors.setXYZ(i, 1, 0, 0);
  }

  const car = new THREE.LineSegments( wireframe, shaderMaterial );
  
  colors.needsUpdate = true;

  const mappedPoints = getLocations(bufferGeometry, positions);

  const box = new THREE.BoxGeometry( 1, 1, 1 );

  console.log(mappedPoints[0][0]);
  console.log(mappedPoints[0][1]);
  console.log(mappedPoints[0][2]);

  for ( let p = 0; p < mappedPoints.length; p ++ ) {
    const object = new THREE.Mesh( box, new THREE.MeshBasicMaterial() );
    object.scale.set(0.01, 0.01, 0.01);

    object.position.x = mappedPoints[p][0];
    object.position.y = mappedPoints[p][1];
    object.position.z = mappedPoints[p][2];


    scene.add( object );

  }


  scene.add( car );
  
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

function getLocations(bufferGeometry, positions) {
  
  console.log(bufferGeometry.attributes.position.array);

  const closestPoints = [];
  for (let i = 0; i < positions.length / 3; i++) {
    let closestPoint;
    let closestDistance = Number.MAX_VALUE;

    for (let j = 0; j < bufferGeometry.attributes.position.array.length / 3; j++) {
      const xb = bufferGeometry.attributes.position.getX(j);
      const yb = bufferGeometry.attributes.position.getY(j);
      const zb = bufferGeometry.attributes.position.getZ(j);
  
      const xp = positions[0+i*3];
      const yp = positions[1+i*3];
      const zp = positions[2+i*3];
  
      const distance = Math.sqrt(Math.pow(xb - xp, 2) + Math.pow(yb - yp, 2) + Math.pow(zb - zp, 2));

      if (distance < closestDistance){
        closestPoint = [xb, yb, zb];
        closestDistance = distance;
      }
  
      }
      
      closestPoints.push(closestPoint);
  }
  return closestPoints
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

    // const colorAttribute = bufferGeometry.attributes.color;
    const colorAttribute = wireframe.attributes.color;
    
    // Pressures Updating (based on geometry)
    // const pressures = calculatePressures(bufferGeometry);
    // for (let i = 0; i < colorAttribute.count; i++) {
    //   colorAttribute.setXYZ(i, 0.1, 0.1, 1-pressures[i]);
    // }
    

    // Entire Thing Updated
    // for (let i = 0; i < colorAttribute.count; i++) {
    //   colorAttribute.setXYZ(i, red, green, blue);
    // }

    // Bulk updating colours based on array of indexes
    array.forEach(function (item, index) {
      colorAttribute.setXYZ(item, red, green, blue);
      // colorAttribute.setXYZ(item, red, 0, blue);
      // colorAttribute.setXYZ(item, red, 0, 0);
    });
    // colorAttribute.setXYZ(index, 1, 0, 0);
    colorAttribute.needsUpdate = true;
  });

  socket.addEventListener('close', event => {
    console.log(`WebSocket connection closed with code ${event.code}`);
  });
}

document.getElementById('connect-button').addEventListener('click', () => {
    console.log('Button Clicked');
    // getLocations(bufferGeometry, positions);
    setupWebSocket();
  });
