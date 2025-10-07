// إنشاء مشهد
const scene = new THREE.Scene();

// إعداد الكاميرا
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

// إعداد المحرك (Renderer)
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("myCanvas"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// إنشاء مجسم مكعب
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0x0077ff,
  metalness: 0.5,
  roughness: 0.3,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// إضافة إضاءة
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// التحكم بالكاميرا بالماوس
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// تحديث حجم الشاشة عند التغيير
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// حلقة التحريك
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();
