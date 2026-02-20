let socket;
let selfId;

function connectSocket(token) {
  socket = io("https://YOUR-RAILWAY-URL"); // Replace with Railway URL

  socket.on("connect", () => {
    console.log("Connected");
    socket.emit("joinGame", { token });
  });

  socket.on("init", data => {
    selfId = data.selfId;
    gameState.players = data.players;
    gameState.bots = data.bots;
    requestAnimationFrame(renderLoop);
  });

  socket.on("gameState", data => {
    gameState.players = data.players;
    gameState.bots = data.bots;
    gameState.bullets = data.bullets;
  });
}
