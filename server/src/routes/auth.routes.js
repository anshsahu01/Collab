import express from "express";
import { signup, login, getUsers } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/users", getUsers);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;