
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

gsap.to('.card-3d', {
  scrollTrigger: {
    trigger: '.sec-parallax',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  },
  rotationX: -20,
  rotationY: 20,
  y: -100,
  scale: 1.1,
  ease: "none"
});

gsap.from('.sec-outro h2', {
  scrollTrigger: {
    trigger: '.sec-outro',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  },
  opacity: 0,
  scale: 0.8,
  duration: 0.8,
  ease: "back.out(1.7)"
});
