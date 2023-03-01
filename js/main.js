const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.SphereGeometry();
const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
const sphere = new THREE.LineSegments(wireframeGeometry, material);

// modify vertex colors
const positionAttribute = wireframeGeometry.attributes.position;
const colors = [];
for (let i = 0; i < positionAttribute.count; i++) {
  colors.push(1.0, 1.0, 1.0); // set initial color to white
}
wireframeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

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

sphere.material = shaderMaterial;

scene.add(sphere);
camera.position.z = 5;

// add event listeners to canvas for mouse interaction
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

document.addEventListener('mousedown', event => {
  isDragging = true;
});

document.addEventListener('mousemove', event => {
  if (!isDragging) {
    return;
  }

  const deltaMove = {
    x: event.offsetX - previousMousePosition.x,
    y: event.offsetY - previousMousePosition.y
  };

  const deltaRotationQuaternion = new THREE.Quaternion()
    .setFromEuler(new THREE.Euler(
      toRadians(deltaMove.y * 0.5),
      toRadians(deltaMove.x * 0.5),
      0,
      'XYZ'
    ));

  sphere.quaternion.multiplyQuaternions(deltaRotationQuaternion, sphere.quaternion);

  previousMousePosition = {
    x: event.offsetX,
    y: event.offsetY
  };
});

document.addEventListener('mouseup', event => {
  isDragging = false;
});

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

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
    console.log(data);

    // modify vertex colors based on data
    const colorAttribute = wireframeGeometry.attributes.color;
    for (let i = 0; i < colorAttribute.count; i++) {
      colorAttribute.setXYZ(i, red, green, blue);
    }
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
