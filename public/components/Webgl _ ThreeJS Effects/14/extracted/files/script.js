const textContainer = document.getElementById('textContainer')

let scene, camera, renderer, planeMesh
let easeFactor = 0.02

let mousePosition = { x: 0.5, y: 0.5 }
let targetMousePosition = { x: 0.5, y: 0.5 }
let prevPosition = { x: 0.5, y: 0.5 }

// --------------------
// SHADERS (grid + strength з uniforms)
// --------------------
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse;
  uniform float u_grid;
  uniform float u_strength;

  void main() {
    vec2 gridUV = floor(vUv * vec2(u_grid, u_grid)) / vec2(u_grid, u_grid);
    vec2 centerOfPixel = gridUV + vec2(1.0/u_grid, 1.0/u_grid);

    vec2 mouseDirection = u_mouse - u_prevMouse;

    vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
    float pixelDistanceToMouse = length(pixelToMouseDirection);
    float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

    vec2 uvOffset = strength * -mouseDirection * u_strength;
    vec2 uv = vUv - uvOffset;

    vec4 color = texture2D(u_texture, uv);
    gl_FragColor = color;
  }
`

// --------------------
// READ OPTIONS FROM HTML
// --------------------
function readOptions() {
	const d = textContainer.dataset

	return {
		text: (
			textContainer.dataset.text ||
			textContainer.textContent ||
			'TEXT'
		).trim(),
		font: d.font || 'Blanquotey',
		fontWeight: d.fontWeight || '100',
		bg: d.bg || '#ffffff',
		color: d.color || '#1a1a1a',
		grid: Number(d.grid || 40),
		strength: Number(d.strength || 0.4),
		easeMove: Number(d.easeMove || 0.035),
		easeIdle: Number(d.easeIdle || 0.01),
	}
}

// --------------------
// TEXTURE
// --------------------
function createTextTexture({ text, font, fontWeight, bg, color }) {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')

	const canvasWidth = window.innerWidth * 2
	const canvasHeight = window.innerHeight * 2

	canvas.width = canvasWidth
	canvas.height = canvasHeight

	// background
	ctx.fillStyle = bg
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// auto font size (по ширині)
	const baseFontSize = Math.floor(canvasWidth * 0.22) // адекватний дефолт
	ctx.fillStyle = color
	ctx.font = `${fontWeight} ${baseFontSize}px "${font}"`
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'

	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'high'

	const textMetrics = ctx.measureText(text)
	const textWidth = Math.max(1, textMetrics.width)

	const scaleFactor = Math.min(1.0, (canvasWidth * 0.85) / textWidth)
	const aspectCorrection = canvasWidth / canvasHeight

	ctx.setTransform(
		scaleFactor,
		0,
		0,
		scaleFactor / aspectCorrection,
		canvasWidth / 2,
		canvasHeight / 2,
	)

	// outline (можеш прибрати якщо не треба)
	ctx.strokeStyle = color
	ctx.lineWidth = baseFontSize * 0.005
	for (let i = 0; i < 3; i++) ctx.strokeText(text, 0, 0)

	ctx.fillText(text, 0, 0)

	const tex = new THREE.CanvasTexture(canvas)
	tex.needsUpdate = true
	return tex
}

// --------------------
// SCENE
// --------------------
function initializeScene() {
	const opt = readOptions()
	const texture = createTextTexture(opt)

	scene = new THREE.Scene()

	const aspectRatio = window.innerWidth / window.innerHeight
	camera = new THREE.OrthographicCamera(
		-1,
		1,
		1 / aspectRatio,
		-1 / aspectRatio,
		0.1,
		1000,
	)
	camera.position.z = 1

	const uniforms = {
		u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
		u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
		u_texture: { value: texture },
		u_grid: { value: opt.grid },
		u_strength: { value: opt.strength },
	}

	planeMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(2, 2),
		new THREE.ShaderMaterial({
			uniforms,
			vertexShader,
			fragmentShader,
		}),
	)

	scene.add(planeMesh)

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setClearColor(0xffffff, 1)
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(window.devicePixelRatio)

	textContainer.innerHTML = '' // прибираємо текст, щоб не дублювався
	textContainer.appendChild(renderer.domElement)

	// виставимо initial ease
	easeFactor = opt.easeIdle
}

// --------------------
// UPDATE TEXTURE FROM HTML
// --------------------
function reloadTextureFromHTML() {
	const opt = readOptions()
	const newTexture = createTextTexture(opt)

	// оновити uniforms
	planeMesh.material.uniforms.u_texture.value = newTexture
	planeMesh.material.uniforms.u_grid.value = opt.grid
	planeMesh.material.uniforms.u_strength.value = opt.strength
}

// --------------------
// ANIMATION
// --------------------
function animateScene() {
	requestAnimationFrame(animateScene)

	mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor
	mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor

	planeMesh.material.uniforms.u_mouse.value.set(
		mousePosition.x,
		1.0 - mousePosition.y,
	)
	planeMesh.material.uniforms.u_prevMouse.value.set(
		prevPosition.x,
		1.0 - prevPosition.y,
	)

	renderer.render(scene, camera)
}

// --------------------
// EVENTS
// --------------------
function handleMouseMove(event) {
	const opt = readOptions()
	easeFactor = opt.easeMove

	const rect = textContainer.getBoundingClientRect()
	prevPosition = { ...targetMousePosition }

	targetMousePosition.x = (event.clientX - rect.left) / rect.width
	targetMousePosition.y = (event.clientY - rect.top) / rect.height
}

function handleMouseEnter(event) {
	const opt = readOptions()
	easeFactor = opt.easeIdle

	const rect = textContainer.getBoundingClientRect()
	mousePosition.x = targetMousePosition.x =
		(event.clientX - rect.left) / rect.width
	mousePosition.y = targetMousePosition.y =
		(event.clientY - rect.top) / rect.height
}

function handleMouseLeave() {
	const opt = readOptions()
	easeFactor = opt.easeIdle
	targetMousePosition = { ...prevPosition }
}

function onWindowResize() {
	const aspectRatio = window.innerWidth / window.innerHeight

	camera.left = -1
	camera.right = 1
	camera.top = 1 / aspectRatio
	camera.bottom = -1 / aspectRatio
	camera.updateProjectionMatrix()

	renderer.setSize(window.innerWidth, window.innerHeight)

	reloadTextureFromHTML()
}

// --------------------
// INIT
// --------------------
initializeScene()
animateScene()

textContainer.addEventListener('mousemove', handleMouseMove)
textContainer.addEventListener('mouseenter', handleMouseEnter)
textContainer.addEventListener('mouseleave', handleMouseLeave)
window.addEventListener('resize', onWindowResize, false)


const observer = new MutationObserver(() => reloadTextureFromHTML())
observer.observe(document.getElementById('textContainer'), {
	childList: true,
	characterData: true,
	subtree: true,
	attributes: true,
})
