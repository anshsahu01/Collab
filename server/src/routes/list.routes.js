import express from "express";
import {
  createList,
  getLists,
  deleteList,
} from "../controllers/list.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createList);

router.get("/:boardId", protect, getLists);

router.delete("/:id", protect, deleteList);

export default router;
