/* =====================================================
   POCKET. — Menu (Robin Noguier style)
   script.js

   FIXES for the laggy hover (vs. previous version):

   1. All 4 thumbnail images are pre-mounted in the DOM.
      We no longer change `img.src` on hover — instead we
      just fade the correct image in and others out. No
      disk/network reload = zero flash or lag.

   2. Position uses gsap.quickTo — GSAP's optimized setter
      that batches writes to the next frame. Much smoother
      than a full gsap.to() fired on every mouseenter.

   3. Thumb has translate3d(0,0,0) + will-change so the
      browser promotes it to its own GPU compositor layer.

   4. Heavy box-shadow removed (it was repainted on every
      transform frame — that alone was expensive).
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

   /* ── DOM refs ── */
   const toggle    = document.getElementById('js-toggle')
   const closeBtn  = document.getElementById('js-close')
   const menu      = document.getElementById('js-menu')
   const menuTop   = document.querySelector('.menu__top')
   const menuFoot  = document.querySelector('.menu__foot')
   const rows      = document.querySelectorAll('.row')
   const lines     = document.querySelectorAll('.row__line')
   const titles    = document.querySelectorAll('.row__title')
   const thumb     = document.getElementById('js-thumb')
   const thumbImgs = thumb.querySelectorAll('.thumb__img')
   const counter   = document.getElementById('js-counter')

   /* Initial hidden states */
   gsap.set([menuTop, menuFoot], { opacity: 0, y: 20 })

   /* ──────────────────────────────────────────────
      MAIN OPEN/CLOSE TIMELINE
      ────────────────────────────────────────────── */
   const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power4.inOut' },
   })

   tl
      .fromTo(menu,
         { clipPath: 'inset(0 0 100% 0)' },
         { clipPath: 'inset(0 0 0% 0)', duration: 1.0 },
         0,
      )
      .to([menuTop, menuFoot], {
         opacity: 1,
         y: 0,
         duration: 0.5,
         ease: 'power2.out',
      }, 0.5)
      .to(lines, {
         scaleX: 1,
         duration: 0.7,
         stagger: 0.05,
         ease: 'power3.out',
      }, 0.45)
      .to(titles, {
         opacity: 1,
         y: 0,
         duration: 0.6,
         stagger: 0.06,
         ease: 'power3.out',
      }, 0.55)

   /* ──────────────────────────────────────────────
      OPEN / CLOSE handlers
      ────────────────────────────────────────────── */
   function openMenu() {
      menu.classList.add('is-open')
      menu.setAttribute('aria-hidden', 'false')
      tl.play()
   }

   function closeMenu() {
      menu.classList.remove('is-open')
      menu.setAttribute('aria-hidden', 'true')
      hideThumb()
      tl.reverse()
   }

   toggle.addEventListener('click', () => {
      const isOpen = !tl.reversed() && tl.progress() > 0
      isOpen ? closeMenu() : openMenu()
   })

   closeBtn.addEventListener('click', closeMenu)

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !tl.reversed() && tl.progress() > 0) {
         closeMenu()
      }
   })

   /* ══════════════════════════════════════════════════════
      HOVER THUMBNAIL
      ══════════════════════════════════════════════════════ */

   /* gsap.quickTo = performance-optimized single-prop setter.
      It writes to a single GSAP-managed transform so repeated
      calls on mousemove/hover don't re-create tweens. */
   const xTo = gsap.quickTo(thumb, 'x', { duration: 0.5, ease: 'power3' })
   const yTo = gsap.quickTo(thumb, 'y', { duration: 0.5, ease: 'power3' })

   function positionThumb(row) {
      const thumbX = parseFloat(row.dataset.thumbX)    // 0–1000
      const offset = parseFloat(row.dataset.offset)    // px
      const src    = row.dataset.img

      /* Menu-relative target position */
      const rect = menu.getBoundingClientRect()
      const targetX = (rect.width * thumbX / 1000) - thumb.offsetWidth / 2
      const targetY = (rect.height / 2) + offset / 2.5 - thumb.offsetHeight / 2

      /* Fade the thumb container in + position it with quickTo */
      gsap.to(thumb, {
         opacity: 1,
         duration: 0.3,
         ease: 'power2.out',
         overwrite: 'auto',
      })
      xTo(targetX)
      yTo(targetY)

      /* Fade the right image in; others out.
         This is instant because all images are already loaded. */
      thumbImgs.forEach(img => {
         const isMatch = img.dataset.img === src
         gsap.to(img, {
            opacity: isMatch ? 1 : 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
         })
      })

      /* Update bottom counter */
      const index = Array.from(rows).indexOf(row) + 1
      counter.textContent = `Preview · 0${index} / 04`
   }

   function hideThumb() {
      gsap.to(thumb, {
         opacity: 0,
         duration: 0.25,
         ease: 'power2.out',
         overwrite: 'auto',
      })
      counter.textContent = 'Hover to preview'
   }

   /* Bind hover on each row */
   rows.forEach(row => {
      row.addEventListener('mouseenter', () => positionThumb(row))
      row.addEventListener('mouseleave', hideThumb)
   })
})
