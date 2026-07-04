
;(function () {
	const throttle = (fn, limit) => {
		let last = 0
		return function (...args) {
			const now = performance.now()
			if (now - last >= limit) {
				last = now
				fn.apply(this, args)
			}
		}
	}

	const num = (v, fallback) => {
		const n = Number(v)
		return Number.isFinite(n) ? n : fallback
	}

	const hexToRgb = hex => {
		const m = String(hex)
			.trim()
			.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
		if (!m) return { r: 0, g: 0, b: 0 }
		return {
			r: parseInt(m[1], 16),
			g: parseInt(m[2], 16),
			b: parseInt(m[3], 16),
		}
	}

	const initOne = root => {
		if (root._dgCleanup) root._dgCleanup()

		const wrap = root.querySelector('.dot-grid__wrap')
		const canvas = root.querySelector('.dot-grid__canvas')
		if (!wrap || !canvas) return

		const dotSize = num(root.dataset.dotSize, 16)
		const gap = num(root.dataset.gap, 32)
		const baseColor = root.dataset.baseColor || '#5227FF'
		const activeColor = root.dataset.activeColor || '#5227FF'
		const proximity = num(root.dataset.proximity, 150)
		const speedTrigger = num(root.dataset.speedTrigger, 100)
		const shockRadius = num(root.dataset.shockRadius, 250)
		const shockStrength = num(root.dataset.shockStrength, 5)
		const maxSpeed = num(root.dataset.maxSpeed, 5000)
		const resistance = num(root.dataset.resistance, 750)
		const returnDuration = num(root.dataset.returnDuration, 1.5)
		const height = num(root.dataset.height, 600)

		wrap.style.height = `${height}px`

		const baseRgb = hexToRgb(baseColor)
		const activeRgb = hexToRgb(activeColor)

		const ctx = canvas.getContext('2d')
		const dots = []
		const pointer = {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			speed: 0,
			lastTime: 0,
			lastX: 0,
			lastY: 0,
		}

		let dpr = 1
		let w = 1
		let h = 1
		let proxSq = proximity * proximity
		let circlePath = null

		const buildGrid = () => {
			const rect = wrap.getBoundingClientRect()
			dpr = Math.max(1, window.devicePixelRatio || 1)
			w = rect.width
			h = rect.height

			canvas.width = Math.max(1, Math.floor(w * dpr))
			canvas.height = Math.max(1, Math.floor(h * dpr))
			canvas.style.width = `${w}px`
			canvas.style.height = `${h}px`

			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.scale(dpr, dpr)

			proxSq = proximity * proximity

			circlePath = null
			if (window.Path2D) {
				const p = new Path2D()
				p.arc(0, 0, dotSize / 2, 0, Math.PI * 2)
				circlePath = p
			}

			const cols = Math.floor((w + gap) / (dotSize + gap))
			const rows = Math.floor((h + gap) / (dotSize + gap))
			const cell = dotSize + gap

			const gridW = cell * cols - gap
			const gridH = cell * rows - gap

			const extraX = w - gridW
			const extraY = h - gridH

			const startX = extraX / 2 + dotSize / 2
			const startY = extraY / 2 + dotSize / 2

			dots.length = 0
			for (let yy = 0; yy < rows; yy++) {
				for (let xx = 0; xx < cols; xx++) {
					const cx = startX + xx * cell
					const cy = startY + yy * cell
					dots.push({ cx, cy, xOffset: 0, yOffset: 0, vx: 0, vy: 0 })
				}
			}
		}

		const setPointer = (clientX, clientY) => {
			const rect = canvas.getBoundingClientRect()
			pointer.x = clientX - rect.left
			pointer.y = clientY - rect.top
		}

		const applyImpulse = (dot, ix, iy) => {
			dot.vx += ix
			dot.vy += iy
		}

		let raf = 0
		let last = performance.now()

		const tick = now => {
			raf = requestAnimationFrame(tick)
			const dtMs = Math.min(32, now - last)
			last = now
			const dt = dtMs / 1000

			ctx.clearRect(0, 0, w, h)

			const px = pointer.x
			const py = pointer.y

			const omega = 8 / Math.max(0.05, returnDuration)
			const k = omega * omega
			const c = 2 * omega
			const drag = Math.exp(-dtMs / Math.max(60, resistance))

			for (let i = 0; i < dots.length; i++) {
				const dot = dots[i]

				dot.vx += (-k * dot.xOffset - c * dot.vx) * dt
				dot.vy += (-k * dot.yOffset - c * dot.vy) * dt

				dot.vx *= drag
				dot.vy *= drag

				dot.xOffset += dot.vx * dt
				dot.yOffset += dot.vy * dt

				const ox = dot.cx + dot.xOffset
				const oy = dot.cy + dot.yOffset

				const dx = dot.cx - px
				const dy = dot.cy - py
				const dsq = dx * dx + dy * dy

				let style = baseColor
				if (dsq <= proxSq) {
					const dist = Math.sqrt(dsq)
					const t = 1 - dist / proximity
					const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t)
					const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t)
					const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t)
					style = `rgb(${r},${g},${b})`
				}

				ctx.save()
				ctx.translate(ox, oy)
				ctx.fillStyle = style
				if (circlePath) ctx.fill(circlePath)
				else {
					ctx.beginPath()
					ctx.arc(0, 0, dotSize / 2, 0, Math.PI * 2)
					ctx.fill()
				}
				ctx.restore()
			}
		}

		const onMove = e => {
			const now = performance.now()
			const dt = pointer.lastTime ? now - pointer.lastTime : 16
			const dx = e.clientX - pointer.lastX
			const dy = e.clientY - pointer.lastY

			let vx = (dx / dt) * 1000
			let vy = (dy / dt) * 1000
			let sp = Math.hypot(vx, vy)

			if (sp > maxSpeed) {
				const s = maxSpeed / sp
				vx *= s
				vy *= s
				sp = maxSpeed
			}

			pointer.lastTime = now
			pointer.lastX = e.clientX
			pointer.lastY = e.clientY
			pointer.vx = vx
			pointer.vy = vy
			pointer.speed = sp

			setPointer(e.clientX, e.clientY)

			if (sp <= speedTrigger) return

			const px = pointer.x
			const py = pointer.y

			for (let i = 0; i < dots.length; i++) {
				const dot = dots[i]
				const dist = Math.hypot(dot.cx - px, dot.cy - py)
				if (dist < proximity) {
					const fall = Math.max(0, 1 - dist / proximity)
					const pushX = (dot.cx - px + vx * 0.01) * fall
					const pushY = (dot.cy - py + vy * 0.01) * fall
					applyImpulse(dot, pushX * 12, pushY * 12)
				}
			}
		}

		const onClick = e => {
			setPointer(e.clientX, e.clientY)
			const cx = pointer.x
			const cy = pointer.y

			for (let i = 0; i < dots.length; i++) {
				const dot = dots[i]
				const dist = Math.hypot(dot.cx - cx, dot.cy - cy)
				if (dist < shockRadius) {
					const falloff = Math.max(0, 1 - dist / shockRadius)
					const pushX = (dot.cx - cx) * shockStrength * falloff
					const pushY = (dot.cy - cy) * shockStrength * falloff
					applyImpulse(dot, pushX * 18, pushY * 18)
				}
			}
		}

		buildGrid()

		const ro = new ResizeObserver(buildGrid)
		ro.observe(wrap)

		const throttledMove = throttle(onMove, 16)
		window.addEventListener('mousemove', throttledMove, { passive: true })
		window.addEventListener('click', onClick)

		raf = requestAnimationFrame(tick)

		root._dgCleanup = () => {
			cancelAnimationFrame(raf)
			ro.disconnect()
			window.removeEventListener('mousemove', throttledMove)
			window.removeEventListener('click', onClick)
			dots.length = 0
		}
	}

	const initAll = () => {
		document.querySelectorAll('[data-dot-grid]').forEach(initOne)
	}

	if (document.readyState === 'loading')
		document.addEventListener('DOMContentLoaded', initAll)
	else initAll()
})()