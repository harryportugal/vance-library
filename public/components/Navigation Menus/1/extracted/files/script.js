/* =====================================================
   ELMANTO MENU — script.js
   Two-sided "unrolling" background reveal + staggered
   line-by-line text animation using SplitText.
   ===================================================== */

/* Register the GSAP plugins so we can use them below.
   SplitText  — splits text into line spans.
   CustomEase — lets us define our own cubic-bezier curve. */
gsap.registerPlugin(SplitText, CustomEase)

/* Create a reusable custom easing called "jump".
   The four numbers are a cubic-bezier control curve —
   sharp start, long hold, sharp finish — perfect for the
   dramatic unroll of the background panels. */
CustomEase.create('jump', '0.85, 0, 0.15, 1')

/* ── DOM references ─────────────────────────────────── */
const menu         = document.querySelector('.menu')
const toggleButton = document.querySelector('.nav__btn-toggle')

// Tracks open/closed state
let isMenuOpen = false

/* ── Split text into line spans ─────────────────────────
   SplitText walks every <a>/<p> inside .menu and wraps
   each rendered line in a <span class="line">.
   `mask: 'lines'` adds an overflow-hidden wrapper around
   each line so the translated text can be clipped — this
   is what creates the clean "slide-up from under a mask"
   effect you see in the CSS (.line starts at translateY(110%)). */
SplitText.create('.menu a, .menu p', {
	type: 'lines',
	mask: 'lines',
	linesClass: 'line',
})

/* ───────────────────────────────────────────────────────
   🔥 MAIN TIMELINE — built once, kept paused.
   Click toggles between tl.play() (open) and tl.reverse() (close).
   ─────────────────────────────────────────────────────── */
const tl = gsap.timeline({ paused: true })

tl
	/* 1. Unroll the two white background boxes.
	      They start at rotate(180deg) / rotate(-180deg) in CSS
	      and animate to `rotate: 0` — so each half rotates inward
	      from the screen edge toward the center, like closing shutters
	      (opening them in this case, since we play it forward to open). */
	.to(
		'.menu__bg-box--left, .menu__bg-box--right',
		{ rotate: 0, duration: 1, ease: 'jump' },
		0,  // position 0 = start at the beginning of the timeline
	)

	/* 2. Slide the text lines up from below.
	      Each `.line` starts at y: 110% (hidden below its mask)
	      and animates to y: 0. stagger: 0.1 delays each line by
	      100ms → a cascading reveal. Starts at 0.6s so the
	      background is mostly in place before text appears. */
	.to(
		'.menu__column .line',
		{ y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' },
		0.6,
	)

/* ── Toggle behavior ──────────────────────────────────── */
toggleButton.addEventListener('click', () => {
	isMenuOpen ? closeMenu() : openMenu()
})

function openMenu() {
	tl.play()
	// Adding `.active` flips pointer-events on so links become clickable
	menu.classList.add('active')
	isMenuOpen = true
}

function closeMenu() {
	tl.reverse()
	// Remove `.active` right away so accidental clicks can't land
	// on menu links while it's closing
	menu.classList.remove('active')
	isMenuOpen = false
}
