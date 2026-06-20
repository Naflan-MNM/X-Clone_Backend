import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getProfile,
  followUnFollowUsers,
  getSuggestedUser,
  updateUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);
router.post("/follow/:id", protectRoute, followUnFollowUsers);
router.get("/suggested", protectRoute, getSuggestedUser);
router.post("/update", protectRoute, updateUser);

export default router;
