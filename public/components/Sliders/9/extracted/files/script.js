// Load images
const img1 = 'https://images.unsplash.com/photo-1607549179678-17a55938f1c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const img2 = 'https://images.unsplash.com/photo-1607489068142-71741a8f46a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

// Create texture loader
const textureLoader = new THREE.TextureLoader();
let textures = [img1, img2, img1, img2].map((url) => textureLoader.load(url));

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Geometry
const planeWidth = 2.4;
const planeHeight = 3;
const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 40, 1);

// Arc/Carousel settings
const numVisible = 6;
const radius = 3.5;
const arcSpread = 1.4 * Math.PI;
const angleStep = arcSpread / (numVisible - 1);
const numMeshes = 30;
const centerIndex = Math.floor(numMeshes / 2);

// Meshes
const meshes = [];
for (let i = 0; i < numMeshes; i++) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: textures[i % 4] },
      uRadius: { value: radius }
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float uRadius;
      void main() {
        vUv = uv;
        vec3 p = position;
        float theta = p.x / uRadius;
        float c = cos(theta);
        float s = sin(theta);
        vec3 curvedPosition = vec3(
          uRadius * s,
          p.y,
          uRadius * (1.0 - c)
        );
        gl_Position = projectionMatrix * modelViewMatrix * vec4(curvedPosition, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main() {
        gl_FragColor = texture2D(uTexture, vUv);
      }
    `
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  meshes.push(mesh);
}

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Mouse
const mouse = {
  x: 0,
  y: 0,
  prevX: 0,
  prevY: 0,
  isDown: false
};

// Auto slide settings
const autoSlide = {
  enabled: true,
  speed: 0.5,
  range: 3,
  direction: 1,
  pauseTime: 2000,
  isPaused: false,
  pauseStartTime: 0
};

// Mouse events
window.addEventListener('mousedown', (event) => {
  mouse.isDown = true;
  mouse.prevX = event.clientX;
  mouse.prevY = event.clientY;
  autoSlide.enabled = false;
});

window.addEventListener('mouseup', () => {
  mouse.isDown = false;
  setTimeout(() => {
    autoSlide.enabled = true;
  }, 1000);
});

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Touch events for mobile
window.addEventListener('touchstart', (event) => {
  mouse.isDown = true;
  mouse.prevX = event.touches[0].clientX;
  mouse.prevY = event.touches[0].clientY;
  autoSlide.enabled = false;
});

window.addEventListener('touchend', () => {
  mouse.isDown = false;
  setTimeout(() => {
    autoSlide.enabled = true;
  }, 1000);
});

window.addEventListener('touchmove', (event) => {
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
});

// Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  0.01,
  20
);
camera.position.z = 5.5;

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas.webgl"),
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animation variables
let time = 0;
let targetX = 0;
let currentX = 0;
let ease = 0.075;

// Animation
function animate() {
  requestAnimationFrame(animate);

  time += 0.001;

  if (autoSlide.enabled && !mouse.isDown) {
    if (autoSlide.isPaused) {
      if (Date.now() - autoSlide.pauseStartTime >= autoSlide.pauseTime) {
        autoSlide.isPaused = false;
      }
    } else {
      targetX += autoSlide.speed * autoSlide.direction * 0.01;

      if (Math.abs(targetX) >= autoSlide.range) {
        autoSlide.direction *= -1;
        autoSlide.isPaused = true;
        autoSlide.pauseStartTime = Date.now();
      }
    }
  } else if (mouse.isDown) {
    const deltaX = mouse.x - mouse.prevX;
    targetX += deltaX * 0.01;
    mouse.prevX = mouse.x;
  } else {
    targetX *= 0.95;
  }

  currentX += (targetX - currentX) * ease;

  for (let i = 0; i < meshes.length; i++) {
    const offset = i - centerIndex + currentX;
    const angle = offset * angleStep;

    if (Math.abs(offset) > numVisible / 2) {
      meshes[i].visible = false;
      continue;
    } else {
      meshes[i].visible = true;
    }

    meshes[i].position.x = radius * Math.sin(angle);
    meshes[i].position.z = radius * (1 - Math.cos(angle));
    meshes[i].position.y = 0;

    meshes[i].lookAt(camera.position.x, meshes[i].position.y, camera.position.z);
  }

  renderer.render(scene, camera);
}

animate();
