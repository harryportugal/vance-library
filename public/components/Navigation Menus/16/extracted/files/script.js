document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menu = document.querySelector('.menu');
  const toggle = document.querySelector('.menu-toggle');
  const toggleText = document.querySelector('.menu-toggle-text');
  const backdrop = document.querySelector('.menu-backdrop');
  const frame = document.querySelector('.menu-frame');
  const strips = document.querySelectorAll('.menu-strip');
  const navLinks = document.querySelectorAll('.menu-link span');
  const meta = document.querySelector('.menu-meta p');
  const footer = document.querySelector('.menu-footer p');
  const hero = document.querySelector('.hero-shell');
  const openLabel = toggleText.dataset.open || 'MENU';
  const closeLabel = toggleText.dataset.close || 'CLOSE';

  let busy = false;

  gsap.set(menu, { autoAlpha: 1, pointerEvents: 'none' });
  gsap.set(backdrop, { autoAlpha: 0 });
  gsap.set(frame, { autoAlpha: 0, scale: 0.96 });
  gsap.set(hero, { scale: 1, filter: 'blur(0px)' });
  gsap.set(strips, {
    scaleY: 0,
    transformOrigin: (i) => (i % 2 === 0 ? 'top center' : 'bottom center')
  });
  gsap.set(navLinks, { yPercent: 115, rotation: 4, autoAlpha: 0 });
  gsap.set([meta, footer], { y: 18, autoAlpha: 0 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power4.inOut' },
    onStart: () => {
      busy = true;
      body.classList.add('menu-open');
      menu.style.pointerEvents = 'auto';
      menu.setAttribute('aria-hidden', 'false');
      toggle.classList.add('is-open');
      toggleText.textContent = closeLabel;
    },
    onComplete: () => {
      busy = false;
    },
    onReverseComplete: () => {
      busy = false;
      body.classList.remove('menu-open');
      menu.style.pointerEvents = 'none';
      menu.setAttribute('aria-hidden', 'true');
      toggle.classList.remove('is-open');
      toggleText.textContent = openLabel;
    }
  });

  tl.to(backdrop, {
      duration: 0.22,
      autoAlpha: 1,
      ease: 'linear'
    }, 0)
    .to(hero, {
      duration: 0.8,
      scale: 0.94,
      filter: 'blur(8px)',
      ease: 'power3.inOut'
    }, 0)
    .to(strips, {
      duration: 0.7,
      scaleY: 1,
      stagger: 0.06
    }, 0)
    .to(frame, {
      duration: 0.48,
      autoAlpha: 1,
      scale: 1,
      ease: 'power2.out'
    }, 0.28)
    .to([meta, footer], {
      duration: 0.4,
      y: 0,
      autoAlpha: 1,
      stagger: 0.04,
      ease: 'power2.out'
    }, 0.42)
    .to(navLinks, {
      duration: 0.75,
      yPercent: 0,
      rotation: 0,
      autoAlpha: 1,
      stagger: 0.07,
      ease: 'power4.out'
    }, 0.36);

  toggle.addEventListener('click', () => {
    if (busy) return;
    if (tl.progress() === 0 || tl.reversed()) {
      tl.play();
    } else {
      tl.reverse();
    }
  });
});
