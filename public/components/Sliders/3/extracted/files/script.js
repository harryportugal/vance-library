CustomEase.create('stackEase', '0.83, 0, 0.17, 1')

let isAnimating = false

function splitText(selector) {
  const elements = document.querySelectorAll(selector)

  elements.forEach(element => {
    const text = element.innerText
    const chars = text
      .split('')
      .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('')

    element.innerHTML = chars
  })
}

function positionCards() {
  const cards = Array.from(document.querySelectorAll('.card'))

  gsap.to(cards, {
    y: index => `${-18 + 18 * index}%`,
    z: index => 18 * index,
    duration: 1,
    ease: 'stackEase',
    stagger: -0.08
  })
}

function prepareCardText() {
  gsap.set('.copy h1 span', { y: -220 })
  gsap.set('.copy p span', { y: 60, opacity: 0 })
  gsap.set('.slider .card:last-child .copy h1 span', { y: 0 })
  gsap.set('.slider .card:last-child .copy p span', { y: 0, opacity: 1 })
}

document.addEventListener('DOMContentLoaded', () => {
  splitText('.copy h1')
  splitText('.copy p')
  positionCards()
  prepareCardText()
})

document.addEventListener('click', () => {
  if (isAnimating) return
  isAnimating = true

  const slider = document.querySelector('.slider')
  const cards = Array.from(slider.querySelectorAll('.card'))
  const lastCard = cards.pop()
  const upcomingCard = cards[cards.length - 1]

  const currentTitleChars = lastCard.querySelectorAll('.copy h1 span')
  const currentMetaChars = lastCard.querySelectorAll('.copy p span')
  const nextTitleChars = upcomingCard.querySelectorAll('.copy h1 span')
  const nextMetaChars = upcomingCard.querySelectorAll('.copy p span')

  gsap.to(currentTitleChars, {
    y: 220,
    duration: 0.7,
    ease: 'stackEase',
    stagger: 0.03
  })

  gsap.to(currentMetaChars, {
    y: 40,
    opacity: 0,
    duration: 0.45,
    ease: 'power3.out',
    stagger: 0.015
  })

  gsap.to(lastCard, {
    y: '+=160%',
    duration: 0.78,
    ease: 'stackEase',
    onComplete: () => {
      slider.prepend(lastCard)
      positionCards()

      gsap.set(lastCard.querySelectorAll('.copy h1 span'), { y: -220 })
      gsap.set(lastCard.querySelectorAll('.copy p span'), { y: 60, opacity: 0 })

      setTimeout(() => {
        isAnimating = false
      }, 420)
    }
  })

  gsap.to(nextTitleChars, {
    y: 0,
    duration: 0.9,
    ease: 'stackEase',
    stagger: 0.04
  })

  gsap.to(nextMetaChars, {
    y: 0,
    opacity: 1,
    duration: 0.55,
    ease: 'power3.out',
    stagger: 0.02,
    delay: 0.12
  })
})
