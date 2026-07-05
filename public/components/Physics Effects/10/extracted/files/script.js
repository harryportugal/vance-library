
const cursor = document.querySelector('.custom-cursor');
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cursorX = mouse.x;
let cursorY = mouse.y;

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function updateCursor() {
  cursorX += (mouse.x - cursorX) * 0.15;
  cursorY += (mouse.y - cursorY) * 0.15;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(updateCursor);
}
updateCursor();

// Magnetic buttons
const buttons = document.querySelectorAll('.mag-btn');
buttons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    
    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power2.out"
    });
    
    cursor.style.width = '40px';
    cursor.style.height = '40px';
    cursor.style.borderColor = '#60a5fa';
  });
  
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderColor = '#3b82f6';
  });
});
