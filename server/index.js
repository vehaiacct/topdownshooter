require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const { startGameLoop, players, bots, bullets } = require('./gameLoop');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static client files
app.use(express.static(path.join(__dirname, '../client')));

// In-memory storage (no database!)
const users = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (users.has(username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    users.set(username, {
      username,
      passwordHash,
      totalKills: 0,
      weeklyKills: 0,
      selectedSkin: "default"
    });
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token, username, selectedSkin: "default" });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);
  if (!user) return res.status(400).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: 'Incorrect password' });
  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token, username, selectedSkin: user.selectedSkin });
});

app.get('/leaderboard', (req, res) => {
  const allUsers = Array.from(users.values())
    .sort((a, b) => b.weeklyKills - a.weeklyKills)
    .slice(0, 50)
    .map(u => ({
      username: u.username,
      weeklyKills: u.weeklyKills,
      selectedSkin: u.selectedSkin
    }));
  res.json(allUsers);
});

// HTTP Server & Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('joinGame', async ({ token }) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userData = users.get(decoded.username);
      if (!userData) return socket.emit('error', { message: 'User not found' });

      players[socket.id] = {
        id: socket.id,
        username: userData.username,
        x: Math.random() * 800,
        y: Math.random() * 600,
        hp: 100,
        isAlive: true,
        skin: userData.selectedSkin,
        totalKills: userData.totalKills,
        weeklyKills: userData.weeklyKills,
        input: { up: false, down: false, left: false, right: false, shooting: false, angle: 0 }
      };

      socket.emit('init', { selfId: socket.id, players, bots, bullets });
      console.log(`Player ${userData.username} joined`);
    } catch (err) {
      console.log('Invalid token:', err.message);
      socket.emit('error', { message: 'Invalid token' });
    }
  });

  socket.on('input', data => {
    if (players[socket.id]) {
      players[socket.id].input = data;
    }
  });

  socket.on('disconnect', () => {
    const player = players[socket.id];
    if (player) {
      const user = users.get(player.username);
      if (user) {
        user.totalKills = player.totalKills;
        user.weeklyKills = player.weeklyKills;
      }
      delete players[socket.id];
      console.log(`Player ${player?.username} disconnected`);
    }
  });
});

// Spawn bots
const { spawnBot } = require('./botManager');
spawnBot('bot1', 'Bot Alpha');
spawnBot('bot2', 'Bot Beta');
spawnBot('bot3', 'Bot Gamma');

// Start game loop
startGameLoop(io, null);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server running on port', PORT));
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port', PORT);

});