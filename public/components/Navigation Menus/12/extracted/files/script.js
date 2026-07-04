/* =====================================================
   CROSSHATCH — CROSSING MARQUEE MENU
   script.js

   Each marquee lane is a GSAP timeline that animates the
   track's xPercent (or yPercent) from 0 to -50% on
   infinite repeat. Because each track contains TWO
   identical copies of its content placed side-by-side,
   translating by -50% lands the track exactly at the
   start of the second copy — the next frame restarts at
   0, which visually is the same position. Result: zero
   jumps, perfectly seamless loop regardless of the
   content's width.

   Hover does NOT pause the animation (that caused the
   decorative elements to "pop" in/out). Instead we tween
   timeScale from 1 to 0.08 with a smooth ease — the
   ticker slows to a near-stop without any visible jerk.

   Open choreography:
   1. .menu fades in (background).
   2. Each lane slides in from its OWN edge.
   3. Centre logo scales in.
   4. Toggle label "Open" → "Close".
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

   /* ── DOM ── */
   const toggle      = document.getElementById('js-toggle')
   const menu        = document.getElementById('js-menu')
   const core        = document.getElementById('js-core')
   const coreMark    = document.getElementById('js-core-mark')
   const brandMark   = document.getElementById('js-brand-mark')
   const labels      = toggle.querySelectorAll('[data-label]')

   const lanes = {
      row1: document.querySelector('.lane--row-1'),
      row2: document.querySelector('.lane--row-2'),
      col1: document.querySelector('.lane--col-1'),
      col2: document.querySelector('.lane--col-2'),
   }

   const tracks = {
      row1: document.getElementById('js-track-1'),
      row2: document.getElementById('js-track-2'),
      col1: document.getElementById('js-track-3'),
      col2: document.getElementById('js-track-4'),
   }

   /* ──────────────────────────────────────────────
      SEAMLESS MARQUEES
      Each is its own infinite tween. We run them from
      the start so, even before the menu opens, they
      already have a position (ensuring no first-frame
      jump when the menu is revealed).

      Direction explanation:
      • row1 moves RIGHT → LEFT → xPercent 0 → -50
      • row2 moves LEFT → RIGHT → xPercent -50 → 0
      • col1 moves DOWN → UP → yPercent 0 → -50
      • col2 moves UP → DOWN → yPercent -50 → 0
      ────────────────────────────────────────────── */
   const marquees = []

   function makeMarquee(track, prop, from, to, duration) {
      /* Set starting position so the track is already positioned
         before the tween kicks in (avoids any first-frame pop). */
      gsap.set(track, { [prop]: from })
      const tw = gsap.to(track, {
         [prop]: to,
         duration,
         ease: 'none',
         repeat: -1,
      })
      marquees.push({ track, tween: tw })
      return tw
   }

   makeMarquee(tracks.row1, 'xPercent',   0, -50, 30)
   makeMarquee(tracks.row2, 'xPercent', -50,   0, 36)
   makeMarquee(tracks.col1, 'yPercent',   0, -50, 28)
   makeMarquee(tracks.col2, 'yPercent', -50,   0, 32)

   /* ──────────────────────────────────────────────
      SMOOTH HOVER SLOWDOWN
      Instead of pausing (which causes visible mid-frame
      stop), we tween timeScale toward near-zero so the
      marquee glides to a rest. Re-entering speeds back
      up the same way. This also keeps ALL decorative
      children (stars, offsets) frame-locked to the
      parent transform — no independent sub-animations
      to jump around.
      ────────────────────────────────────────────── */
   Object.entries(lanes).forEach(([key, lane]) => {
      const tween = marquees[Object.keys(lanes).indexOf(key)].tween

      lane.addEventListener('mouseenter', () => {
         gsap.to(tween, {
            timeScale: 0.08,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
         })
      })

      lane.addEventListener('mouseleave', () => {
         gsap.to(tween, {
            timeScale: 1,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
         })
      })
   })

   /* ──────────────────────────────────────────────
      BRAND + CORE LOGO SPIN
      Both asterisk marks rotate constantly. Using GSAP
      (not CSS @keyframes) lets us share one timeline
      approach across the board.
      ────────────────────────────────────────────── */
   gsap.to(brandMark, {
      rotate: 360, duration: 8, ease: 'none', repeat: -1,
      transformOrigin: '50% 50%',
   })
   gsap.to(coreMark, {
      rotate: -360, duration: 12, ease: 'none', repeat: -1,
      transformOrigin: '50% 50%',
   })

   /* ──────────────────────────────────────────────
      OPEN / CLOSE TIMELINE
      ────────────────────────────────────────────── */
   gsap.set(lanes.row1, { xPercent:  100, opacity: 0 })   // slides in from right
   gsap.set(lanes.row2, { xPercent: -100, opacity: 0 })   // from left
   gsap.set(lanes.col1, { yPercent:  100, opacity: 0 })   // from bottom
   gsap.set(lanes.col2, { yPercent: -100, opacity: 0 })   // from top
   gsap.set(core,       { scale: 0, opacity: 0 })
   gsap.set(labels[1],  { yPercent: 100, opacity: 0 })

   const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power4.out' },
   })

   tl
      .to(menu, { opacity: 1, duration: 0.25, ease: 'power2.out' }, 0)

      .to(lanes.row1, { xPercent: 0, opacity: 1, duration: 0.9 }, 0.1)
      .to(lanes.row2, { xPercent: 0, opacity: 1, duration: 0.9 }, 0.2)
      .to(lanes.col1, { yPercent: 0, opacity: 1, duration: 0.9 }, 0.3)
      .to(lanes.col2, { yPercent: 0, opacity: 1, duration: 0.9 }, 0.4)

      .to(core, {
         scale: 1, opacity: 1,
         duration: 0.6, ease: 'back.out(2)',
      }, 0.55)

      .to(labels[0], {
         yPercent: -100, opacity: 0,
         duration: 0.35, ease: 'power2.out',
      }, 0)
      .to(labels[1], {
         yPercent: 0, opacity: 1,
         duration: 0.35, ease: 'power2.out',
      }, 0.15)

   /* ──────────────────────────────────────────────
      TOGGLE
      ────────────────────────────────────────────── */
   toggle.addEventListener('click', () => {
      const isOpen = !tl.reversed() && tl.progress() > 0

      if (isOpen) {
         menu.classList.remove('is-open')
         menu.setAttribute('aria-hidden', 'true')
         document.body.classList.remove('is-open')
         toggle.setAttribute('aria-label', 'Open menu')
         tl.timeScale(1.4).reverse()
      } else {
         menu.classList.add('is-open')
         menu.setAttribute('aria-hidden', 'false')
         document.body.classList.add('is-open')
         toggle.setAttribute('aria-label', 'Close menu')
         tl.timeScale(1).play()
      }
   })

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !tl.reversed() && tl.progress() > 0) {
         toggle.click()
      }
   })
})
