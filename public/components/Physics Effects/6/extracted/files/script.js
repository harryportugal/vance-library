/* =====================================================
   GRAVITY — cursor-driven particle gravity well
   script.js

   ~250 particles drift on a Canvas.  The cursor is a
   GRAVITY WELL: it pulls particles toward itself with
   strength inversely proportional to distance squared
   (real gravity formula — looks much more natural than
   linear attraction).

   Each particle keeps its own previous frame so we can
   draw a TRAIL via line from prevX/Y to x/y.  Combined
   with a transparent "fade overlay" on the canvas every
   frame, this gives motion-blur-style trails that
   accumulate nicely.

   Click anywhere → SHOCKWAVE: every particle gets a
   strong outward impulse from the click point + the
   click point itself ripples as a circle that expands
   and fades.

   Custom cursor: a thin circle ring drawn into the
   canvas (CSS cursor is hidden globally).

   No external libs — just Canvas API + math.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

   const canvas = document.getElementById('js-canvas')
   const ctx    = canvas.getContext('2d')
   const hint   = document.getElementById('js-hint')

   /* ──────────────────────────────────────────────
      SIZE — DPR aware; resets on resize
      ────────────────────────────────────────────── */
   let W = 0, H = 0, DPR = 1
   function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W * DPR
      canvas.height = H * DPR
      canvas.style.width  = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
   }
   resize()
   window.addEventListener('resize', resize)

   /* ──────────────────────────────────────────────
      MOUSE — raw + smoothed
      ────────────────────────────────────────────── */
   const mouse = {
      x: W / 2, y: H / 2,        /* current */
      sx: W / 2, sy: H / 2,      /* smoothed (for cursor draw) */
      active: false,
   }

   window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
   })
   window.addEventListener('mouseleave', () => { mouse.active = false })

   /* ──────────────────────────────────────────────
      PARTICLES
      ────────────────────────────────────────────── */
   const COUNT = 260
   const PALETTE = [
      '#ff5e3a',     /* orange */
      '#ffba2c',     /* amber */
      '#48b0ff',     /* blue */
      '#7df0c2',     /* mint */
      '#f5f1e8',     /* cream */
   ]

   const particles = []
   for (let i = 0; i < COUNT; i++) {
      particles.push({
         x:  Math.random() * W,
         y:  Math.random() * H,
         vx: (Math.random() - 0.5) * 1.5,
         vy: (Math.random() - 0.5) * 1.5,
         r:  Math.random() * 2 + 1,
         color: PALETTE[(Math.random() * PALETTE.length) | 0],
      })
   }

   /* ──────────────────────────────────────────────
      SHOCKWAVES — array of expanding rings created by
      clicks. Each: { x, y, age, max }
      ────────────────────────────────────────────── */
   const shocks = []

   window.addEventListener('mousedown', (e) => {
      hint.classList.add('is-hidden')

      const cx = e.clientX
      const cy = e.clientY

      /* Push shockwave ring */
      shocks.push({ x: cx, y: cy, age: 0, max: 120 })

      /* Apply outward impulse to every particle */
      for (const p of particles) {
         const dx = p.x - cx
         const dy = p.y - cy
         const d  = Math.hypot(dx, dy) || 1
         /* Stronger close to the click, falls off with distance */
         const power = Math.max(0, 30 - d * 0.04)
         p.vx += (dx / d) * power
         p.vy += (dy / d) * power
      }
   })

   /* Touch — equivalent press */
   window.addEventListener('touchstart', (e) => {
      const t = e.touches[0]
      mouse.x = t.clientX
      mouse.y = t.clientY
      mouse.active = true
      hint.classList.add('is-hidden')
      shocks.push({ x: t.clientX, y: t.clientY, age: 0, max: 120 })
      for (const p of particles) {
         const dx = p.x - t.clientX
         const dy = p.y - t.clientY
         const d  = Math.hypot(dx, dy) || 1
         const power = Math.max(0, 30 - d * 0.04)
         p.vx += (dx / d) * power
         p.vy += (dy / d) * power
      }
   })

   window.addEventListener('touchmove', (e) => {
      const t = e.touches[0]
      mouse.x = t.clientX
      mouse.y = t.clientY
      mouse.active = true
   })

   /* ──────────────────────────────────────────────
      RENDER LOOP
      ────────────────────────────────────────────── */
   const G = 1500    /* gravity constant — bigger = stronger pull */
   const MAX_FORCE = 1.2
   const FRICTION = 0.985

   function frame() {

      /* Trail fade — draw a translucent black rect over
         everything so old strokes fade out. Lower alpha
         = longer trails. 0.18 looks like ~6 frames of
         persistence. */
      ctx.fillStyle = 'rgba(10, 10, 10, 0.18)'
      ctx.fillRect(0, 0, W, H)

      /* ── SHOCKWAVE rings (drawn first, behind particles) ── */
      ctx.save()
      ctx.lineWidth = 2
      for (let i = shocks.length - 1; i >= 0; i--) {
         const s = shocks[i]
         s.age++
         const t = s.age / s.max
         if (t >= 1) { shocks.splice(i, 1); continue }
         const radius = t * 600
         const alpha  = 1 - t
         ctx.strokeStyle = `rgba(255, 94, 58, ${alpha})`
         ctx.beginPath()
         ctx.arc(s.x, s.y, radius, 0, Math.PI * 2)
         ctx.stroke()
      }
      ctx.restore()

      /* ── PARTICLES ── */
      for (const p of particles) {
         /* Cursor gravity */
         if (mouse.active) {
            const dx = mouse.x - p.x
            const dy = mouse.y - p.y
            const d2 = dx * dx + dy * dy
            const d  = Math.sqrt(d2) || 1
            /* Inverse-square pull, capped so we don't blow up
               near the cursor singularity */
            let f = G / Math.max(d2, 400)
            if (f > MAX_FORCE) f = MAX_FORCE
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
         }

         /* Friction so they don't accelerate forever */
         p.vx *= FRICTION
         p.vy *= FRICTION

         /* Save previous position for trail line */
         const px = p.x, py = p.y

         p.x += p.vx
         p.y += p.vy

         /* Wrap around the screen edges (continuous space)
            so particles never stack at the borders. */
         if (p.x < 0)   p.x += W
         if (p.x > W)   p.x -= W
         if (p.y < 0)   p.y += H
         if (p.y > H)   p.y -= H

         /* Velocity-based hue: faster = bigger trail head */
         const speed = Math.hypot(p.vx, p.vy)
         const headR = Math.min(8, p.r + speed * 0.4)

         /* Trail line — only if movement was within the
            screen (skip wrap teleports) */
         const dx = p.x - px
         const dy = p.y - py
         if (Math.abs(dx) < W / 2 && Math.abs(dy) < H / 2) {
            ctx.strokeStyle = p.color
            ctx.lineWidth = headR * 0.35
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(px, py)
            ctx.lineTo(p.x, p.y)
            ctx.stroke()
         }

         /* Glowing head */
         ctx.fillStyle = p.color
         ctx.beginPath()
         ctx.arc(p.x, p.y, headR, 0, Math.PI * 2)
         ctx.fill()
      }

      /* ── CUSTOM CURSOR ──
         Smoothed mouse so the ring lags slightly behind
         the actual pointer — feels weighty. */
      mouse.sx += (mouse.x - mouse.sx) * 0.18
      mouse.sy += (mouse.y - mouse.sy) * 0.18

      if (mouse.active) {
         ctx.strokeStyle = 'rgba(245, 241, 232, 0.6)'
         ctx.lineWidth = 1.2
         ctx.beginPath()
         ctx.arc(mouse.sx, mouse.sy, 22, 0, Math.PI * 2)
         ctx.stroke()
         /* Inner dot */
         ctx.fillStyle = '#f5f1e8'
         ctx.beginPath()
         ctx.arc(mouse.sx, mouse.sy, 2.5, 0, Math.PI * 2)
         ctx.fill()
      }

      requestAnimationFrame(frame)
   }
   frame()
})
