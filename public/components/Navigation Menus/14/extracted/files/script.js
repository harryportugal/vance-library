/* =====================================================
   PIXEL BLOCK-REVEAL MENU
   script.js

   Grid of 60×60 blocks covers the screen with random
   stagger (opacity 0 → 1), content is swapped under it,
   then the blocks dissolve with random stagger again —
   revealing the menu. Close mirrors the sequence.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

   const BLOCK_SIZE = 60

   const toggle = document.getElementById('js-toggle')
   const menu   = document.getElementById('js-menu')
   const grid   = document.getElementById('js-grid')

   let blocks = []
   let isOpen = false
   let isAnimating = false

   function createGrid() {
      grid.innerHTML = ''
      blocks = []

      const w = window.innerWidth
      const h = window.innerHeight
      const cols = Math.ceil(w / BLOCK_SIZE)
      const rows = Math.ceil(h / BLOCK_SIZE) + 1

      for (let r = 0; r < rows; r++) {
         for (let c = 0; c < cols; c++) {
            const block = document.createElement('div')
            block.className = 'pixel-block'
            block.style.cssText =
               `width:${BLOCK_SIZE}px;height:${BLOCK_SIZE}px;` +
               `left:${c * BLOCK_SIZE}px;top:${r * BLOCK_SIZE}px;`
            grid.appendChild(block)
            blocks.push(block)
         }
      }

      gsap.set(blocks, { opacity: 0 })
   }

   createGrid()
   window.addEventListener('resize', createGrid)

   function cover(cb) {
      gsap.to(blocks, {
         opacity: 1,
         duration: 0.05,
         ease: 'power2.inOut',
         stagger: { amount: 0.6, from: 'random' },
         onComplete: cb,
      })
   }

   function uncover(cb) {
      gsap.to(blocks, {
         opacity: 0,
         duration: 0.05,
         ease: 'power2.inOut',
         stagger: { amount: 0.6, from: 'random' },
         onComplete: cb,
      })
   }

   function openMenu() {
      if (isAnimating) return
      isAnimating = true
      cover(() => {
         menu.classList.add('is-open')
         menu.setAttribute('aria-hidden', 'false')
         toggle.textContent = 'Close'
         setTimeout(() => {
            uncover(() => { isOpen = true; isAnimating = false })
         }, 120)
      })
   }

   function closeMenu() {
      if (isAnimating) return
      isAnimating = true
      cover(() => {
         menu.classList.remove('is-open')
         menu.setAttribute('aria-hidden', 'true')
         toggle.textContent = 'Menu'
         setTimeout(() => {
            uncover(() => { isOpen = false; isAnimating = false })
         }, 120)
      })
   }

   toggle.addEventListener('click', () => {
      if (isOpen) closeMenu()
      else        openMenu()
   })

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu()
   })
})
