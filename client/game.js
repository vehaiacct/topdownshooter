const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// NEW (make it global)
window.gameState = {
    selfId: null,
    players: {},
    bots: {},
    bullets: []
};

function gameLoop() {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (typeof renderLoop === 'function') {
        renderLoop();
    } else {
        ctx.fillStyle = "#fff";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Connecting to server...", canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Game initialized");
    gameLoop();
});