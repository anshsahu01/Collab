import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createServer } from "http"; // Move imports to top
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { setIO } from "./socket.js";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import boardRoutes from "./routes/board.routes.js";
import listRoutes from "./routes/list.routes.js";
import taskRoutes from "./routes/task.routes.js";
import activityRoutes from "./routes/activity.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create the HTTP server first
const httpServer = createServer(app); 

// Attach Socket.io to that HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, replace with your frontend URL
  }
});
setIO(io);

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activities", activityRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

// Socket.io Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const token = socket.handshake.auth?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.join(`user:${decoded.userId}`);
    } catch {
      // ignore invalid socket auth token
    }
  }

  socket.on("joinBoard", (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined board ${boardId}`);
  });

  socket.on("leaveBoard", (boardId) => {
    socket.leave(boardId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// IMPORTANT: Listen on the httpServer, NOT app.listen
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
