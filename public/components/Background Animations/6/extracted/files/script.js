;(function () {
	let container = document.getElementById('liquidChrome')
	if (!container) return
	let opts = {
		baseColor: [0.1, 0.1, 0.1],
		speed: 1,
		amplitude: 0.6,
		frequencyX: 3,
		frequencyY: 3,
		interactive: true,
	}
	let canvas = document.createElement('canvas')
	canvas.style.width = '100%'
	canvas.style.height = '100%'
	canvas.style.display = 'block'
	container.appendChild(canvas)
	let gl =
		canvas.getContext('webgl', { alpha: true, antialias: true }) ||
		canvas.getContext('experimental-webgl', { alpha: true, antialias: true })
	if (!gl) return
	gl.clearColor(1, 1, 1, 1)
	let vertexShaderSrc =
		'attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.0,1.0);}'
	let fragmentShaderSrc =
		'precision highp float;uniform float uTime;uniform vec3 uResolution;uniform vec3 uBaseColor;uniform float uAmplitude;uniform float uFrequencyX;uniform float uFrequencyY;uniform vec2 uMouse;varying vec2 vUv;vec4 renderImage(vec2 uvCoord){vec2 fragCoord=uvCoord*uResolution.xy;vec2 uv=(2.0*fragCoord-uResolution.xy)/min(uResolution.x,uResolution.y);for(float i=1.0;i<10.0;i++){uv.x+=uAmplitude/i*cos(i*uFrequencyX*uv.y+uTime+uMouse.x*3.14159);uv.y+=uAmplitude/i*cos(i*uFrequencyY*uv.x+uTime+uMouse.y*3.14159);}vec2 diff=(uvCoord-uMouse);float dist=length(diff);float falloff=exp(-dist*20.0);float ripple=sin(10.0*dist-uTime*2.0)*0.03;uv+=(diff/(dist+0.0001))*ripple*falloff;vec3 color=uBaseColor/abs(sin(uTime-uv.y-uv.x));return vec4(color,1.0);}void main(){vec4 col=vec4(0.0);int samples=0;for(int i=-1;i<=1;i++){for(int j=-1;j<=1;j++){vec2 offset=vec2(float(i),float(j))*(1.0/min(uResolution.x,uResolution.y));col+=renderImage(vUv+offset);samples++;}}gl_FragColor=col/float(samples);}'
	function compile(type, src) {
		let sh = gl.createShader(type)
		gl.shaderSource(sh, src)
		gl.compileShader(sh)
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
			gl.deleteShader(sh)
			return null
		}
		return sh
	}
	function link(vs2, fs2) {
		let p = gl.createProgram()
		gl.attachShader(p, vs2)
		gl.attachShader(p, fs2)
		gl.linkProgram(p)
		if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
			gl.deleteProgram(p)
			return null
		}
		return p
	}
	let vs = compile(gl.VERTEX_SHADER, vertexShaderSrc)
	let fs = compile(gl.FRAGMENT_SHADER, fragmentShaderSrc)
	if (!vs || !fs) return
	let program = link(vs, fs)
	if (!program) return
	gl.useProgram(program)
	gl.deleteShader(vs)
	gl.deleteShader(fs)
	let posLoc = gl.getAttribLocation(program, 'position')
	let uvLoc = gl.getAttribLocation(program, 'uv')
	let uTimeLoc = gl.getUniformLocation(program, 'uTime')
	let uResolutionLoc = gl.getUniformLocation(program, 'uResolution')
	let uBaseColorLoc = gl.getUniformLocation(program, 'uBaseColor')
	let uAmplitudeLoc = gl.getUniformLocation(program, 'uAmplitude')
	let uFrequencyXLoc = gl.getUniformLocation(program, 'uFrequencyX')
	let uFrequencyYLoc = gl.getUniformLocation(program, 'uFrequencyY')
	let uMouseLoc = gl.getUniformLocation(program, 'uMouse')
	let posBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([-1, -1, 3, -1, -1, 3]),
		gl.STATIC_DRAW,
	)
	gl.enableVertexAttribArray(posLoc)
	gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
	let uvBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([0, 0, 2, 0, 0, 2]),
		gl.STATIC_DRAW,
	)
	gl.enableVertexAttribArray(uvLoc)
	gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)
	let state = {
		mouse: new Float32Array([0, 0]),
		raf: 0,
	}
	function setUniforms() {
		gl.uniform3fv(uBaseColorLoc, new Float32Array(opts.baseColor))
		gl.uniform1f(uAmplitudeLoc, opts.amplitude)
		gl.uniform1f(uFrequencyXLoc, opts.frequencyX)
		gl.uniform1f(uFrequencyYLoc, opts.frequencyY)
		gl.uniform2fv(uMouseLoc, state.mouse)
	}
	function resize() {
		let rect = container.getBoundingClientRect()
		let w = Math.max(1, Math.floor(rect.width))
		let h = Math.max(1, Math.floor(rect.height))
		if (canvas.width !== w) canvas.width = w
		if (canvas.height !== h) canvas.height = h
		gl.viewport(0, 0, w, h)
		gl.uniform3fv(uResolutionLoc, new Float32Array([w, h, w / h]))
		if (state.mouse[0] === 0 && state.mouse[1] === 0) {
			state.mouse[0] = 0.5
			state.mouse[1] = 0.5
			gl.uniform2fv(uMouseLoc, state.mouse)
		}
	}
	function onMouseMove(e) {
		let rect = container.getBoundingClientRect()
		let x = (e.clientX - rect.left) / rect.width
		let y = 1 - (e.clientY - rect.top) / rect.height
		state.mouse[0] = x
		state.mouse[1] = y
		gl.uniform2fv(uMouseLoc, state.mouse)
	}
	function onTouchMove(e) {
		if (!e.touches || !e.touches.length) return
		let t = e.touches[0]
		let rect = container.getBoundingClientRect()
		let x = (t.clientX - rect.left) / rect.width
		let y = 1 - (t.clientY - rect.top) / rect.height
		state.mouse[0] = x
		state.mouse[1] = y
		gl.uniform2fv(uMouseLoc, state.mouse)
	}
	setUniforms()
	resize()
	window.addEventListener('resize', resize)
	if (opts.interactive) {
		container.addEventListener('mousemove', onMouseMove)
		container.addEventListener('touchmove', onTouchMove)
	}
	function loop(t) {
		state.raf = requestAnimationFrame(loop)
		gl.uniform1f(uTimeLoc, t * 1e-3 * opts.speed)
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}
	state.raf = requestAnimationFrame(loop)
	window.LiquidChrome = {
		set: function (next) {
			if (!next) return
			if (Array.isArray(next.baseColor) && next.baseColor.length >= 3)
				opts.baseColor = [
					next.baseColor[0],
					next.baseColor[1],
					next.baseColor[2],
				]
			if (typeof next.speed === 'number') opts.speed = next.speed
			if (typeof next.amplitude === 'number') opts.amplitude = next.amplitude
			if (typeof next.frequencyX === 'number') opts.frequencyX = next.frequencyX
			if (typeof next.frequencyY === 'number') opts.frequencyY = next.frequencyY
			if (typeof next.interactive === 'boolean') {
				opts.interactive = next.interactive
				if (opts.interactive) {
					container.addEventListener('mousemove', onMouseMove)
					container.addEventListener('touchmove', onTouchMove)
				} else {
					container.removeEventListener('mousemove', onMouseMove)
					container.removeEventListener('touchmove', onTouchMove)
				}
			}
			setUniforms()
			resize()
		},
		destroy: function () {
			cancelAnimationFrame(state.raf)
			window.removeEventListener('resize', resize)
			container.removeEventListener('mousemove', onMouseMove)
			container.removeEventListener('touchmove', onTouchMove)
			if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
			try {
				let ext = gl.getExtension('WEBGL_lose_context')
				if (ext) ext.loseContext()
			} catch (e) {}
		},
	}
})()
