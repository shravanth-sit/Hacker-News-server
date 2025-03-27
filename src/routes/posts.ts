import { Hono } from "hono";
import { getPosts, getMyPosts, createPost, deletePost } from "../controllers/post/post-controller";
import { GetPostsError, GetMyPostsError, CreatePostError, DeletePostError } from "../controllers/post/post-types";

export const postRoutes = new Hono();

postRoutes.get("/posts", async (c) => {
  try {
    const limit = c.req.query("limit");
    const offset = c.req.query("offset");
    const result = await getPosts({ limit, offset });

    return c.json({ data: result }, 200);
  } catch (error) {
    if (error === GetPostsError.UNKNOWN) {
      return c.json({ error: "Unknown error" }, 500);
    }
  }
});

postRoutes.get("/posts/me", async (c) => {
  try {
    const userId = c.req.headers.get("Authorization");
    const limit = c.req.query("limit");
    const offset = c.req.query("offset");
    const result = await getMyPosts({ limit, offset, userId });

    return c.json({ data: result }, 200);
  } catch (error) {
    if (error === GetMyPostsError.UNKNOWN) {
      return c.json({ error: "Unknown error" }, 500);
    }
  }
});

postRoutes.post("/posts", async (c) => {
  try {
    const { title, content } = await c.req.json();
    const userId = c.req.headers.get("Authorization");
    const result = await createPost({ title, content, userId });

    return c.json({ data: result }, 201);
  } catch (error) {
    if (error === CreatePostError.UNKNOWN) {
      return c.json({ error: "Unknown error" }, 500);
    }
  }
});

postRoutes.delete("/posts/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");
    const userId = c.req.headers.get("Authorization");
    const result = await deletePost({ postId, userId });

    return c.json({ data: result }, 200);
  } catch (error) {
    if (error === DeletePostError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    if (error === DeletePostError.NOT_OWNED_BY_USER) {
      return c.json({ error: "Post not owned by user" }, 403);
    }
    if (error === DeletePostError.UNKNOWN) {
      return c.json({ error: "Unknown error" }, 500);
    }
  }
});