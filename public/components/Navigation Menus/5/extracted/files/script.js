/* =====================================================
   SLIDING STAIRS MENU — script.js

   Sequence on open:
   1. Five black "stair" bars grow from 0 → 100% height
      with a staggered delay (bars enter from the RIGHT,
      i.e. the rightmost bar first).
   2. Solid black backdrop fades in to 0.5 opacity.
   3. Menu content fades in on top: close button slides
      in from the right, links flip down from rotateX(90),
      and the footer fades in.

   On close the whole thing plays in reverse, with the
   stairs leaving in the OPPOSITE order (left bars first).

   On link hover, a yellow overlay with a marquee of images
   slides in from above or below depending on where the
   cursor entered the element (cool detail from the original).
   ===================================================== */

/* ── DOM references ─────────────────────────────────── */
const burger     = document.getElementById('js-burger')
const close      = document.getElementById('js-close')
const stairs     = document.getElementById('js-stairs')
const stairsBars = document.querySelectorAll('.stairs__bar')
const stairsBg   = document.getElementById('js-stairs-bg')
const menu       = document.getElementById('js-menu')
const menuItems  = document.querySelectorAll('.menu__item')
const menuLinks  = document.querySelectorAll('.menu__link')
const footer     = document.querySelector('.menu__footer')

/* Easing used throughout — matches the original cubic-bezier(0.33, 1, 0.68, 1) */
const ease = 'power2.out'

/* ── OPEN MENU ─────────────────────────────────────────
   Built with GSAP Timeline. We rebuild it each click
   (instead of a paused shared timeline) because the open
   and close sequences have different stagger directions
   and durations — easier to read this way. */
function openMenu() {
   const tl = gsap.timeline()

   /* 1. Stair bars grow. Stagger.from: "end" makes the RIGHTMOST
         bar animate first — matches the original `custom={4 - index}` */
   tl.fromTo(stairsBars,
      { height: '0%' },
      {
         height: '100%',
         duration: 0.5,
         stagger: { each: 0.05, from: 'end' },
         ease,
      },
      0,
   )

   /* 2. Backdrop fades in (slightly delayed so the bars lead) */
   tl.to(stairsBg, { opacity: 0.5, duration: 0.5, ease }, 0.2)

   /* 3. Menu container fades in */
   tl.to(menu, { opacity: 1, duration: 0.5, ease }, 0.4)

   /* 4. Close button slides in from x: 150 */
   tl.fromTo(close,
      { x: 150 },
      { x: 0, duration: 0.5, ease },
      0.4,
   )

   /* 5. Each link flips down from rotateX(90), staggered */
   tl.fromTo(menuLinks,
      { rotateX: 90, opacity: 0 },
      {
         rotateX: 0,
         opacity: 1,
         duration: 0.5,
         stagger: 0.05,
         ease,
      },
      0.6,
   )

   /* 6. Footer fades in last */
   tl.fromTo(footer,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease },
      0.9,
   )

   /* Enable pointer events once the menu is fully open */
   tl.call(() => { menu.style.pointerEvents = 'all' })
}

/* ── CLOSE MENU ────────────────────────────────────────
   Reverses the open sequence. Note the stair bars leave
   from the LEFT side first (stagger.from: "start") —
   feels more natural than the open direction. */
function closeMenu() {
   menu.style.pointerEvents = 'none'

   const tl = gsap.timeline()

   /* 1. Fade menu content out */
   tl.to(menu,   { opacity: 0, duration: 0.5, ease }, 0)
   tl.to(footer, { opacity: 0, duration: 0.5, ease }, 0)

   /* 2. Backdrop fades out */
   tl.to(stairsBg, { opacity: 0, duration: 0.5, ease }, 0.1)

   /* 3. Stair bars collapse (leftmost first this time) */
   tl.to(stairsBars,
      {
         height: '0%',
         duration: 0.3,
         stagger: { each: 0.05, from: 'start' },
         ease,
      },
      0.2,
   )
}

/* ── Toggle listeners ──────────────────────────────── */
burger.addEventListener('click', openMenu)
close.addEventListener('click', closeMenu)

/* ── LINK HOVER — sliding overlay from the correct side ─
   When the cursor enters a link, we compare its Y position
   to the item's vertical midpoint:
   - Entered from ABOVE → overlay slides DOWN from the top
   - Entered from BELOW → overlay slides UP from the bottom
   Same logic on leave, so the overlay exits in the
   direction the cursor actually leaves. */
menuItems.forEach(item => {
   const outer = item.querySelector('.menu__outer')
   const inner = item.querySelector('.menu__inner')

   item.addEventListener('mouseenter', (e) => {
      const bounds = item.getBoundingClientRect()
      const enteredFromAbove = e.clientY < bounds.top + bounds.height / 2

      /* Position the layers OUTSIDE the item, on the side we entered from */
      if (enteredFromAbove) {
         gsap.set(outer, { top: '-100%' })
         gsap.set(inner, { top:  '100%' })
      } else {
         gsap.set(outer, { top:  '100%' })
         gsap.set(inner, { top: '-100%' })
      }

      /* Slide both layers into place — they meet in the middle */
      gsap.to(outer, { top: '0%', duration: 0.3, overwrite: true })
      gsap.to(inner, { top: '0%', duration: 0.3, overwrite: true })
   })

   item.addEventListener('mouseleave', (e) => {
      const bounds = item.getBoundingClientRect()
      const leavingFromAbove = e.clientY < bounds.top + bounds.height / 2

      /* Slide OUT in the direction the cursor leaves */
      if (leavingFromAbove) {
         gsap.to(outer, { top: '-100%', duration: 0.3, overwrite: true })
         gsap.to(inner, { top:  '100%', duration: 0.3, overwrite: true })
      } else {
         gsap.to(outer, { top:  '100%', duration: 0.3, overwrite: true })
         gsap.to(inner, { top: '-100%', duration: 0.3, overwrite: true })
      }
   })
})
