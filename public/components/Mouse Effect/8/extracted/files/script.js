document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const columnCount = 20;
  let cellSize = 0;
  let rowCount = 0;

  const colorize = (cell) => {
    if (!cell) return;
    gsap.killTweensOf(cell);
    gsap.set(cell, { backgroundColor: '#000000', opacity: 1 });
    gsap.to(cell, {
      opacity: 0,
      duration: 0.3,
      ease: 'none',
      onComplete: () => {
        gsap.set(cell, { backgroundColor: 'transparent', opacity: 1 });
      }
    });
  };

  const buildGrid = () => {
    grid.innerHTML = '';
    cellSize = window.innerWidth * 0.05;
    if (window.innerWidth <= 900) cellSize = window.innerWidth * 0.08;
    rowCount = Math.ceil(window.innerHeight / cellSize);

    for (let col = 0; col < columnCount; col += 1) {
      const column = document.createElement('div');
      column.className = 'column';
      for (let row = 0; row < rowCount; row += 1) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.addEventListener('mouseenter', () => colorize(pixel));
        column.appendChild(pixel);
      }
      grid.appendChild(column);
    }
  };

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildGrid, 100);
  });

  buildGrid();
});
