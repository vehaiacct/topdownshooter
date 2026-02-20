let socket;
let selfId;

function connectSocket(token) {
  // Connect with proper configuration for Railway deployment
  socket = io({
    transports: ['websocket', 'polling'],
    path: '/socket.io/',
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on("connect", () => {
    console.log("Connected to server, socket id:", socket.id);
    socket.emit("joinGame", { token });
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
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
