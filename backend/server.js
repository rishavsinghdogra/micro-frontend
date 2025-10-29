require('dotenv').config();
const http = require('http');
const app = require('./app');
const SocketService = require('./src/services/socketService');

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
new SocketService(server);

// Start server
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log(' SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log(' Process terminated!');
  });
});