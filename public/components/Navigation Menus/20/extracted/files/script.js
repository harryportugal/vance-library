
const pageRoot = document.getElementById('page-root')
const nav = document.querySelector('nav')
const app = document.querySelector('.App')
const menuOpenBtn = document.querySelector('.hamburger-menu')
const menuCloseBtn = document.querySelector('.hamburger-menu-close')
const circle = document.getElementById('circle')
const path1 = document.getElementById('Path_1')
const path2 = document.getElementById('Path_2')
const line1 = document.getElementById('Line_1')
const introOverlay = document.querySelector('.intro-overlay')

const routes = {
  '/': { title: 'Home', type: 'home' },
  '/case-studies': { title: 'This is the case studies page', type: 'simple' },
  '/approach': { title: 'This is the approach page', type: 'simple' },
  '/services': { title: 'This is the services page', type: 'simple' },
  '/about-us': { title: 'This is the About page', type: 'simple' }
}

let menuOpened = false
let homeIntroPlayed = false
let dimensions = {
  width: window.innerWidth,
  height: window.innerHeight
}

function setViewportHeight() {
  const vh = dimensions.height * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

function showBody() {
  gsap.set('body', { visibility: 'visible' })
}

function cloneTemplate(id) {
  return document.getElementById(id).content.cloneNode(true)
}

function renderRoute(pathname) {
  const route = routes[pathname] || routes['/']
  pageRoot.innerHTML = ''

  if (route.type === 'home') {
    pageRoot.appendChild(cloneTemplate('home-template'))
    setViewportHeight()
    showBody()

    if (!homeIntroPlayed) {
      playHomeIntro()
      homeIntroPlayed = true
    } else {
      if (introOverlay) introOverlay.style.display = 'none'
      gsap.set('.line span', { y: 0, skewY: 0 })
      gsap.set('.case-image img', { scale: 1 })
    }
  } else {
    if (introOverlay) introOverlay.style.display = 'none'
    const frag = cloneTemplate('simple-page-template')
    frag.querySelector('.page-title').textContent = route.title
    pageRoot.appendChild(frag)
    showBody()
  }

  closeMenuInstant()
}

function navigate(path) {
  history.pushState({}, '', path)
  renderRoute(path)
}

function playHomeIntro() {
  const tl = gsap.timeline()
  tl.from('.line span', {
    duration: 1.8,
    y: 100,
    ease: 'power4.out',
    delay: 1,
    skewY: 7,
    stagger: { amount: 0.3 }
  })
    .to('.overlay-top', {
      duration: 1.6,
      height: 0,
      ease: 'expo.inOut',
      stagger: 0.4
    })
    .to('.overlay-bottom', {
      duration: 1.6,
      width: 0,
      ease: 'expo.inOut',
      delay: -0.8,
      stagger: { amount: 0.4 }
    })
    .to('.intro-overlay', {
      duration: 0,
      display: 'none'
    })
    .from('.case-image img', {
      duration: 1.6,
      scale: 1.4,
      ease: 'expo.inOut',
      delay: -2,
      stagger: { amount: 0.4 }
    })
}

const menuTl = gsap.timeline({ paused: true })
menuTl
  .to(nav, { duration: 0, display: 'block' })
  .to('body', { duration: 0, overflow: 'hidden' })
  .to(app, {
    duration: 1,
    y: () => dimensions.width <= 654 ? '70vh' : window.innerHeight / 2,
    ease: 'expo.inOut'
  })
  .to('.hamburger-menu span', {
    duration: 0.6,
    delay: -1,
    scaleX: 0,
    transformOrigin: '50% 0%',
    ease: 'expo.inOut'
  })
  .to(path1, {
    duration: 0.4,
    delay: -0.6,
    strokeDashoffset: 10,
    strokeDasharray: 5
  })
  .to(path2, {
    duration: 0.4,
    delay: -0.6,
    strokeDashoffset: 10,
    strokeDasharray: 20
  })
  .to(line1, {
    duration: 0.4,
    delay: -0.6,
    strokeDashoffset: 40,
    strokeDasharray: 18
  })
  .to(circle, {
    duration: 0.6,
    delay: -0.8,
    strokeDashoffset: 0,
    ease: 'expo.inOut'
  })
  .to('.hamburger-menu-close', {
    duration: 0.6,
    delay: -0.8,
    display: 'block'
  })

function initMenuIcon() {
  gsap.set(circle, {
    strokeDasharray: 227,
    strokeDashoffset: -193
  })
  gsap.set(path1, {
    strokeDasharray: 10,
    strokeDashoffset: 10
  })
  gsap.set(path2, {
    strokeDasharray: 10,
    strokeDashoffset: 10
  })
  gsap.set(line1, {
    strokeDasharray: 40,
    strokeDashoffset: 40
  })
}

function openMenu() {
  if (menuOpened) return
  menuOpened = true
  menuTl.play(0)
}

function closeMenu() {
  if (!menuOpened) return
  menuOpened = false
  menuTl.reverse()
  menuTl.eventCallback('onReverseComplete', () => {
    gsap.set('.hamburger-menu-close', { display: 'none' })
    gsap.set('body', { overflow: 'auto' })
    gsap.set(nav, { display: 'none' })
  })
}

function closeMenuInstant() {
  menuOpened = false
  menuTl.pause(0)
  gsap.set(app, { y: 0 })
  gsap.set('.hamburger-menu span', { scaleX: 1, transformOrigin: '50% 0%' })
  gsap.set('.hamburger-menu-close', { display: 'none' })
  gsap.set('body', { overflow: 'auto' })
  gsap.set(nav, { display: 'none' })
  initMenuIcon()
}

document.addEventListener('click', (event) => {
  const routeLink = event.target.closest('[data-route]')
  if (routeLink) {
    event.preventDefault()
    navigate(routeLink.getAttribute('data-route'))
    return
  }

  if (event.target.closest('.hamburger-menu')) {
    openMenu()
    return
  }

  if (event.target.closest('.hamburger-menu-close')) {
    closeMenu()
    return
  }

  if (event.target.matches('[data-inline="true"]')) {
    event.preventDefault()
  }
})

window.addEventListener('popstate', () => {
  renderRoute(window.location.pathname)
})

window.addEventListener('resize', debounce(() => {
  dimensions = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  setViewportHeight()
}, 1000))

dimensions = {
  width: window.innerWidth,
  height: window.innerHeight
}
setViewportHeight()
showBody()
initMenuIcon()
renderRoute(window.location.pathname)
