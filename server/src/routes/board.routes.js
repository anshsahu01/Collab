import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
} from "../controllers/board.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBoard);
router.get("/", protect, getBoards);
router.get("/:id", protect, getBoardById);

export default router;
