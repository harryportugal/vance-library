;(function () {
	let container = document.getElementById('dither')
	if (!container) return
	let opts = {
		waveColor: [0.5, 0.5, 0.5],
		disableAnimation: false,
		enableMouseInteraction: true,
		mouseRadius: 0.3,
		colorNum: 4,
		waveAmplitude: 0.3,
		waveFrequency: 3,
		waveSpeed: 0.05,
		pixelSize: 2,
	}
	let canvas = document.createElement('canvas')
	canvas.style.width = '100%'
	canvas.style.height = '100%'
	canvas.style.display = 'block'
	container.appendChild(canvas)
	let gl =
		canvas.getContext('webgl', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: false,
		}) ||
		canvas.getContext('experimental-webgl', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: false,
		})
	if (!gl) return
	gl.disable(gl.DEPTH_TEST)
	gl.disable(gl.CULL_FACE)
	gl.clearColor(0, 0, 0, 0)
	let vertexSrc = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`
	let fragmentSrc = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;

uniform float uWaveSpeed;
uniform float uWaveFrequency;
uniform float uWaveAmplitude;
uniform vec3 uWaveColor;

uniform vec2 uMouse;
uniform int uEnableMouse;
uniform float uMouseRadius;

uniform float uColorNum;
uniform float uPixelSize;

varying vec2 vUv;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = uWaveFrequency;
  for (int i = 0; i < 4; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= uWaveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - uTime * uWaveSpeed;
  return fbm(p + fbm(p2));
}

float bayer8x8(int x, int y) {
  int i = y * 8 + x;
  if (i == 0) return 0.0/64.0;
  if (i == 1) return 48.0/64.0;
  if (i == 2) return 12.0/64.0;
  if (i == 3) return 60.0/64.0;
  if (i == 4) return 3.0/64.0;
  if (i == 5) return 51.0/64.0;
  if (i == 6) return 15.0/64.0;
  if (i == 7) return 63.0/64.0;

  if (i == 8) return 32.0/64.0;
  if (i == 9) return 16.0/64.0;
  if (i == 10) return 44.0/64.0;
  if (i == 11) return 28.0/64.0;
  if (i == 12) return 35.0/64.0;
  if (i == 13) return 19.0/64.0;
  if (i == 14) return 47.0/64.0;
  if (i == 15) return 31.0/64.0;

  if (i == 16) return 8.0/64.0;
  if (i == 17) return 56.0/64.0;
  if (i == 18) return 4.0/64.0;
  if (i == 19) return 52.0/64.0;
  if (i == 20) return 11.0/64.0;
  if (i == 21) return 59.0/64.0;
  if (i == 22) return 7.0/64.0;
  if (i == 23) return 55.0/64.0;

  if (i == 24) return 40.0/64.0;
  if (i == 25) return 24.0/64.0;
  if (i == 26) return 36.0/64.0;
  if (i == 27) return 20.0/64.0;
  if (i == 28) return 43.0/64.0;
  if (i == 29) return 27.0/64.0;
  if (i == 30) return 39.0/64.0;
  if (i == 31) return 23.0/64.0;

  if (i == 32) return 2.0/64.0;
  if (i == 33) return 50.0/64.0;
  if (i == 34) return 14.0/64.0;
  if (i == 35) return 62.0/64.0;
  if (i == 36) return 1.0/64.0;
  if (i == 37) return 49.0/64.0;
  if (i == 38) return 13.0/64.0;
  if (i == 39) return 61.0/64.0;

  if (i == 40) return 34.0/64.0;
  if (i == 41) return 18.0/64.0;
  if (i == 42) return 46.0/64.0;
  if (i == 43) return 30.0/64.0;
  if (i == 44) return 33.0/64.0;
  if (i == 45) return 17.0/64.0;
  if (i == 46) return 45.0/64.0;
  if (i == 47) return 29.0/64.0;

  if (i == 48) return 10.0/64.0;
  if (i == 49) return 58.0/64.0;
  if (i == 50) return 6.0/64.0;
  if (i == 51) return 54.0/64.0;
  if (i == 52) return 9.0/64.0;
  if (i == 53) return 57.0/64.0;
  if (i == 54) return 5.0/64.0;
  if (i == 55) return 53.0/64.0;

  if (i == 56) return 42.0/64.0;
  if (i == 57) return 26.0/64.0;
  if (i == 58) return 38.0/64.0;
  if (i == 59) return 22.0/64.0;
  if (i == 60) return 41.0/64.0;
  if (i == 61) return 25.0/64.0;
  if (i == 62) return 37.0/64.0;
  return 21.0/64.0;
}

vec3 dither(vec2 fragCoord, vec3 color) {
  vec2 scaled = floor(fragCoord / max(uPixelSize, 1.0));
  int x = int(mod(scaled.x, 8.0));
  int y = int(mod(scaled.y, 8.0));
  float threshold = bayer8x8(x, y) - 0.25;
  float stepv = 1.0 / max(uColorNum - 1.0, 1.0);
  color += threshold * stepv;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (uColorNum - 1.0) + 0.5) / max(uColorNum - 1.0, 1.0);
}

void main() {
  vec2 frag = gl_FragCoord.xy;

  vec2 px = vec2(max(uPixelSize, 1.0));
  vec2 fragP = px * floor(frag / px) + 0.5 * px;
  vec2 uv = fragP / uResolution;
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / uResolution.y;

  float f = pattern(p);

  if (uEnableMouse == 1) {
    vec2 mouseUV = (uMouse / uResolution);
    vec2 mouseNDC = (mouseUV - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= uResolution.x / uResolution.y;
    float dist = length(p - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, uMouseRadius, dist);
    f -= 0.5 * effect;
  }

  vec3 col = mix(vec3(0.0), uWaveColor, f);
  col = dither(frag, col);

  gl_FragColor = vec4(col, 1.0);
}
`
	function compile(type, src) {
		let sh = gl.createShader(type)
		gl.shaderSource(sh, src)
		gl.compileShader(sh)
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null
		return sh
	}
	function link(vs2, fs2) {
		let p = gl.createProgram()
		gl.attachShader(p, vs2)
		gl.attachShader(p, fs2)
		gl.linkProgram(p)
		if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null
		return p
	}
	let vs = compile(gl.VERTEX_SHADER, vertexSrc)
	let fs = compile(gl.FRAGMENT_SHADER, fragmentSrc)
	if (!vs || !fs) return
	let program = link(vs, fs)
	if (!program) return
	gl.useProgram(program)
	let posLoc = gl.getAttribLocation(program, 'position')
	let uResolutionLoc = gl.getUniformLocation(program, 'uResolution')
	let uTimeLoc = gl.getUniformLocation(program, 'uTime')
	let uWaveSpeedLoc = gl.getUniformLocation(program, 'uWaveSpeed')
	let uWaveFrequencyLoc = gl.getUniformLocation(program, 'uWaveFrequency')
	let uWaveAmplitudeLoc = gl.getUniformLocation(program, 'uWaveAmplitude')
	let uWaveColorLoc = gl.getUniformLocation(program, 'uWaveColor')
	let uMouseLoc = gl.getUniformLocation(program, 'uMouse')
	let uEnableMouseLoc = gl.getUniformLocation(program, 'uEnableMouse')
	let uMouseRadiusLoc = gl.getUniformLocation(program, 'uMouseRadius')
	let uColorNumLoc = gl.getUniformLocation(program, 'uColorNum')
	let uPixelSizeLoc = gl.getUniformLocation(program, 'uPixelSize')
	let posBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([-1, -1, 3, -1, -1, 3]),
		gl.STATIC_DRAW,
	)
	gl.enableVertexAttribArray(posLoc)
	gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
	let mouse = { x: 0, y: 0 }
	let hasMouse = false
	function setStaticUniforms() {
		gl.uniform1f(uWaveSpeedLoc, opts.waveSpeed)
		gl.uniform1f(uWaveFrequencyLoc, opts.waveFrequency)
		gl.uniform1f(uWaveAmplitudeLoc, opts.waveAmplitude)
		gl.uniform3fv(uWaveColorLoc, new Float32Array(opts.waveColor))
		gl.uniform1i(uEnableMouseLoc, opts.enableMouseInteraction ? 1 : 0)
		gl.uniform1f(uMouseRadiusLoc, opts.mouseRadius)
		gl.uniform1f(uColorNumLoc, opts.colorNum)
		gl.uniform1f(uPixelSizeLoc, opts.pixelSize)
	}
	function resize() {
		let rect = container.getBoundingClientRect()
		let dpr = Math.min(1.25, window.devicePixelRatio || 1)
		let w = Math.max(1, Math.floor(rect.width * dpr))
		let h = Math.max(1, Math.floor(rect.height * dpr))
		canvas.width = w
		canvas.height = h
		gl.viewport(0, 0, w, h)
		gl.uniform2fv(uResolutionLoc, new Float32Array([w, h]))
		if (!hasMouse) {
			mouse.x = w * 0.5
			mouse.y = h * 0.5
		}
	}
	function onPointerMove(e) {
		if (!opts.enableMouseInteraction) return
		let rect = canvas.getBoundingClientRect()
		let dpr = Math.min(1.25, window.devicePixelRatio || 1)
		mouse.x = (e.clientX - rect.left) * dpr
		mouse.y = (e.clientY - rect.top) * dpr
		hasMouse = true
	}
	window.addEventListener('resize', resize, false)
	canvas.addEventListener('pointermove', onPointerMove)
	resize()
	setStaticUniforms()
	let raf = 0
	let lastT = 0
	function loop(t) {
		raf = requestAnimationFrame(loop)
		if (t - lastT < 33) return
		lastT = t
		gl.uniform1f(uTimeLoc, opts.disableAnimation ? 0 : t * 1e-3)
		gl.uniform2fv(uMouseLoc, new Float32Array([mouse.x, mouse.y]))
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}
	raf = requestAnimationFrame(loop)
	window.Dither = {
		set: function (next) {
			if (!next) return
			if (Array.isArray(next.waveColor) && next.waveColor.length >= 3)
				opts.waveColor = [
					next.waveColor[0],
					next.waveColor[1],
					next.waveColor[2],
				]
			if (typeof next.disableAnimation === 'boolean')
				opts.disableAnimation = next.disableAnimation
			if (typeof next.enableMouseInteraction === 'boolean')
				opts.enableMouseInteraction = next.enableMouseInteraction
			if (typeof next.mouseRadius === 'number')
				opts.mouseRadius = next.mouseRadius
			if (typeof next.colorNum === 'number') opts.colorNum = next.colorNum
			if (typeof next.waveAmplitude === 'number')
				opts.waveAmplitude = next.waveAmplitude
			if (typeof next.waveFrequency === 'number')
				opts.waveFrequency = next.waveFrequency
			if (typeof next.waveSpeed === 'number') opts.waveSpeed = next.waveSpeed
			if (typeof next.pixelSize === 'number') opts.pixelSize = next.pixelSize
			setStaticUniforms()
			resize()
		},
		destroy: function () {
			cancelAnimationFrame(raf)
			window.removeEventListener('resize', resize)
			canvas.removeEventListener('pointermove', onPointerMove)
			if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
			try {
				let ext = gl.getExtension('WEBGL_lose_context')
				if (ext) ext.loseContext()
			} catch (e) {}
		},
	}
})()
