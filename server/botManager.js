// server/botManager.js
const { bots } = require('./gameLoop');

function spawnBot(id, name) {
  bots[id] = {
    id,
    username: name,
    x: Math.random() * 800,
    y: Math.random() * 600,
    hp: 100,
    isAlive: true,
    skin: "default"
  };
}

function botAI() {
  Object.values(bots).forEach(bot => {
    if (!bot.isAlive) return;
    bot.x += (Math.random() - 0.5) * 3;
    bot.y += (Math.random() - 0.5) * 3;
  });
}

module.exports = { spawnBot, botAI };
