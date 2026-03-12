import express from "express";
import { signup, login, logout } from "../controller/auth.controler.js";

const router = express.Router();

router.get("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

export default router;
