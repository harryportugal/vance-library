const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REGISTRY_PATH = path.join(__dirname, 'public', 'components-registry.json');
const COMPONENTS_DIR = path.join(__dirname, 'public', 'components');

if (!fs.existsSync(REGISTRY_PATH)) {
  console.error('components-registry.json not found!');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

// Curated Unsplash placeholders for broken images
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&w=800&q=80"
];

// Premium mock configurations
const CUSTOM_MOCKS = {
  '3D Animation': {
    'default': {
      html: `
<div class="canvas-3d-stage">
  <canvas id="three-canvas"></canvas>
  <div class="badge">Drag Mouse or Scroll to rotate mesh</div>
</div>`,
      css: `
body, html { margin: 0; padding: 0; background: #070707; color: white; font-family: sans-serif; width: 100%; height: 100%; overflow: hidden; }
.canvas-3d-stage { width: 100%; height: 100%; position: relative; }
canvas { width: 100%; height: 100%; display: block; }
.badge { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: #444; font-size: 12px; font-weight: bold; pointer-events: none; text-transform: uppercase; letter-spacing: 0.05em; }
`,
      js: `
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Mesh
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshNormalMaterial({ wireframe: true });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

camera.position.z = 30;

let targetX = 0;
let targetY = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  torusKnot.rotation.y = targetX * 0.5;
  torusKnot.rotation.x = targetY * 0.5;
  torusKnot.rotation.z += 0.005;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
`
    }
  },
  'Scroll Animation': {
    'default': {
      html: `
<div class="scroll-stage">
  <section class="sec sec-intro">
    <h1>Scroll Kinetic Showcases</h1>
    <div class="indicator">Scroll Down Slowly ↓</div>
  </section>
  <section class="sec sec-parallax">
    <div class="card-3d">
      <div class="card-inner">GSAP ScrollTrigger</div>
    </div>
  </section>
  <section class="sec sec-outro">
    <h2>End of Showcase</h2>
  </section>
</div>`,
      css: `
body, html { margin: 0; padding: 0; background: #070707; color: white; font-family: sans-serif; width: 100%; height: 100%; }
.scroll-stage { width: 100%; }
.sec { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; border-bottom: 1px solid #111; }
h1 { font-size: 6vw; letter-spacing: -0.05em; font-weight: 900; }
h2 { font-size: 4vw; letter-spacing: -0.03em; font-weight: 800; color: #3b82f6; }
.indicator { font-size: 13px; color: #555; margin-top: 20px; font-weight: bold; }
.card-3d { width: 300px; height: 400px; background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-weight: 950; font-size: 24px; color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.5); transform: rotateX(20deg) rotateY(-20deg); }
.card-inner { pointer-events: none; }
`,
      js: `
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

gsap.to('.card-3d', {
  scrollTrigger: {
    trigger: '.sec-parallax',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  },
  rotationX: -20,
  rotationY: 20,
  y: -100,
  scale: 1.1,
  ease: "none"
});

gsap.from('.sec-outro h2', {
  scrollTrigger: {
    trigger: '.sec-outro',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  },
  opacity: 0,
  scale: 0.8,
  duration: 0.8,
  ease: "back.out(1.7)"
});
`
    }
  }
};

CUSTOM_MOCKS['Webgl _ ThreeJS Effects'] = { 'default': CUSTOM_MOCKS['3D Animation']['default'] };
CUSTOM_MOCKS['Physics Effects'] = {
  'default': {
    html: `
<div class="physics-stage">
  <div class="custom-cursor"></div>
  <div class="badge">Hover elements to trigger physics bounce</div>
  <div class="container">
    <button class="mag-btn">Hover Magnetic</button>
    <button class="mag-btn">GSAP Bounce</button>
    <button class="mag-btn flex-btn">Elastic Physics</button>
  </div>
</div>`,
    css: `
body, html { margin: 0; padding: 0; background: #070707; color: white; font-family: sans-serif; width: 100%; height: 100%; overflow: hidden; }
.physics-stage { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
.custom-cursor { width: 20px; height: 20px; border: 2px solid #3b82f6; border-radius: 50%; position: absolute; pointer-events: none; transform: translate(-50%, -50%); transition: width 0.3s, height 0.3s, border-color 0.3s; z-index: 9999; }
.badge { margin-bottom: 40px; color: #555; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; }
.container { display: flex; gap: 20px; }
.mag-btn { background: #0f0f0f; border: 1px solid #1a1a1a; color: white; padding: 16px 32px; font-size: 16px; border-radius: 99px; cursor: pointer; transition: background 0.3s, border-color 0.3s; font-weight: 500; }
.mag-btn:hover { background: #161616; border-color: #3b82f6; }
`,
    js: `
const cursor = document.querySelector('.custom-cursor');
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cursorX = mouse.x;
let cursorY = mouse.y;

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function updateCursor() {
  cursorX += (mouse.x - cursorX) * 0.15;
  cursorY += (mouse.y - cursorY) * 0.15;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(updateCursor);
}
updateCursor();

// Magnetic buttons
const buttons = document.querySelectorAll('.mag-btn');
buttons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    
    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power2.out"
    });
    
    cursor.style.width = '40px';
    cursor.style.height = '40px';
    cursor.style.borderColor = '#60a5fa';
  });
  
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderColor = '#3b82f6';
  });
});
`
  }
};

// Injects local libraries, hidden scrollbars, and broken image fallbacks
const CDN_INJECTS = `
  <!-- Automatic High-Performance Local Library Inject -->
  <script src="/libs/three.min.js"></script>
  <script src="/libs/gsap.min.js"></script>
  <script src="/libs/ScrollTrigger.min.js"></script>
  <script src="/libs/ScrollToPlugin.min.js"></script>
  <script src="/libs/CustomEase.min.js"></script>
  <script src="/libs/Flip.min.js"></script>
  <script src="/libs/Observer.min.js"></script>
  <script src="/libs/lenis.min.js"></script>
  <style>
    /* Hide scrollbars globally inside iframe */
    ::-webkit-scrollbar {
      display: none !important;
    }
    html, body {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }
  </style>
  <script>
    // Image fallback replacer for Awwwards-style slides/images
    window.addEventListener('error', function(e) {
      if (e.target && e.target.tagName === 'IMG') {
        const PLACEHOLDER_IMAGES = ${JSON.stringify(PLACEHOLDER_IMAGES)};
        const idx = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
        e.target.src = PLACEHOLDER_IMAGES[idx];
      }
    }, true);

    // SplitText Polyfill for GSAP compatibility
    class SplitTextPolyfill {
      constructor(element, options = {}) {
        this.elements = [];
        if (typeof element === 'string') {
          this.elements = Array.from(document.querySelectorAll(element));
        } else if (element.length !== undefined && !element.nodeType) {
          this.elements = Array.from(element);
        } else if (element) {
          this.elements = [element];
        }
        
        this.options = options;
        this.type = options.type || "words,chars";
        this.chars = [];
        this.words = [];
        this.lines = [];
        this.originalContent = this.elements.map(el => ({ el, html: el.innerHTML }));
        this.split();
      }
      
      split() {
        const types = this.type.split(',').map(t => t.trim());
        const wantChars = types.includes('chars');
        const wantWords = types.includes('words');
        const wantLines = types.includes('lines');
        
        this.elements.forEach(el => {
          let text = el.textContent || "";
          el.innerHTML = "";
          
          let words = text.split(/(\\s+)/).filter(w => w.length > 0);
          let wordElements = [];
          let charElements = [];
          
          words.forEach(w => {
            if (/\\s+/.test(w)) {
              el.appendChild(document.createTextNode(w));
              return;
            }
            let wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            if (this.options.wordsClass) wordSpan.className = this.options.wordsClass;
            
            if (wantChars) {
              Array.from(w).forEach(c => {
                let charSpan = document.createElement('span');
                charSpan.style.display = 'inline-block';
                charSpan.textContent = c;
                if (this.options.charsClass) charSpan.className = this.options.charsClass;
                wordSpan.appendChild(charSpan);
                charElements.push(charSpan);
              });
            } else {
              wordSpan.textContent = w;
            }
            
            el.appendChild(wordSpan);
            wordElements.push(wordSpan);
          });
          
          this.chars = this.chars.concat(charElements);
          this.words = this.words.concat(wordElements);
          
          if (wantLines) {
            let currentLine = [];
            let lastTop = -1;
            wordElements.forEach(span => {
              let rect = span.getBoundingClientRect();
              let top = rect.top;
              if (lastTop === -1) {
                lastTop = top;
                currentLine.push(span);
              } else if (Math.abs(top - lastTop) > 6) {
                let lineSpan = document.createElement('span');
                lineSpan.style.display = 'block';
                if (this.options.linesClass) lineSpan.className = this.options.linesClass;
                currentLine.forEach(w => {
                  if (w.parentNode) w.parentNode.insertBefore(lineSpan, w);
                  lineSpan.appendChild(w);
                });
                this.lines.push(lineSpan);
                currentLine = [span];
                lastTop = top;
              } else {
                currentLine.push(span);
              }
            });
            if (currentLine.length > 0) {
              let lineSpan = document.createElement('span');
              lineSpan.style.display = 'block';
              if (this.options.linesClass) lineSpan.className = this.options.linesClass;
              currentLine.forEach(w => {
                if (w.parentNode) w.parentNode.insertBefore(lineSpan, w);
                lineSpan.appendChild(w);
              });
              this.lines.push(lineSpan);
            }
          }
        });
      }
      
      revert() {
        this.originalContent.forEach(item => {
          item.el.innerHTML = item.html;
        });
      }
    }
    window.SplitText = SplitTextPolyfill;

    // ScrollSmoother Polyfill
    window.ScrollSmoother = {
      create: function(options) {
        console.log("Mock ScrollSmoother using Lenis.");
        const lenis = new Lenis();
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return {
          smooth: () => lenis,
          scrollTop: () => lenis.scroll,
          scrollTo: (target, vars) => lenis.scrollTo(target, vars),
          paused: (state) => {
            if (state === undefined) return !lenis.options.enabled;
            if (state) lenis.stop(); else lenis.start();
          },
          kill: () => lenis.destroy()
        };
      }
    };

    // Dummy premium GSAP registers
    if (window.gsap) {
      gsap.registerPlugin({ name: "drawSVG", init() { return true; } });
      gsap.registerPlugin({ name: "morphSVG", init() { return true; } });
      gsap.registerPlugin({ name: "scrambleText", init() { return true; } });
    }
  </script>
`;

function injectCDNs(htmlContent) {
  // Strip any existing scripts loading three, gsap, lenis (both CDNs and local /vendor or /libs paths)
  let patched = htmlContent
    .replace(/<script[^>]*src=["'][^"']*(?:three|gsap|lenis|ScrollTrigger|ScrollToPlugin|CustomEase|Flip|Observer)[^"']*["'][^>]*><\/script>/gi, '')
    .replace(/<script[^>]*src=["'](?:..\/)*node_modules\/[^"']*["'][^>]*><\/script>/gi, '');

  if (patched.includes('<head>')) {
    return patched.replace('<head>', '<head>' + CDN_INJECTS);
  } else if (patched.includes('<html>')) {
    return patched.replace('<html>', '<html><head>' + CDN_INJECTS + '</head>');
  } else {
    return CDN_INJECTS + patched;
  }
}

// Recursively replace absolute path links in directory
function patchPathsInDir(dir, absolutePrefix) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      patchPathsInDir(full, absolutePrefix);
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(full, 'utf8');
      let original = content;
      // Replace root-relative links starting with /_next/ or /next.svg or /vercel.svg
      content = content.replace(/([\"'])\/_next\//g, '$1' + absolutePrefix + '_next/');
      content = content.replace(/([\"'])\/next\.svg/g, '$1' + absolutePrefix + 'next.svg');
      content = content.replace(/([\"'])\/vercel\.svg/g, '$1' + absolutePrefix + 'vercel.svg');
      
      // Also patch absolute paths of images or common static assets starting with / (e.g. /shoes/ or /img/)
      // Only do this in NextJs exported out/ directory
      if (dir.includes('out') && content.includes('/_next/')) {
        content = content.replace(/([\"'])\/shoes\//g, '$1' + absolutePrefix + 'shoes/');
      }

      if (content !== original) {
        fs.writeFileSync(full, content, 'utf8');
      }
    }
  });
}

console.log('Starting automated library compiler, path resolver and fallback generator...');
let compiledCount = 0;
let failedCount = 0;
let mockCount = 0;
let patchedCount = 0;

registry.forEach((comp) => {
  const categoryName = comp.category;
  const compId = comp.id;
  const compFolder = path.join(COMPONENTS_DIR, categoryName, compId);

  if (!fs.existsSync(compFolder)) return;

  const extractedDir = path.join(compFolder, 'extracted');
  const zipPath = path.join(compFolder, 'code.zip');

  if (!fs.existsSync(extractedDir)) {
    if (fs.existsSync(zipPath)) {
      fs.mkdirSync(extractedDir, { recursive: true });
      try {
        if (process.platform === 'win32') {
          execSync(`tar -xf "${zipPath}" -C "${extractedDir}"`, { stdio: 'ignore' });
        } else {
          execSync(`unzip -q -o "${zipPath}" -d "${extractedDir}"`, { stdio: 'ignore' });
        }
        console.log(`  [Extracted] Component ${categoryName} #${compId}`);
      } catch (err) {
        console.error(`  [Extract Error] Failed to unpack component ${categoryName} #${compId}:`, err.message);
        process.exit(1);
      }
    } else {
      console.error(`  [Missing Zip] Zip file not found at ${zipPath}`);
      process.exit(1);
    }
  }

  // 1. Find subfolder containing package.json (if any)
  let packageJsonDir = null;
  function findPackageJson(dir) {
    const list = fs.readdirSync(dir);
    if (list.includes('package.json')) return dir;
    for (const f of list) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        if (f !== 'node_modules' && f !== 'dist' && f !== 'build' && f !== 'out' && f !== '.git') {
          const found = findPackageJson(full);
          if (found) return found;
        }
      }
    }
    return null;
  }

  packageJsonDir = findPackageJson(extractedDir);

  let builtSuccessfully = false;
  let indexHtmlPath = null;

  // 1. Check if there is an AI-generated or custom files/index.html already present to preserve it
  const customIndexFile = path.join(extractedDir, 'files', 'index.html');
  if (fs.existsSync(customIndexFile)) {
    const customContent = fs.readFileSync(customIndexFile, 'utf8');
    if (!customContent.includes('Scroll Kinetic Showcases') && !customContent.includes('Scroll Kinetic Showcase')) {
      indexHtmlPath = customIndexFile;
      builtSuccessfully = true;
      console.log(`  [AI DOM] Preserved custom/AI-generated index.html for ${categoryName} #${compId}.`);
    }
  }

  if (!builtSuccessfully && packageJsonDir) {
    const pkg = JSON.parse(fs.readFileSync(path.join(packageJsonDir, 'package.json'), 'utf8'));
    const isNextJs = pkg.dependencies && pkg.dependencies.next;

    if (isNextJs) {
      const outDir = path.join(packageJsonDir, 'out');
      const outIndex = path.join(outDir, 'index.html');
      
      // Skip if already built
      if (fs.existsSync(outIndex)) {
        indexHtmlPath = outIndex;
        builtSuccessfully = true;
        compiledCount++;
        console.log(`\n[Next.js Project] ${categoryName} #${compId} already compiled, skipping.`);
      } else {
      console.log(`\n[Next.js Project] Compiling ${categoryName} #${compId}...`);
      try {
        // 1. Configure output: 'export' in next.config
        const configPathJs = path.join(packageJsonDir, 'next.config.js');
        const configPathMjs = path.join(packageJsonDir, 'next.config.mjs');
        let configPath = fs.existsSync(configPathMjs) ? configPathMjs : configPathJs;
        
        if (!fs.existsSync(configPath)) {
          configPath = configPathJs;
        }
        
        const isMjs = configPath.endsWith('.mjs');
        const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}
${isMjs ? 'export default nextConfig;' : 'module.exports = nextConfig;'}
`;
        fs.writeFileSync(configPath, nextConfigContent, 'utf8');

        // 2. Build Next.js
        execSync('npx next build', { cwd: packageJsonDir, stdio: 'ignore' });

        const outDir2 = path.join(packageJsonDir, 'out');
        const outIndex2 = path.join(outDir2, 'index.html');
        
        if (fs.existsSync(outIndex2)) {
          // 3. Patch absolute paths inside out/
          const categoryNameUrl = encodeURIComponent(categoryName);
          const devServerPrefix = `/components/${categoryNameUrl}/${compId}/extracted/${path.relative(extractedDir, outDir2).replace(/\\/g, '/')}/`;
          patchPathsInDir(outDir2, devServerPrefix);
          
          indexHtmlPath = outIndex2;
          builtSuccessfully = true;
          compiledCount++;
          console.log(`  [Success] Next.js project compiled and patched.`);
        }
      } catch (err) {
        console.error(`  [Error] Next.js build failed:`, err.message);
        failedCount++;
      }
      }
    } else {
      // Check if dist already has a working index.html
      const existingDist = path.join(packageJsonDir, 'dist', 'index.html');
      if (fs.existsSync(existingDist)) {
        indexHtmlPath = existingDist;
        builtSuccessfully = true;
        compiledCount++;
        console.log(`\n[Vite/Webpack Project] ${categoryName} #${compId} already compiled, skipping.`);
      } else {
      console.log(`\n[Vite/Webpack Project] Compiling ${categoryName} #${compId}...`);
      try {
        // Check if config file exists
        const filesList = fs.readdirSync(packageJsonDir);
        const hasVite = filesList.some(f => f.startsWith('vite.config')) || 
                        (pkg.dependencies && pkg.dependencies.vite) || 
                        (pkg.devDependencies && pkg.devDependencies.vite);
        const hasWebpack = filesList.some(f => f.startsWith('webpack.config')) || 
                           (pkg.dependencies && pkg.dependencies.webpack) || 
                           (pkg.devDependencies && pkg.devDependencies.webpack);

        if (hasVite) {
          try {
            // Compile with Vite base ./
            execSync('npx vite build --base ./', { cwd: packageJsonDir, stdio: 'ignore' });
          } catch (e) {
            console.log(`  [Vite Retry] Original Vite build failed. Writing fallback config and retrying...`);
            const fallbackConfig = `
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
export default defineConfig({
  base: './',
  plugins: [glsl()],
  build: {
    minify: false,
    cssMinify: false
  }
});
`;
            const configPathJs = path.join(packageJsonDir, 'vite.config.js');
            const configPathMjs = path.join(packageJsonDir, 'vite.config.mjs');
            const configPathTs = path.join(packageJsonDir, 'vite.config.ts');
            if (fs.existsSync(configPathMjs)) fs.rmSync(configPathMjs);
            if (fs.existsSync(configPathTs)) fs.rmSync(configPathTs);
            fs.writeFileSync(configPathJs, fallbackConfig, 'utf8');
            
            // Retry
            try {
              execSync('npx vite build --base ./', { cwd: packageJsonDir, stdio: 'ignore' });
            } catch (err) {
              console.log(`  [Vite Retry Error] Fallback build failed. Trying npm install first...`);
              try {
                execSync('npm install --legacy-peer-deps', { cwd: packageJsonDir, stdio: 'ignore' });
                execSync('npx vite build --base ./', { cwd: packageJsonDir, stdio: 'ignore' });
              } catch (installErr) {
                console.error(`  [Vite Install Error] Build failed after npm install: ${installErr.message}`);
              }
            }
          }
          
          const distIndex = path.join(packageJsonDir, 'dist', 'index.html');
          if (fs.existsSync(distIndex)) {
            indexHtmlPath = distIndex;
            builtSuccessfully = true;
            compiledCount++;
            console.log(`  [Success] Vite project compiled relative.`);
          }
        } else if (hasWebpack) {
          try {
            // Compile with Webpack
            execSync('npx webpack --mode production', { cwd: packageJsonDir, stdio: 'ignore' });
          } catch (e) {
            console.log(`  [Webpack Retry] Webpack build failed. Running npm install...`);
            try {
              execSync('npm install --legacy-peer-deps', { cwd: packageJsonDir, stdio: 'ignore' });
              execSync('npx webpack --mode production', { cwd: packageJsonDir, stdio: 'ignore' });
            } catch (err) {
              console.error(`  [Webpack Retry Error] Build failed after npm install: ${err.message}`);
            }
          }
          const distIndex = path.join(packageJsonDir, 'dist', 'index.html');
          if (fs.existsSync(distIndex)) {
            indexHtmlPath = distIndex;
            builtSuccessfully = true;
            compiledCount++;
            console.log(`  [Success] Webpack project compiled.`);
          }
        } else {
          // Clean Unix commands in package.json build script to run successfully on Windows
          if (pkg.scripts && pkg.scripts.build) {
            const originalBuild = pkg.scripts.build;
            const cleanedBuild = originalBuild
              .replace(/rm -rf dist\/\*/g, '')
              .replace(/npm run clean &&/g, '')
              .trim();
            if (originalBuild !== cleanedBuild) {
              pkg.scripts.build = cleanedBuild;
              fs.writeFileSync(path.join(packageJsonDir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');
              console.log(`  [Sanitize] Cleaned Unix-specific build command for Windows compatibility.`);
            }
          }

          if (!pkg.scripts || !pkg.scripts.build || pkg.scripts.build.includes('no test specified')) {
            // Pure static fallback
            const indexHtml = path.join(packageJsonDir, 'index.html');
            if (fs.existsSync(indexHtml)) {
              indexHtmlPath = indexHtml;
              builtSuccessfully = true;
              compiledCount++;
              console.log(`  [Success] No build script, using static index.html.`);
            }
          } else {
            // Standard build script fallback
            try {
              execSync('npm run build', { cwd: packageJsonDir, stdio: 'ignore' });
            } catch (e) {
              console.log(`  [Fallback Retry] Build failed. Running npm install in directory...`);
              try {
                execSync('npm install --legacy-peer-deps', { cwd: packageJsonDir, stdio: 'ignore' });
                execSync('npm run build', { cwd: packageJsonDir, stdio: 'ignore' });
              } catch (err) {
                console.error(`  [Fallback Retry Error] Build failed after install: ${err.message}`);
              }
            }
            
            let distIndex = path.join(packageJsonDir, 'dist', 'index.html');
            if (!fs.existsSync(distIndex)) {
              distIndex = path.join(packageJsonDir, 'build', 'index.html');
            }
            if (!fs.existsSync(distIndex)) {
              distIndex = path.join(packageJsonDir, 'app', 'index.html');
            }
            if (fs.existsSync(distIndex)) {
              indexHtmlPath = distIndex;
              builtSuccessfully = true;
              compiledCount++;
              console.log(`  [Success] Custom script project compiled.`);
            }
          }
        }
      } catch (err) {
        console.error(`  [Error] Build failed:`, err.message);
        failedCount++;
      }
      }
    }
  }

  // 2. For static projects (no package.json), find existing index.html
  if (!builtSuccessfully && !packageJsonDir) {
    function findIndexHtml(dir) {
      const list = fs.readdirSync(dir);
      for (const f of list) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
          if (f !== 'node_modules' && f !== '.git') {
            const found = findIndexHtml(full);
            if (found) return found;
          }
        } else if (f.toLowerCase() === 'index.html') {
          return full;
        }
      }
      return null;
    }
    indexHtmlPath = findIndexHtml(extractedDir);
    if (indexHtmlPath) {
      builtSuccessfully = true;
    }
  }

  // 2.5 Check if there is an AI-generated or custom files/index.html already present
  if (!builtSuccessfully) {
    const customIndexFile = path.join(extractedDir, 'files', 'index.html');
    if (fs.existsSync(customIndexFile)) {
      const customContent = fs.readFileSync(customIndexFile, 'utf8');
      if (!customContent.includes('Scroll Kinetic Showcases')) {
        indexHtmlPath = customIndexFile;
        builtSuccessfully = true;
        console.log(`  [AI DOM] Using custom/AI-generated index.html for ${categoryName} #${compId}.`);
      }
    }
  }

  // 3. Fallback to interactive mock ONLY if NPM project failed to compile
  if (!builtSuccessfully && packageJsonDir) {
    const filesDir = path.join(extractedDir, 'files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }
    const mockIndexFile = path.join(filesDir, 'index.html');
    const mockCssFile = path.join(filesDir, 'style.css');
    const mockJsFile = path.join(filesDir, 'script.js');

    // Get specific category templates
    const catMocks = CUSTOM_MOCKS[categoryName] || {};
    const mock = catMocks[compId] || catMocks['default'] || CUSTOM_MOCKS['Scroll Animation']['default'];

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${comp.title} Interactive Showcase</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  ${mock.html}
  <script src="script.js"></script>
</body>
</html>`;

    fs.writeFileSync(mockIndexFile, htmlContent, 'utf8');
    fs.writeFileSync(mockCssFile, mock.css, 'utf8');
    fs.writeFileSync(mockJsFile, mock.js, 'utf8');

    // Register mock
    const categoryNameUrl = encodeURIComponent(categoryName);
    let indexEntry = comp.files.find(f => f.name.toLowerCase() === 'index.html');
    if (indexEntry) {
      indexEntry.path = 'files/index.html';
      indexEntry.url = `/components/${categoryNameUrl}/${compId}/extracted/files/index.html`;
    } else {
      comp.files.push({ name: 'index.html', path: 'files/index.html', url: `/components/${categoryNameUrl}/${compId}/extracted/files/index.html` });
    }

    if (!comp.files.some(f => f.name.toLowerCase() === 'style.css')) {
      comp.files.push({ name: 'style.css', path: 'files/style.css', url: `/components/${categoryNameUrl}/${compId}/extracted/files/style.css` });
    }
    if (!comp.files.some(f => f.name.toLowerCase() === 'script.js')) {
      comp.files.push({ name: 'script.js', path: 'files/script.js', url: `/components/${categoryNameUrl}/${compId}/extracted/files/script.js` });
    }
    indexHtmlPath = mockIndexFile;
    mockCount++;
  } else if (indexHtmlPath) {
    // Register successfully compiled path
    const relativeHtmlPath = path.relative(extractedDir, indexHtmlPath).replace(/\\/g, '/');
    const categoryNameUrl = encodeURIComponent(categoryName);
    const url = `/components/${categoryNameUrl}/${compId}/extracted/${relativeHtmlPath}`;

    let indexEntry = comp.files.find(f => f.name.toLowerCase() === 'index.html');
    if (indexEntry) {
      indexEntry.path = relativeHtmlPath;
      indexEntry.url = url;
    } else {
      comp.files.push({ name: 'index.html', path: relativeHtmlPath, url: url });
    }
  }

  // 3. Inject scripts, local paths, hidden scrollbars, and image fallbacks into the resulting index.html
  if (indexHtmlPath && fs.existsSync(indexHtmlPath)) {
    let content = fs.readFileSync(indexHtmlPath, 'utf8');
    content = injectCDNs(content);
    
    // Replace absolute links like src="/img" -> src="img" for built static projects
    if (builtSuccessfully && !packageJsonDir) {
      content = content
        .replace(/(src|href)=["']\/([^/][^"']*)["']/g, '$1="./$2"')
        .replace(/(src|href)=["']\/["']/g, '$1="./"');
    }

    // Auto-detect and remediate ES Modules in JS scripts
    const parentDir = path.dirname(indexHtmlPath);
    let needsModuleType = false;
    
    function scanForModules(dir) {
      if (!fs.existsSync(dir)) return;
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
          if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'out' && file !== 'build') {
            scanForModules(full);
          }
        } else if (file.endsWith('.js')) {
          const jsContent = fs.readFileSync(full, 'utf8');
          if (jsContent.includes('import ') || jsContent.includes('export ')) {
            needsModuleType = true;
            // Clean global libraries imports to prevent duplicate loading or browser errors
            let cleanedJs = jsContent
              .replace(/import\s+[\s\S]*?\s+from\s+['"](?:gsap|three|lenis|ScrollTrigger|ScrollToPlugin|CustomEase|Flip|Observer)['"];?/gi, '')
              .replace(/import\s+['"](?:gsap|three|lenis|ScrollTrigger|ScrollToPlugin|CustomEase|Flip|Observer)['"];?/gi, '');
            fs.writeFileSync(full, cleanedJs, 'utf8');
          }
        }
      }
    }
    
    scanForModules(parentDir);
    
    if (needsModuleType) {
      content = content.replace(/<script([^>]*?)src=["']([^"']*?\.js)["']/gi, (match, attrs, src) => {
        if (!attrs.includes('type=')) {
          return `<script ${attrs.trim()} type="module" src="${src}"`;
        }
        return match;
      });
    }
    
    fs.writeFileSync(indexHtmlPath, content, 'utf8');
    patchedCount++;
  }
});

// Save updated registry back
fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf8');

console.log(`\n=== Compilation & Patch Summary ===`);
console.log(`Successfully built & compiled: ${compiledCount} components.`);
console.log(`Failed builds (fallback to mocks): ${failedCount} components.`);
console.log(`Generated interactive mock screens: ${mockCount} components.`);
console.log(`Injected and patched files: ${patchedCount} HTML files.`);
