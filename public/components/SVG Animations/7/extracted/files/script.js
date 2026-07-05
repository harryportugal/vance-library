
gsap.registerPlugin(SplitText)

const cardContainers = document.querySelectorAll('.card-container')

cardContainers.forEach(cardContainer => {
	const cardPaths = cardContainer.querySelectorAll('.svg-stroke path')
	const cardTitle = cardContainer.querySelector('.card-title h3')

	if (!cardTitle) return

	const split = SplitText.create(cardTitle, {
		type: 'words',
		mask: 'words',
		wordsClass: 'word',
	})

	gsap.set(split.words, { yPercent: 100 })

	cardPaths.forEach(path => {
		const length = path.getTotalLength()
		path.style.strokeDasharray = length
		path.style.strokeDashoffset = length
	})

	let tl = null

	const onEnter = () => {
		tl?.kill()
		tl = gsap.timeline()

		cardPaths.forEach(path => {
			tl.to(
				path,
				{
					strokeDashoffset: 0,
					attr: { 'stroke-width': 700 },
					duration: 1.5,
					ease: 'power2.out',
				},
				0,
			)
		})

		tl.to(
			split.words,
			{
				yPercent: 0,
				duration: 0.75,
				ease: 'power3.out',
				stagger: 0.075,
			},
			0.35,
		)
	}

	const onLeave = () => {
		tl?.kill()
		tl = gsap.timeline()

		cardPaths.forEach(path => {
			const length = path.getTotalLength()
			tl.to(
				path,
				{
					strokeDashoffset: length,
					attr: { 'stroke-width': 200 },
					duration: 1,
					ease: 'power2.out',
				},
				0,
			)
		})

		tl.to(
			split.words,
			{
				yPercent: 100,
				duration: 0.5,
				ease: 'power3.out',
				stagger: { each: 0.05, from: 'end' },
			},
			0,
		)
	}

	cardContainer.addEventListener('mouseenter', onEnter)
	cardContainer.addEventListener('mouseleave', onLeave)

	// cleanup (корисно для Vite HMR / SPA)
	window.addEventListener(
		'beforeunload',
		() => {
			tl?.kill()
			split.revert()
		},
		{ once: true },
	)
})
