/* =====================================================
   DIMAAC — HORIZON PEEL INTRO
   script.js

   Completely new animation (no SplitText, no letter
   burst, no iris clip — everything that was buggy is
   removed). This version uses simple, solid motions:

   1. Title "DI · MAAC" fades in centre.
   2. Letter-spacing tightens (0.3em → 0.05em) — word
      snaps together with a confident beat.
   3. Horizontal shutter splits: 6 cream bars that
      together cover the viewport peel away — top 3
      slide UP, bottom 3 slide DOWN, with a stagger
      from the centre outward. The title rides the
      centre seam and fades during the split.
   4. The video (already loaded behind) stays there;
      the peel reveals it.  Video scale settles 1.15 → 1.
   5. Shell (header + hero) fades in on top.
   6. Hero title + sub split into words (own splitter),
      each word rises inside an overflow:hidden mask.

   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

   /* ── DOM ── */
   const loader    = document.getElementById('js-loader')
   const halfTop   = document.getElementById('js-half-top')
   const halfBot   = document.getElementById('js-half-bottom')
   const title     = document.getElementById('js-title')
   const video     = document.querySelector('.frame video')
   const shell     = document.getElementById('js-shell')
   const heroSplits= document.querySelectorAll('[data-hero]')

   /* ──────────────────────────────────────────────
      WORD SPLITTER for hero text — wraps every word in
        <span class="hero-word">…</span>
      separated by <span class="hero-space">.  We wrap
      the parent in overflow:hidden (already set in CSS)
      so the yPercent 100 → 0 lift works as a mask.
      ────────────────────────────────────────────── */
   function splitWords(el) {
      const raw = el.textContent.trim()
      el.textContent = ''
      const words = raw.split(/\s+/)
      const nodes = []
      words.forEach((w, i) => {
         const span = document.createElement('span')
         span.className = 'hero-word'
         span.textContent = w
         el.appendChild(span)
         nodes.push(span)
         if (i < words.length - 1) {
            const sp = document.createElement('span')
            sp.className = 'hero-space'
            el.appendChild(sp)
         }
      })
      return nodes
   }

   const heroWords = [...heroSplits].flatMap(splitWords)

   /* ──────────────────────────────────────────────
      INITIAL STATES — GSAP owns anything it animates.
      ────────────────────────────────────────────── */
   gsap.set(title,     { opacity: 0, letterSpacing: '0.3em' })
   gsap.set(video,     { scale: 1.15 })
   gsap.set(shell,     { opacity: 0 })
   gsap.set(heroWords, { yPercent: 100 })
   /* Bars stay at their natural grid position — GSAP
      will animate their yPercent away. */

   /* ──────────────────────────────────────────────
      MAIN TIMELINE
      ────────────────────────────────────────────── */
   const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

   /* 1. Title fade in */
   tl.to(title, {
      opacity: 1,
      duration: 0.6,
      delay: 0.3,
   })

   /* 2. Letter-spacing snap */
   tl.to(title, {
      letterSpacing: '0.05em',
      duration: 0.7,
      ease: 'power3.inOut',
   }, '+=0.3')

   /* 3. PEEL — top half slides up, bottom half slides down.
         Each moves by its own full height (yPercent -100 /
         +100) so neither leaves a sliver behind. Smooth
         power3.inOut keeps it feeling like one motion. */
   tl.to(halfTop, {
      yPercent: -100,
      duration: 1.3,
      ease: 'power3.inOut',
   }, '+=0.2')

   tl.to(halfBot, {
      yPercent: 100,
      duration: 1.3,
      ease: 'power3.inOut',
   }, '<')

   /* 4. Title fades + scales down as the peel pulls away */
   tl.to(title, {
      opacity: 0,
      scale: 0.96,
      duration: 0.5,
      ease: 'power2.in',
   }, '<0.15')

   /* 5. Video zoom settles 1.15 → 1 during the peel */
   tl.to(video, {
      scale: 1,
      duration: 1.4,
      ease: 'expo.out',
   }, '<')

   /* 6. Hide loader once bars are off-screen */
   tl.set(loader, { display: 'none' }, '+=0.05')

   /* 7. Shell (header + hero) fades in */
   tl.to(shell, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
   }, '<')

   /* 8. Hero words rise inside the parent's overflow:hidden */
   tl.to(heroWords, {
      yPercent: 0,
      duration: 0.7,
      stagger: 0.05,
      ease: 'power3.out',
   }, '<0.1')
})
