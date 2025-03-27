import express from "express";
import { getAllPosts } from "../controllers/posts/getAllPosts";
import { getMyPosts } from "../controllers/posts/get_my_posts";
import { createPost } from "../controllers/posts/createPost";
import { deletePost } from "../controllers/posts/deletePost";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const authenticate = authMiddleware();
router.get("/posts", getAllPosts);
router.get("/posts/me", authenticate, getMyPosts);
router.post("/posts", authenticate, createPost);
router.delete("/posts/:postId", authenticate, deletePost);

export default router;
