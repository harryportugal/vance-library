/* =====================================================
   JELLY& — BOUNCY MENU
   script.js

   Everything uses spring physics (elastic.out / back.out /
   bounce) so the whole UI feels like jelly.

   Open sequence (single paused timeline):
   1. Panel drops from -110% with elastic overshoot.
      Scale squash 0.92 → 1.05 → 1 (squash & stretch Disney rule)
   2. Each nav row drops in from y:-40 with back.out(2)
      overshoot + stagger 0.08s. Each one bounces twice.
   3. Close = reverse the same timeline.

   Extras:
   • Hero words bounce in on load — each with its own delay
   • Toggle button gooey blob morphs on hover
   • CTA button scales on hover + squishes on active
   • Menu-open squeezes body scale slightly for tactile feel
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

   /* ── DOM ── */
   const toggle     = document.getElementById('js-toggle')
   const toggleText = document.getElementById('js-toggle-text')
   const blob       = document.getElementById('js-blob')
   const menu       = document.getElementById('js-menu')
   const panel      = document.getElementById('js-panel')
   const navItems   = document.querySelectorAll('[data-item]')
   const heroWords  = document.querySelectorAll('[data-word]')

   /* ──────────────────────────────────────────────
      HERO ENTRANCE — words bounce in on page load.
      back.out(2.2) gives a strong elastic overshoot.
      ────────────────────────────────────────────── */
   gsap.set(heroWords, { y: 80, opacity: 0, scale: 0.5 })

   gsap.to(heroWords, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.12,
      ease: 'elastic.out(1, 0.55)',
      delay: 0.2,
   })

   /* The accent "jelly." word gets an extra wobble after landing */
   const accentWord = document.querySelector('.hero__word--accent')
   if (accentWord) {
      gsap.to(accentWord, {
         scale: 1.08,
         duration: 0.8,
         ease: 'elastic.out(1, 0.3)',
         delay: 1.2,
         yoyo: true,
         repeat: -1,
         repeatDelay: 2,
      })
   }

   /* ──────────────────────────────────────────────
      MENU TIMELINE — elastic drop + staggered items
      ────────────────────────────────────────────── */

   /* Initial state: panel above + squished, items above + invisible */
   gsap.set(panel, { yPercent: -110, scaleY: 0.92, scaleX: 0.96 })
   gsap.set(navItems, { y: -40, opacity: 0, scale: 0.85 })

   const tl = gsap.timeline({ paused: true })

   tl
      /* Panel drops with elastic overshoot.
         elastic.out(amplitude, period) — higher amplitude = more wobble. */
      .to(panel, {
         yPercent: 0,
         duration: 1.3,
         ease: 'elastic.out(1, 0.55)',
      }, 0)

      /* Squash & stretch: panel squishes back to normal shape
         as it lands. Slight lag behind the y tween for that
         cartoon "absorbing impact" feel. */
      .to(panel, {
         scaleY: 1,
         scaleX: 1,
         duration: 0.9,
         ease: 'elastic.out(1, 0.4)',
      }, 0.15)

      /* Nav items cascade in with back overshoot.
         back.out(2.5) = strong single bounce at the end. */
      .to(navItems, {
         y: 0,
         opacity: 1,
         scale: 1,
         duration: 0.8,
         stagger: 0.08,
         ease: 'back.out(2.5)',
      }, 0.4)

   /* ──────────────────────────────────────────────
      OPEN / CLOSE
      ────────────────────────────────────────────── */
   toggle.addEventListener('click', () => {
      const isOpen = !tl.reversed() && tl.progress() > 0

      if (isOpen) {
         menu.classList.remove('is-open')
         menu.setAttribute('aria-hidden', 'true')
         toggleText.textContent = 'Menu'
         tl.timeScale(1.4).reverse()   // close a bit faster
      } else {
         menu.classList.add('is-open')
         menu.setAttribute('aria-hidden', 'false')
         toggleText.textContent = 'Close'
         tl.timeScale(1).play()

         /* Little "press" feedback on the toggle itself */
         gsap.fromTo(toggle,
            { scale: 0.9 },
            { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' },
         )
      }
   })

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !tl.reversed() && tl.progress() > 0) {
         toggle.click()
      }
   })

   /* ──────────────────────────────────────────────
      BLOB HOVER — just let CSS do the gooey morph.
      Previously we had pointerdown/up handlers adding
      GSAP tweens here, but those fought with the click
      handler and occasionally blocked the menu from
      opening. Keeping this simple and declarative.
      ────────────────────────────────────────────── */

   /* ──────────────────────────────────────────────
      LINK HOVER BOUNCE — each row's emoji rotates + the
      whole row wobbles (CSS @keyframes handles the wobble).
      We re-trigger the CSS animation on every mouseenter
      by toggling the class.
      ────────────────────────────────────────────── */
   const links = document.querySelectorAll('.nav__link')
   links.forEach(link => {
      link.addEventListener('mouseenter', () => {
         /* Force re-run of the wobble keyframes */
         link.style.animation = 'none'
         void link.offsetWidth      // trigger reflow
         link.style.animation = ''
      })
   })
})
