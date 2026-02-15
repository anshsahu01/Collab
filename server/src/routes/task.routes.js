import express from "express";
import {
  createTask,
  getTasks,
  deleteTask,
  moveTask,
  assignTask
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTask);

router.get("/:listId", protect, getTasks);

router.delete("/:id", protect, deleteTask);

router.put("/move", protect, moveTask);

router.put("/assign", protect, assignTask);

export default router;
