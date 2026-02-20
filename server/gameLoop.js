
const players = {};
const bots = {};
const bullets = [];

function startGameLoop(io, User) {
  setInterval(() => {
    // Process player movement
    Object.values(players).forEach(player => {
      if (!player.isAlive || !player.input) return;
      const speed = 3;
      if (player.input.up) player.y -= speed;
      if (player.input.down) player.y += speed;
      if (player.input.left) player.x -= speed;
      if (player.input.right) player.x += speed;
      player.x = Math.max(15, Math.min(785, player.x));
      player.y = Math.max(15, Math.min(585, player.y));
    });

    // Move bullets
    bullets.forEach((b, index) => {
      b.x += Math.cos(b.angle) * b.speed;
      b.y += Math.sin(b.angle) * b.speed;
      if (b.x < 0 || b.x > 800 || b.y < 0 || b.y > 600) {
        bullets.splice(index, 1);
      }
    });

    // Bot AI
    Object.values(bots).forEach(bot => {
      if (!bot.isAlive) return;
      bot.x += (Math.random() - 0.5) * 3;
      bot.y += (Math.random() - 0.5) * 3;
      bot.x = Math.max(15, Math.min(785, bot.x));
      bot.y = Math.max(15, Math.min(585, bot.y));
    });

    io.emit('gameState', { players, bots, bullets });
  }, 1000 / 30);
}

module.exports = { startGameLoop, players, bots, bullets };