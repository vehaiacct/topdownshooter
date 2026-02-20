// server/gameLoop.js
const players = {};
const bots = {};
const bullets = [];

function startGameLoop(io, User) {
  setInterval(() => {
    // Move bullets
    bullets.forEach((b, index) => {
      b.x += Math.cos(b.angle) * b.speed;
      b.y += Math.sin(b.angle) * b.speed;
      // Remove if out of bounds
      if (b.x < 0 || b.x > 800 || b.y < 0 || b.y > 600) bullets.splice(index, 1);
    });

    // Bot AI (simple random movement)
    Object.values(bots).forEach(bot => {
      if (!bot.isAlive) return;
      bot.x += (Math.random() - 0.5) * 5;
      bot.y += (Math.random() - 0.5) * 5;
    });

    // Broadcast game state to all clients
    io.emit('gameState', { players, bots, bullets });
  }, 1000 / 30); // 30 ticks/sec
}

module.exports = { startGameLoop, players, bots, bullets };
