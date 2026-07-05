/* =====================================================
   LIQUID METAL — WebGL2 fragment shader
   script.js

   Renders a fullscreen quad (two triangles covering the
   screen) where the fragment shader computes a metaball
   field per pixel.  ~14 spheres trail the cursor; their
   blob-fields sum, so when two come close they appear to
   merge into one drop.

   Visual layers in the shader:
   • field()   — sums every blob's inverse-distance²
                 contribution at the current pixel.
   • iso       — threshold; pixels where field > iso are
                 "inside" the liquid.
   • chromatic aberration — sample the field 3× with
                 small radial offsets and assign each
                 sample to R / G / B → vaporwave fringe.
   • ripples   — concentric expanding circles spawned by
                 clicks.  Each ripple distorts the UV
                 used to sample the metaball field, giving
                 a real "wave through liquid" vibe.
   • grain     — tiny noise mixed in so the surface looks
                 alive even when still.

   JS feeds blob positions/sizes + active ripples into
   uniforms each frame.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

   const canvas = document.getElementById('js-canvas')
   const hint   = document.getElementById('js-hint')
   const gl = canvas.getContext('webgl2', { antialias: true, alpha: true })
   if (!gl) {
      hint.textContent = 'WebGL2 not supported by this browser'
      return
   }

   /* ──────────────────────────────────────────────
      SHADERS
      ────────────────────────────────────────────── */
   const vert = `#version 300 es
      in vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
   `

   const frag = `#version 300 es
      precision highp float;
      out vec4 fragColor;

      uniform vec2  uRes;
      uniform float uTime;
      uniform vec2  uBlobs[14];      // xy in pixels
      uniform float uSizes[14];      // radius in pixels
      uniform vec3  uRipples[6];     // x, y, age (seconds)
      uniform float uActiveRipples;  // count

      // Hash for grain noise
      float hash(vec2 p) {
         return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      // Sum of all blob contributions at point p
      float field(vec2 p) {
         float sum = 0.0;
         for (int i = 0; i < 14; i++) {
            vec2 d = p - uBlobs[i];
            float r = uSizes[i];
            float dist2 = dot(d, d);
            // Inverse-square falloff with radius weighting
            sum += (r * r) / max(dist2, 1.0);
         }
         return sum;
      }

      // Distort UV by active ripples — concentric expanding waves
      vec2 distort(vec2 p) {
         vec2 q = p;
         for (int i = 0; i < 6; i++) {
            if (float(i) >= uActiveRipples) break;
            vec3 rip = uRipples[i];
            vec2 d = p - rip.xy;
            float dist = length(d);
            float age = rip.z;             // seconds since spawn
            float front = age * 800.0;     // ripple radius at this age
            // Narrow gaussian band at the wave front
            float band = exp(-pow((dist - front) / 60.0, 2.0));
            float strength = (1.0 - min(age * 0.6, 1.0)) * 18.0;
            q += normalize(d + 0.0001) * band * strength;
         }
         return q;
      }

      void main() {
         vec2 p  = gl_FragCoord.xy;
         vec2 q  = distort(p);

         // Sample the field 3× with tiny offsets per channel
         // for chromatic aberration
         float dx = 2.5;
         float r = field(q + vec2( dx,  0.0));
         float g = field(q);
         float b = field(q - vec2( dx,  0.0));

         // Iso-surface threshold
         float iso = 1.6;

         // Smooth edge inside the liquid
         vec3 col = vec3(
            smoothstep(iso - 0.15, iso + 0.5, r),
            smoothstep(iso - 0.15, iso + 0.5, g),
            smoothstep(iso - 0.15, iso + 0.5, b)
         );

         // Tint the liquid with a vaporwave gradient — pink at the
         // edges, cyan in the centre — based on field strength
         float strength = clamp((g - iso) * 0.5, 0.0, 1.0);
         vec3 hot = vec3(1.0, 0.35, 0.55);    // hot pink
         vec3 cool = vec3(0.45, 0.85, 1.0);   // cyan
         vec3 tint = mix(hot, cool, strength);
         col *= tint;

         // Add a soft outer glow halo from the raw field
         float halo = smoothstep(0.4, iso, g) * 0.35;
         col += vec3(0.55, 0.25, 0.55) * halo;

         // Grain — subtle alive texture
         float n = hash(p + uTime) * 0.04;
         col += n;

         fragColor = vec4(col, 1.0);
      }
   `

   /* ──────────────────────────────────────────────
      COMPILE / LINK
      ────────────────────────────────────────────── */
   function shader(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
         console.error(gl.getShaderInfoLog(s))
         return null
      }
      return s
   }

   const prog = gl.createProgram()
   gl.attachShader(prog, shader(gl.VERTEX_SHADER,   vert))
   gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, frag))
   gl.linkProgram(prog)
   if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog))
      return
   }
   gl.useProgram(prog)

   /* Fullscreen quad (two triangles covering clip space) */
   const buf = gl.createBuffer()
   gl.bindBuffer(gl.ARRAY_BUFFER, buf)
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,   1, -1,   -1, 1,
       1, -1,   1,  1,   -1, 1,
   ]), gl.STATIC_DRAW)

   const aPos = gl.getAttribLocation(prog, 'a_pos')
   gl.enableVertexAttribArray(aPos)
   gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

   /* Uniform locations */
   const uRes     = gl.getUniformLocation(prog, 'uRes')
   const uTime    = gl.getUniformLocation(prog, 'uTime')
   const uBlobs   = gl.getUniformLocation(prog, 'uBlobs')
   const uSizes   = gl.getUniformLocation(prog, 'uSizes')
   const uRipples = gl.getUniformLocation(prog, 'uRipples')
   const uActive  = gl.getUniformLocation(prog, 'uActiveRipples')

   /* ──────────────────────────────────────────────
      SIZE
      ────────────────────────────────────────────── */
   let W = 0, H = 0, DPR = 1
   function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W * DPR
      canvas.height = H * DPR
      canvas.style.width  = `${W}px`
      canvas.style.height = `${H}px`
      gl.viewport(0, 0, W * DPR, H * DPR)
   }
   resize()
   window.addEventListener('resize', resize)

   /* ──────────────────────────────────────────────
      BLOBS — 14 sphere followers
      blob[0] = leader (cursor); blob[1..13] = trailers
      with progressively slower lerp, so they form a chain.
      ────────────────────────────────────────────── */
   const N = 14
   const blobs = []
   for (let i = 0; i < N; i++) {
      blobs.push({
         x: window.innerWidth / 2,
         y: window.innerHeight / 2,
         r: 90 - i * 4.5,             /* leader is biggest */
         lerp: 0.2 - i * 0.012,       /* further down the chain = slower */
      })
   }

   const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

   window.addEventListener('mousemove', (e) => {
      target.x = e.clientX
      target.y = e.clientY
   })
   window.addEventListener('touchmove', (e) => {
      const t = e.touches[0]
      target.x = t.clientX
      target.y = t.clientY
   }, { passive: true })

   /* ──────────────────────────────────────────────
      RIPPLES — circular waves spawned on click
      ────────────────────────────────────────────── */
   const ripples = []   /* { x, y, t0 } — t0 = seconds */

   function press(cx, cy) {
      hint.classList.add('is-hidden')
      ripples.push({ x: cx, y: cy, t0: performance.now() / 1000 })
      if (ripples.length > 6) ripples.shift()
   }

   window.addEventListener('mousedown', (e) => press(e.clientX, e.clientY))
   window.addEventListener('touchstart', (e) => {
      const t = e.touches[0]
      press(t.clientX, t.clientY)
   })

   /* ──────────────────────────────────────────────
      RENDER LOOP
      ────────────────────────────────────────────── */
   const blobUni   = new Float32Array(N * 2)
   const sizeUni   = new Float32Array(N)
   const rippleUni = new Float32Array(6 * 3)

   const t0 = performance.now()

   function frame() {
      const now = performance.now()
      const elapsed = (now - t0) / 1000

      /* Update each blob — chained lerp */
      let prev = target
      for (let i = 0; i < N; i++) {
         const b = blobs[i]
         b.x += (prev.x - b.x) * b.lerp
         b.y += (prev.y - b.y) * b.lerp
         /* Subtle perpetual motion so they breathe */
         const wob = Math.sin(elapsed * 1.2 + i * 0.7) * (i * 1.2)
         blobUni[i * 2]     = (b.x + wob) * DPR
         blobUni[i * 2 + 1] = (H - b.y - wob) * DPR   /* flip Y for GL */
         sizeUni[i]         = b.r * DPR
         prev = b
      }

      /* Active ripples — drop ones older than 1.5s */
      const nowSec = now / 1000
      let activeCount = 0
      for (let i = 0; i < ripples.length; i++) {
         const age = nowSec - ripples[i].t0
         if (age > 1.5) continue
         rippleUni[activeCount * 3]     = ripples[i].x * DPR
         rippleUni[activeCount * 3 + 1] = (H - ripples[i].y) * DPR
         rippleUni[activeCount * 3 + 2] = age
         activeCount++
         if (activeCount >= 6) break
      }
      /* Compact array — drop expired */
      for (let i = ripples.length - 1; i >= 0; i--) {
         if (nowSec - ripples[i].t0 > 1.5) ripples.splice(i, 1)
      }

      /* Push uniforms */
      gl.uniform2f(uRes, W * DPR, H * DPR)
      gl.uniform1f(uTime, elapsed)
      gl.uniform2fv(uBlobs, blobUni)
      gl.uniform1fv(uSizes, sizeUni)
      gl.uniform3fv(uRipples, rippleUni)
      gl.uniform1f(uActive, activeCount)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      requestAnimationFrame(frame)
   }
   frame()
})
