const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SKINS = {
  default: { fill: "#fff", stroke: "#0ff", glow: "#0ff" },
  neon: { fill: "#111", stroke: "#39ff14", glow: "#39ff14" },
  fire: { fill: "#2b0f0f", stroke: "#ff4500", glow: "#ff4500" },
  shadow: { fill: "#1a1a2e", stroke: "#8a2be2", glow: "#8a2be2" },
  gold: { fill: "#1f1a00", stroke: "#ffd700", glow: "#ffd700" }
};

function renderLoop() {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#ff0";
  gameState.bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  Object.values(gameState.bots).forEach(bot => {
    if (!bot.isAlive) return;
    drawEntity(bot.x, bot.y, 15, SKINS[bot.skin] || SKINS.default, bot.username || bot.id);
  });

  Object.values(gameState.players).forEach(p => {
    if (!p.isAlive) return;
    drawEntity(p.x, p.y, 15, SKINS[p.skin] || SKINS.default, p.username);
  });

  if (gameState.selfId && gameState.players[gameState.selfId]) {
    const self = gameState.players[gameState.selfId];
    ctx.strokeStyle = "#0f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(self.x, self.y, 20, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawEntity(x, y, radius, skin, name) {
  ctx.shadowColor = skin.glow;
  ctx.shadowBlur = 20;
  ctx.fillStyle = skin.fill;
  ctx.strokeStyle = skin.stroke;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(name, x, y - 25);

  ctx.fillStyle = "#333";
  ctx.fillRect(x - 15, y - 20, 30, 4);
  ctx.fillStyle = "#0f0";
  ctx.fillRect(x - 15, y - 20, 30, 4);
}
