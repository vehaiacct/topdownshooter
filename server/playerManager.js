function respawnPlayer(player) {
  player.hp = 100;
  player.isAlive = true;
  player.x = Math.random() * 800;
  player.y = Math.random() * 600;
}

function handleKill(killer, victim, User) {
  if (killer && victim) {
    killer.totalKills++;
    killer.weeklyKills++;
  }
  respawnPlayer(victim);
}

module.exports = { respawnPlayer, handleKill };