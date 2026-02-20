let socket;
let selfId;

function connectSocket(token) {
  socket = io();

  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("joinGame", { token });
  });

  socket.on("init", data => {
    console.log("Game initialized", data);
    selfId = data.selfId;
    gameState.players = data.players || {};
    gameState.bots = data.bots || {};
    gameState.bullets = data.bullets || [];
  });

  socket.on("gameState", data => {
    gameState.players = data.players || {};
    gameState.bots = data.bots || {};
    gameState.bullets = data.bullets || {};
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
}