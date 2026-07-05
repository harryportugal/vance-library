gsap.registerPlugin(GSDevTools, MorphSVGPlugin);

let tl = gsap
  .timeline({
    defaults: { duration: 2, ease: "expo.inOut" },
    repeat: -1
  })
  .to("#morph", { morphSVG: "#speech" })
  .to("#morph", { morphSVG: "#rocket" })
  .to("#morph", { morphSVG: "#lightning" })
  .to("#morph", { morphSVG: "#thumb" })
  .to("#morph", { morphSVG: "#square" })
  .to("#morph", { morphSVG: "#grid" })
  .to("#morph", { morphSVG: "#bulb" })
  .to("#morph", { morphSVG: "#morph" })

GSDevTools.create({animation: tl, minimal: true});