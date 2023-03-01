const socket = new WebSocket('ws://localhost:8080');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);
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

  cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);

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
