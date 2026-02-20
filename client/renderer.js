const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SKINS = { default:{fill:"#fff",stroke:"#0ff",glow:"#0ff"}, neon:{fill:"#111",stroke:"#39ff14",glow:"#39ff14"}, fire:{fill:"#2b0f0f",stroke:"#ff4500",glow:"#ff4500"}, shadow:{fill:"#1a1a2e",stroke:"#8a2be2",glow:"#8a2be2"}, gold:{fill:"#1f1a00",stroke:"#ffd700",glow:"#ffd700"} };

const gameState = { players:{}, bots:{}, bullets:[] };

function renderLoop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,canvas.width,canvas.height);

  gameState.bullets.forEach(b=>{ ctx.fillStyle="#ff0"; ctx.beginPath(); ctx.arc(b.x,b.y,5,0,Math.PI*2); ctx.fill(); });
  Object.values(gameState.bots).forEach(bot => { if(!bot.isAlive) return; drawEntity(bot.x, bot.y, 15, SKINS[bot.skin]||SKINS.default, bot.id); });
  Object.values(gameState.players).forEach(p => { if(!p.isAlive) return; drawEntity(p.x, p.y, 15, SKINS[p.skin]||SKINS.default, p.username); });

  requestAnimationFrame(renderLoop);
}

function drawEntity(x,y,radius,skin,name){
  ctx.shadowColor = skin.glow; ctx.shadowBlur=20; ctx.fillStyle=skin.fill; ctx.strokeStyle=skin.stroke;
  ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.shadowBlur=0;
  ctx.font="12px sans-serif"; ctx.fillStyle="#fff"; ctx.textAlign="center"; ctx.fillText(name,x,y-20);
  }
