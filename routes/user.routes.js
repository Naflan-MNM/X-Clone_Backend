import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getProfile } from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);

export default router;
