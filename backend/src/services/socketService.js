const { Server } = require("socket.io");

class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: true,
        methods: ["GET", "POST"],
      },
    });

    this.initializeHandlers();
  }

  initializeHandlers() {
    this.io.on("connection", (socket) => {
      const username = socket.handshake.auth.username;
      console.log(`User ${username} connected`);

      // Join a room
      socket.on("join_room", async (roomId) => {
        socket.join(roomId);
        console.log(`User ${username} joined room: ${roomId}`);

        // Notify others in the room
        socket.to(roomId).emit("user_joined", {
          username,
          message: `${username} joined the room`,
        });
      });

      // Leave a room
      socket.on("leave_room", (roomId) => {
        socket.leave(roomId);
        console.log(`User ${username} left room: ${roomId}`);

        socket.to(roomId).emit("user_left", {
          username,
          message: `${username} left the room`,
        });
      });

      // Send message
      socket.on("send_message", async (data) => {
        const { roomId, content } = data;
        console.log({roomId, content})
        try {
          // Broadcast message to room with user information
          this.io.to(roomId).emit("receive_message", {
            content,
            user: { username },
            createdAt: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error saving message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      });

      // Typing indicators
      socket.on("typing_start", (roomId) => {
        socket.to(roomId).emit("user_typing", {
          username,
          isTyping: true,
        });
      });

      socket.on("typing_stop", (roomId) => {
        socket.to(roomId).emit("user_typing", {
          username,
          isTyping: false,
        });
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`User ${username} disconnected`);
      });
    });
  }

  getIO() {
    return this.io;
  }
}

module.exports = SocketService;
