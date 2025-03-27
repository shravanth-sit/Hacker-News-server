import { createServer } from "http";
import { getAllPosts } from "../controllers/posts/getAllPosts";
import { getMyPosts } from "../controllers/posts/get_my_posts";
import { createPost } from "../controllers/posts/createPost";
import { deletePost } from "../controllers/posts/deletePost";
import { authMiddleware } from "../middlewares/authMiddleware";

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/posts") {
    getAllPosts(req, res);
  } else if (url.pathname === "/posts/me") {
    authMiddleware()(req, res, () => {
      getMyPosts(req, res);
    });
  } else if (url.pathname === "/posts" && req.method === "POST") {
    authMiddleware()(req, res, () => {
      createPost(req, res);
    });
  } else if (url.pathname.startsWith("/posts/") && req.method === "DELETE") {
    const postId = url.pathname.split("/").pop();
    authMiddleware()(req, res, () => {
      deletePost(req, res);
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});