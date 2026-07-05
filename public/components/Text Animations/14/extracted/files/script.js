
document.addEventListener('DOMContentLoaded', () => {
	gsap.registerPlugin(ScrollTrigger, SplitText, Observer)

	
	let targetVelocity = 0

	Observer.create({
		target: window,
		type: 'wheel,touch,scroll',
		onChange: self => {
			targetVelocity = Math.abs(self.deltaY) * 0.002
		},
	})

	// --------- SplitText ----------
	const textBlocks = gsap.utils.toArray('.copy-block p')
	const splitInstances = textBlocks.map(block =>
		SplitText.create(block, { type: 'words', mask: 'words' }),
	)

	gsap.set(splitInstances[1].words, { yPercent: 100 })
	gsap.set(splitInstances[2].words, { yPercent: 100 })

	const overlapCount = 3

	const getWordProgress = (phaseProgress, wordIndex, totalWords) => {
		const totalLength = 1 + overlapCount / totalWords
		const scale =
			1 /
			Math.min(
				totalLength,
				1 + (totalWords - 1) / totalWords + overlapCount / totalWords,
			)

		const startTime = (wordIndex / totalWords) * scale
		const endTime = startTime + (overlapCount / totalWords) * scale
		const duration = endTime - startTime

		if (phaseProgress <= startTime) return 0
		if (phaseProgress >= endTime) return 1
		return (phaseProgress - startTime) / duration
	}

	const animateBlock = (outBlock, inBlock, phaseProgress) => {
		outBlock.words.forEach((word, i) => {
			const p = getWordProgress(phaseProgress, i, outBlock.words.length)
			gsap.set(word, { yPercent: p * 100 })
		})

		inBlock.words.forEach((word, i) => {
			const p = getWordProgress(phaseProgress, i, inBlock.words.length)
			gsap.set(word, { yPercent: 100 - p * 100 })
		})
	}

	// --------- marquee ----------
	const indicator = document.querySelector('.scroll-indicator')
	const marqueeTrack = document.querySelector('.marquee-track')
	const items = gsap.utils.toArray('.marquee-item')

	items.forEach(item => marqueeTrack.appendChild(item.cloneNode(true)))

	let marqueePosition = 0
	let smoothVelocity = 0

	gsap.ticker.add(() => {
		// smoothing як у тебе
		smoothVelocity += (targetVelocity - smoothVelocity) * 0.5

		const baseSpeed = 0.45
		const speed = baseSpeed + smoothVelocity * 9

		marqueePosition -= speed

		const trackWidth = marqueeTrack.scrollWidth / 2
		if (marqueePosition <= -trackWidth) marqueePosition = 0

		gsap.set(marqueeTrack, { x: marqueePosition })

		
		targetVelocity *= 0.9
	})

	// --------- ScrollTrigger ----------
	ScrollTrigger.create({
		trigger: '.container',
		start: 'top top',
		end: 'bottom bottom',
		onUpdate: self => {
			const scrollProgress = self.progress

			gsap.set(indicator, { '--progress': scrollProgress })

			if (scrollProgress <= 0.5) {
				const phase1 = scrollProgress / 0.5
				animateBlock(splitInstances[0], splitInstances[1], phase1)
			} else {
				const phase2 = (scrollProgress - 0.5) / 0.5
				gsap.set(splitInstances[0].words, { yPercent: 100 })
				animateBlock(splitInstances[1], splitInstances[2], phase2)
			}
		},
	})
})
