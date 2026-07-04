document.addEventListener('DOMContentLoaded', () => {
	/* ── DOM ── */
	const stack = document.getElementById('js-labels-stack')
	const veil = document.getElementById('js-veil')
	const strip = document.getElementById('js-strip')
	const tiles = strip.querySelectorAll('.tile')
	const feature = document.getElementById('js-feature')
	const title = document.getElementById('js-title')

	/* ──────────────────────────────────────────────
      WORD SPLIT
      ────────────────────────────────────────────── */
	function splitWords(el) {
		const raw = el.textContent.trim()
		el.textContent = ''
		const parts = raw.split(/\s+/)

		const wordNodes = []

		parts.forEach((word, i) => {
			const mask = document.createElement('span')
			mask.className = 'word-mask'

			const inner = document.createElement('span')
			inner.className = 'word'
			inner.textContent = word

			mask.appendChild(inner)
			el.appendChild(mask)
			wordNodes.push(inner)

			if (i < parts.length - 1) {
				const space = document.createElement('span')
				space.className = 'word-space'
				el.appendChild(space)
			}
		})

		return wordNodes
	}

	const words = splitWords(title)

	/* ──────────────────────────────────────────────
      LABEL SETUP — new animation style
      Each label is stacked in the same spot and
      animated individually with blur + slide.
      ────────────────────────────────────────────── */
	const labels = gsap.utils.toArray('#js-labels-stack li')

	gsap.set(stack, {
		position: 'relative',
		height: '100%',
	})

	gsap.set(labels, {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		yPercent: 100,
		opacity: 0,
		filter: 'blur(8px)',
	})

	if (labels[0]) {
		gsap.set(labels[0], {
			yPercent: 0,
			opacity: 1,
			filter: 'blur(0px)',
		})
	}

	/* ──────────────────────────────────────────────
      INITIAL STATES
      ────────────────────────────────────────────── */
	const tileRotations = [-10, -5, 0, 5, 10]
	const tileOffsetsX = [-80, -40, 0, 40, 80]

	gsap.set(tiles, {
		y: '18%',
		x: i => tileOffsetsX[i] || 0,
		rotation: i => tileRotations[i] || 0,
		scale: 0.72,
		opacity: 0,
		clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
		transformOrigin: '50% 50%',
	})

	gsap.set(words, { y: '100%' })

	/* ──────────────────────────────────────────────
      MAIN TIMELINE
      ────────────────────────────────────────────── */
	const EASE = 'power3.inOut'
	const tl = gsap.timeline({ delay: 0.5 })

	/* 1. Labels cycle — blur + slide version */
	labels.forEach((label, index) => {
		if (index === 0) return

		tl.to(
			labels[index - 1],
			{
				yPercent: -100,
				opacity: 0,
				filter: 'blur(8px)',
				duration: 0.6,
				ease: EASE,
			},
			index === 1 ? 0.25 : '+=0.35',
		)

		tl.fromTo(
			label,
			{
				yPercent: 100,
				opacity: 0,
				filter: 'blur(8px)',
			},
			{
				yPercent: 0,
				opacity: 1,
				filter: 'blur(0px)',
				duration: 0.6,
				ease: EASE,
			},
			'<',
		)
	})

	/* 2. Tiles reveal */
	tl.to(
		tiles,
		{
			y: 0,
			x: 0,
			rotation: 0,
			opacity: 1,
			scale: 0.82,
			duration: 1.1,
			stagger: 0.06,
			ease: 'power3.out',
		},
		0,
	)

	/* 3. Small settle */
	tl.to(
		tiles,
		{
			scale: 0.8,
			duration: 0.35,
			stagger: 0.04,
			ease: 'power2.out',
		},
		'>-0.25',
	)

	/* 4. Strip collapses */
	tl.to(
		strip,
		{
			gap: '0.75vw',
			duration: 1,
			ease: EASE,
		},
		1.5,
	)

	/* 5. Tiles scale to full size */
	tl.to(
		tiles,
		{
			scale: 1,
			duration: 1,
			ease: EASE,
		},
		'<',
	)

	/* 6. Hide all non-feature tiles */
	const others = [...tiles].filter(t => t !== feature)

	tl.to(
		others,
		{
			clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
			duration: 1,
			stagger: 0.1,
			ease: EASE,
		},
		2.5,
	)

	/* 7. Feature image scales up */
	tl.to(
		feature,
		{
			scale: 2,
			duration: 1,
			ease: EASE,
		},
		3.5,
	)

	/* 8. Dark veil lifts */
	tl.to(
		veil,
		{
			clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
			duration: 1,
			ease: EASE,
		},
		4.5,
	)

	/* 9. Title reveal */
	tl.to(
		words,
		{
			y: 0,
			duration: 0.75,
			stagger: 0.1,
			ease: 'power3.out',
		},
		4.0,
	)
})
