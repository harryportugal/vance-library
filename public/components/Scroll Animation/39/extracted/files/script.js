

document.addEventListener('DOMContentLoaded', () => {
   gsap.registerPlugin(ScrollTrigger)

	const features = document.querySelectorAll('.feature')
	const featureBgs = document.querySelectorAll('.feature-bg')

	const featureStartPositions = [
		{ top: 25, left: 15 },
		{ top: 12.5, left: 50 },
		{ top: 22.5, left: 75 },
		{ top: 30, left: 82.5 },
		{ top: 50, left: 20 },
		{ top: 80, left: 20 },
		{ top: 75, left: 75 },
	]

	features.forEach((feature, index) => {
		const pos = featureStartPositions[index]
		gsap.set(feature, {
			top: `${pos.top}%`,
			left: `${pos.left}%`,
		})
	})

	const featureStartDimensions = []
	featureBgs.forEach(bg => {
		const rect = bg.getBoundingClientRect()
		featureStartDimensions.push({
			width: rect.width,
			height: rect.height,
		})
	})

	const remInPixels = parseFloat(
		getComputedStyle(document.documentElement).fontSize,
	)

	const targetWidth = 3 * remInPixels
	const targetHeight = 3 * remInPixels

	const getSearchBarFinalWidth = () => (window.innerWidth < 1000 ? 20 : 25)

	let searchBarFinalWidth = getSearchBarFinalWidth()

	window.addEventListener('resize', () => {
		searchBarFinalWidth = getSearchBarFinalWidth()
		ScrollTrigger.refresh()
	})

	ScrollTrigger.create({
		trigger: '.spotlight',
		start: 'top top',
		end: `+=${window.innerHeight * 3}px`,
		pin: true,
		pinSpacing: true,
		scrub: 1,
		onUpdate: self => {
			const progress = self.progress

			if (progress <= 0.3333) {
				gsap.set('.spotlight-content', {
					y: `${-100 * (progress / 0.3333)}%`,
				})
			} else {
				gsap.set('.spotlight-content', { y: '-100%' })
			}

			if (progress <= 0.5) {
				const featureProgress = progress / 0.5

				features.forEach((feature, index) => {
					const original = featureStartPositions[index]
					gsap.set(feature, {
						top: `${original.top + (50 - original.top) * featureProgress}%`,
						left: `${original.left + (50 - original.left) * featureProgress}%`,
					})
				})

				featureBgs.forEach((bg, index) => {
					const start = featureStartDimensions[index]
					gsap.set(bg, {
						width: `${start.width + (targetWidth - start.width) * featureProgress}px`,
						height: `${start.height + (targetHeight - start.height) * featureProgress}px`,
						borderRadius: `${0.5 + (25 - 0.5) * featureProgress}rem`,
						borderWidth: `${0.125 + (0.35 - 0.125) * featureProgress}rem`,
					})
				})

				if (progress <= 0.1) {
					gsap.set('.feature-content', {
						opacity: 1 - progress / 0.1,
					})
				} else {
					gsap.set('.feature-content', { opacity: 0 })
				}
			}

			gsap.set('.features', {
				opacity: progress >= 0.5 ? 0 : 1,
			})

			gsap.set('.search-bar', {
				opacity: progress >= 0.5 ? 1 : 0,
			})

			if (progress >= 0.5 && progress <= 0.75) {
				const p = (progress - 0.5) / 0.25

				gsap.set('.search-bar', {
					width: `${3 + (searchBarFinalWidth - 3) * p}rem`,
					height: `${3 + (5 - 3) * p}rem`,
					transform: `translate(-50%, ${-50 + 250 * p}%)`,
				})

				gsap.set('.search-bar p', { opacity: 0 })
			} else if (progress > 0.75) {
				gsap.set('.search-bar', {
					width: `${searchBarFinalWidth}rem`,
					height: '5rem',
					transform: 'translate(-50%, 200%)',
				})
			}

			if (progress >= 0.75) {
				const p = (progress - 0.75) / 0.25

				gsap.set('.search-bar p', { opacity: p })

				gsap.set('.header-content', {
					y: -50 + 50 * p,
					opacity: p,
				})
			} else {
				gsap.set('.search-bar p', { opacity: 0 })
				gsap.set('.header-content', {
					y: -50,
					opacity: 0,
				})
			}
		},
	})
})
