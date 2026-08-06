import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createPost } from "../controller/post.controller.js";

const router = express.Router();
router.post("/create", protectRoute, createPost);
//router.post("/like/:id",protectRoute,likeUnlikePost)
//router.post("/comment/:id",protectRoute,commentPost)
//router.post("/",protectRoute,deletePost)

export default router;
