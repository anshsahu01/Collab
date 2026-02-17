import express from "express";
import {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  moveTask,
  assignTask,
  searchTasks,
  getMyTasks
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTask);

router.get("/search", protect, searchTasks);
router.get("/my-tasks", protect, getMyTasks);

router.get("/:listId", protect, getTasks);

router.put("/move", protect, moveTask);
router.put("/assign", protect, assignTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);


export default router;
