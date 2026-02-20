require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const { startGameLoop, players, bots, bullets } = require('./gameLoop');

const app = express();
app.use(cors());
app.use(express.json());

// Serve client files
app.use(express.static(path.join(__dirname, '../client')));

// MongoDB setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  totalKills: { type: Number, default: 0 },
  weeklyKills: { type: Number, default: 0 },
  selectedSkin: { type: String, default: "default" }
});
const User = mongoose.model('User', userSchema);

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, passwordHash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, username: user.username, selectedSkin: user.selectedSkin });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ error: 'Incorrect password' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, username: user.username, selectedSkin: user.selectedSkin });
});

// Leaderboard
app.get('/leaderboard', async (req, res) => {
  const top50 = await User.find({})
    .sort({ weeklyKills: -1 })
    .limit(50)
    .select('username weeklyKills selectedSkin');
  res.json(top50);
});

// Start server
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

// Socket.io
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('joinGame', async ({ token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return;

      players[socket.id] = {
        id: socket.id,
        username: user.username,
        x: Math.random()*800,
        y: Math.random()*600,
        hp: 100,
        isAlive: true,
        skin: user.selectedSkin,
        totalKills: user.totalKills,
        weeklyKills: user.weeklyKills
      };

      socket.emit('init', { selfId: socket.id, players, bots, bullets });
    } catch(err) { console.log('Invalid token', err); }
  });

  socket.on('input', data => {
    if (!players[socket.id]) return;
    players[socket.id].input = data;
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    console.log('Disconnected:', socket.id);
  });
});

// Start game loop
startGameLoop(io, User);

// Railway port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server running on port', PORT));
