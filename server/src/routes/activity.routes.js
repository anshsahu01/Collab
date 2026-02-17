import express from "express";
import { getBoardActivities } from "../controllers/activity.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:boardId", protect, getBoardActivities);

export default router;
