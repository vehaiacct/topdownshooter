
const inputState = {
  up: false,
  down: false,
  left: false,
  right: false,
  shooting: false,
  angle: 0
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') inputState.up = true;
  if (e.key === 'ArrowDown' || e.key === 's') inputState.down = true;
  if (e.key === 'ArrowLeft' || e.key === 'a') inputState.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd') inputState.right = true;
  if (e.key === ' ' || e.key === 'Enter') inputState.shooting = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') inputState.up = false;
  if (e.key === 'ArrowDown' || e.key === 's') inputState.down = false;
  if (e.key === 'ArrowLeft' || e.key === 'a') inputState.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') inputState.right = false;
  if (e.key === ' ' || e.key === 'Enter') inputState.shooting = false;
});

const joystickBase = document.getElementById("joystickBase");
const joystickKnob = document.getElementById("joystickKnob");
const fireBtn = document.getElementById("fireBtn");

let joystickActive = false;
let startX = 0, startY = 0;

if (joystickBase) {
  joystickBase.addEventListener("touchstart", e => {
    joystickActive = true;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
  });

  joystickBase.addEventListener("touchmove", e => {
    if (!joystickActive) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 50);
    const angle = Math.atan2(dy, dx);

    joystickKnob.style.transform = `translate(${Math.cos(angle) * dist - 25}px, ${Math.sin(angle) * dist - 25}px)`;

    inputState.up = dy < -10;
    inputState.down = dy > 10;
    inputState.left = dx < -10;
    inputState.right = dx > 10;
    inputState.angle = angle;
  });

  joystickBase.addEventListener("touchend", e => {
    joystickActive = false;
    joystickKnob.style.transform = "translate(-25px, -25px)";
    inputState.up = false;
    inputState.down = false;
    inputState.left = false;
    inputState.right = false;
  });
}

if (fireBtn) {
  fireBtn.addEventListener("touchstart", e => {
    e.preventDefault();
    inputState.shooting = true;
  });
  fireBtn.addEventListener("touchend", e => {
    e.preventDefault();
    inputState.shooting = false;
  });
}

setInterval(() => {
  if (typeof socket !== 'undefined' && socket.connected) {
    socket.emit("input", inputState);
  }
}, 1000 / 30);