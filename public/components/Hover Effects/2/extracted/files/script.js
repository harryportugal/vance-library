document.addEventListener('DOMContentLoaded', () => {
  const background = document.getElementById('background');
  const disperseEls = gsap.utils.toArray('.js-disperse');

  const transforms = [
    { x: -0.8, y: -0.6, rotationZ: -29 },
    { x: -0.2, y: -0.4, rotationZ: -6 },
    { x: -0.05, y: 0.1, rotationZ: 12 },
    { x: -0.05, y: -0.1, rotationZ: -9 },
    { x: -0.1, y: 0.55, rotationZ: 3 },
    { x: 0, y: -0.1, rotationZ: 9 },
    { x: 0, y: 0.15, rotationZ: -12 },
    { x: 0, y: 0.15, rotationZ: -17 },
    { x: 0, y: -0.65, rotationZ: 9 },
    { x: 0.1, y: 0.4, rotationZ: 12 },
    { x: 0, y: -0.15, rotationZ: -9 },
    { x: 0.2, y: 0.15, rotationZ: 12 },
    { x: 0.8, y: 0.6, rotationZ: 20 }
  ];

  function splitChars(element) {
    const text = element.dataset.text || element.textContent.trim();
    element.innerHTML = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      element.appendChild(span);
    });
  }

  disperseEls.forEach((line) => {
    splitChars(line);
    const chars = line.querySelectorAll('.char');

    line.addEventListener('mouseenter', () => {
      gsap.to(background, {
        opacity: 0.8,
        duration: 0.25,
        overwrite: true
      });

      chars.forEach((char, i) => {
        const t = transforms[i % transforms.length];
        gsap.to(char, {
          x: `${t.x}em`,
          y: `${t.y}em`,
          rotation: t.rotationZ,
          duration: 0.75,
          ease: 'power4.out',
          overwrite: true
        });
      });
    });

    line.addEventListener('mouseleave', () => {
      gsap.to(background, {
        opacity: 0,
        duration: 0.25,
        overwrite: true
      });

      gsap.to(chars, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.75,
        ease: 'power4.out',
        overwrite: true
      });
    });
  });
});
