// server.js — DreamHomes Backend Entry Point
require('dotenv').config();
require('express-async-errors');

const http   = require('http');
const app    = require('./src/app');
const { initSocket } = require('./src/config/socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🏠 DreamHomes Backend Server         ║
  ║   🚀 Running on port ${PORT}             ║
  ║   🌍 http://localhost:${PORT}/api        ║
  ╚════════════════════════════════════════╝
  `);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});
