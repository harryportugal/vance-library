/* =====================================================
   HEAVY — light minimal physics typography
   script.js

   Matter.js engine drives invisible bodies.
   Each body has a matching DOM .word that we re-position
   every frame via transform: translate + rotate.
   Drag any word with the mouse; click "Drop again" to
   lift them all back into the sky.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

   const {
      Engine, Runner, World, Bodies, Body,
      Mouse, MouseConstraint, Common, Events,
   } = Matter

   const stage = document.getElementById('js-stage')
   const reset = document.getElementById('js-reset')

   /* Words to drop */
   const WORDS = [
      'studio',
      'craft',
      'motion',
      'form',
      'detail',
      'heavy',
      'made',
      'now',
   ]

   /* ──────────────────────────────────────────────
      ENGINE
      ────────────────────────────────────────────── */
   const engine = Engine.create()
   const world  = engine.world
   world.gravity.y = 1.2

   Runner.run(Runner.create(), engine)

   /* ──────────────────────────────────────────────
      WALLS — floor + left + right (all invisible)
      Floor at the bottom edge — no on-screen indicator,
      bodies just stack against it.
      ────────────────────────────────────────────── */
   let walls = []

   function buildWalls() {
      walls.forEach(w => World.remove(world, w))
      walls = []

      const w = window.innerWidth
      const h = window.innerHeight
      const t = 200      /* thickness — thick walls prevent tunnelling */

      walls = [
         /* floor flush with viewport bottom */
         Bodies.rectangle(w / 2, h + t / 2, w * 2, t, { isStatic: true }),
         /* left & right just off-screen */
         Bodies.rectangle(-t / 2, h / 2, t, h * 2, { isStatic: true }),
         Bodies.rectangle(w + t / 2, h / 2, t, h * 2, { isStatic: true }),
      ]
      World.add(world, walls)
   }
   buildWalls()

   /* ──────────────────────────────────────────────
      WORDS — DOM + matching physics body
      ────────────────────────────────────────────── */
   const items = []   /* { el, body, w, h } */

   function spawn(text, i) {
      const el = document.createElement('span')
      el.className = 'word'
      el.textContent = text
      stage.appendChild(el)

      /* Measure rendered size to size the body */
      const r = el.getBoundingClientRect()

      /* Random horizontal start, spawn well above viewport.
         Each word starts higher than the previous → wave fall. */
      const startX = Common.random(r.width / 2 + 20, window.innerWidth - r.width / 2 - 20)
      const startY = -200 - i * 140

      const body = Bodies.rectangle(startX, startY, r.width, r.height, {
         restitution: 0.3,
         friction:    0.4,
         frictionAir: 0.005,
         density:     0.0014,
         angle:       Common.random(-0.4, 0.4),
      })
      World.add(world, body)

      items.push({ el, body, w: r.width, h: r.height })
   }

   /* Spawn one at a time so words enter as a slow wave */
   WORDS.forEach((w, i) => {
      setTimeout(() => spawn(w, i), i * 200)
   })

   /* ──────────────────────────────────────────────
      MOUSE CONSTRAINT — drag any word
      ────────────────────────────────────────────── */
   const mouse = Mouse.create(stage)

   /* Free up wheel events so the page can still scroll */
   mouse.element.removeEventListener('wheel', mouse.mousewheel)
   mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

   const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: {
         stiffness: 0.18,
         damping:   0.1,
         render: { visible: false },
      },
   })
   World.add(world, mc)

   Events.on(mc, 'startdrag', (e) => {
      const it = items.find(i => i.body === e.body)
      if (it) it.el.classList.add('is-grabbing')
   })
   Events.on(mc, 'enddrag', (e) => {
      const it = items.find(i => i.body === e.body)
      if (it) it.el.classList.remove('is-grabbing')
   })

   /* ──────────────────────────────────────────────
      DOM SYNC — write transform every frame
      ────────────────────────────────────────────── */
   function sync() {
      for (const it of items) {
         const { x, y } = it.body.position
         const a = it.body.angle
         it.el.style.transform =
            `translate(${x - it.w / 2}px, ${y - it.h / 2}px) rotate(${a}rad)`
      }
      requestAnimationFrame(sync)
   }
   sync()

   /* Resize: rebuild walls; bodies keep their state */
   window.addEventListener('resize', buildWalls)

   /* ──────────────────────────────────────────────
      RESET
      ────────────────────────────────────────────── */
   reset.addEventListener('click', () => {
      items.forEach((it, i) => {
         setTimeout(() => {
            const startX = Common.random(it.w / 2 + 20, window.innerWidth - it.w / 2 - 20)
            const startY = -200 - i * 140

            Body.setPosition(it.body, { x: startX, y: startY })
            Body.setVelocity(it.body, { x: 0, y: 0 })
            Body.setAngularVelocity(it.body, 0)
            Body.setAngle(it.body, Common.random(-0.4, 0.4))
         }, i * 100)
      })
   })
})
