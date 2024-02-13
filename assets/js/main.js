// Scene:
const scene = new THREE.Scene();

// Sizes:
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Camera:
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 20;
scene.add(camera);

// Renderer:
const canvas = document.querySelector('#globe-container');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Resize:
window.addEventListener('resize', () => {
  // Update sizes:
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera:
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Creating the Earth Globe:
const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  roughness: 1,
  metalness: 0,
  map: new THREE.TextureLoader().load('./assets/img/texture/earth-day-map.jpg'),
  bumpMap: new THREE.TextureLoader().load('./assets/img/texture/earthbump.jpg'),
  bumpScale: 5
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// Ambient Light:
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Point Light:
const pointerLight = new THREE.PointLight(0xffffff, 0.7);

// Light Position:
pointerLight.position.set(10, 10, 10);
scene.add(pointerLight);

// Cloud:
const cloudGeometry = new THREE.SphereGeometry(5.15, 64, 64);
const cloudMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load('./assets/img/texture/earthCloud.png'),
  transparent: true
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudMesh);

// Star:
const starGeometry = new THREE.SphereGeometry(80, 64, 64);
const starMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('./assets/img/texture/stars-milky-way.jpg'),
  side: THREE.BackSide
});
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);

// Animate the Globe:
function animate() {
  requestAnimationFrame(animate);

  // Rotate the Cloud:
  cloudMesh.rotation.y -= 0.001;

  // Move the Stars:
  starMesh.rotation.y += 0.0005;

  renderer.render(scene, camera);
}
animate();

// Interactivity:
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Assuming GSAP has been included via script tag
const t1 = gsap.timeline({
  defaults: { duration: 1 }
});
t1.fromTo(earthMesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 0);
t1.fromTo(cloudMesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 0);
