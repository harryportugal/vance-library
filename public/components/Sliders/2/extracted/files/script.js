const sliderItems = [
  {
    title: 'Iris Vale',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80'
  },
  {
    title: 'Lina Roe',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1400&q=80'
  },
  {
    title: 'Mila Hart',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80'
  },
  {
    title: 'Noa Skye',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80'
  },
  {
    title: 'Ava Bloom',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80'
  },
  {
    title: 'Elise Moon',
    image: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=1400&q=80'
  }
]

const slider = document.querySelector('.slider')
const content = document.querySelector('.slider-content')

let activeIndex = 0
let nextIndex = 1
let isAnimating = false

function splitTextIntoSpans(element) {
  const text = element.textContent
  element.innerHTML = text
    .split('')
    .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('')
}

function createActiveSlide(item) {
  return `
    <div class="slide-active">
      <img src="${item.image}" alt="${item.title}" />
    </div>
  `
}

function createNextSlide(item) {
  return `
    <div class="slide-next">
      <div class="slide-next-img">
        <img src="${item.image}" alt="${item.title}" />
      </div>
    </div>
  `
}

function createActiveTitle(item) {
  return `
    <div class="slider-content-active">
      <h1>${item.title}</h1>
    </div>
  `
}

function createNextTitle(item) {
  return `
    <div class="slider-content-next">
      <h1>${item.title}</h1>
    </div>
  `
}

function revealNextPreview() {
  gsap.to('.slide-next-img', {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    duration: 0.7,
    ease: 'power3.out'
  })
}

function renderState() {
  slider.innerHTML = `
    ${createActiveSlide(sliderItems[activeIndex])}
    ${createNextSlide(sliderItems[nextIndex])}
  `

  content.innerHTML = `
    ${createActiveTitle(sliderItems[activeIndex])}
    ${createNextTitle(sliderItems[nextIndex])}
  `

  gsap.set('.slide-next-img', {
    clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    width: window.innerWidth <= 640 ? 200 : 250,
    height: window.innerWidth <= 640 ? 280 : 350
  })

  gsap.set('.slider-content-next', {
    top: window.innerWidth <= 640 ? '140px' : '200px'
  })
}

function animateSlider() {
  if (isAnimating) return
  isAnimating = true

  const activeSlide = document.querySelector('.slide-active')
  const activeImage = activeSlide.querySelector('img')
  const nextSlide = document.querySelector('.slide-next')
  const nextImageWrap = nextSlide.querySelector('.slide-next-img')

  const activeTitleWrap = document.querySelector('.slider-content-active')
  const nextTitleWrap = document.querySelector('.slider-content-next')
  const activeTitle = activeTitleWrap.querySelector('h1')
  const nextTitle = nextTitleWrap.querySelector('h1')

  splitTextIntoSpans(activeTitle)
  splitTextIntoSpans(nextTitle)

  gsap.set(nextTitle.querySelectorAll('span'), {
    top: window.innerWidth <= 640 ? '140px' : '200px'
  })

  const tl = gsap.timeline({
    onComplete: () => {
      activeIndex = nextIndex
      nextIndex = (nextIndex + 1) % sliderItems.length

      renderState()
      revealNextPreview()

      isAnimating = false
    }
  })

  tl.to(activeImage, {
    scale: 1.8,
    duration: 1.5,
    ease: 'power3.out'
  }, 0)

  tl.to(activeTitle.querySelectorAll('span'), {
    top: '-175px',
    stagger: 0.04,
    duration: 0.38,
    ease: 'power3.out'
  }, 0)

  tl.to(activeTitleWrap, {
    top: '-175px',
    duration: 0.2,
    ease: 'power3.out'
  }, 0.16)

  tl.to(nextTitleWrap, {
    top: '0px',
    duration: 0.85,
    ease: 'power3.out'
  }, 0)

  tl.to(nextTitle.querySelectorAll('span'), {
    top: 0,
    stagger: 0.04,
    duration: 0.4,
    ease: 'power3.out'
  }, 0.22)

  tl.to(nextImageWrap, {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    duration: 0.7,
    ease: 'power3.out'
  }, 0.18)

  tl.to(nextImageWrap, {
    width: '100vw',
    height: '100vh',
    duration: 1.6,
    ease: 'power3.out'
  }, 0.18)
}

document.addEventListener('click', animateSlider)

renderState()
revealNextPreview()
