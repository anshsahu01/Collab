import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createServer } from "http"; // Move imports to top
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { setIO } from "./socket.js";
import Board from "./models/Board.js";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import boardRoutes from "./routes/board.routes.js";
import listRoutes from "./routes/list.routes.js";
import taskRoutes from "./routes/task.routes.js";
import activityRoutes from "./routes/activity.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Supports one or more frontend origins: "http://a.com,http://b.com"
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Create the HTTP server first
const httpServer = createServer(app); 

// Attach Socket.io to that HTTP server
const io = new Server(httpServer, {
  cors: corsOptions,
});
setIO(io);

// Middleware
app.use(cors(corsOptions));
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
io.use((socket, next) => {
  // Socket clients authenticate once during handshake using JWT.
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    // Every user gets a private room for targeted events like myTasksRefresh.
    socket.join(`user:${decoded.userId}`);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinBoard", async (boardId) => {
    if (!boardId) return;
    try {
      // Prevent room-join by non-members (important for board privacy).
      const isMember = await Board.exists({
        _id: boardId,
        members: socket.userId,
      });

      if (!isMember) {
        socket.emit("socketError", { message: "Board access denied" });
        return;
      }

      socket.join(boardId.toString());
      console.log(`User ${socket.id} joined board ${boardId}`);
    } catch {
      socket.emit("socketError", { message: "Invalid board id" });
    }
  });

  socket.on("leaveBoard", (boardId) => {
    socket.leave(boardId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

if (process.env.NODE_ENV !== "test") {
  // IMPORTANT: Listen on the httpServer, NOT app.listen
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export { httpServer };
export default app;
