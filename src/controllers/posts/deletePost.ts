import supabase from '../../extras/supabaseClient';
import { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

export const deletePost = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.headers["user-id"];
  if (!userId) {
    res.setHeader('Content-Type', 'application/json');
    return res.writeHead(401, JSON.stringify({ error: "Unauthorized" }));
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const postId = url.pathname.split("/").pop();
  if (!postId) {
    res.setHeader('Content-Type', 'application/json');
    return res.writeHead(400, JSON.stringify({ error: "Invalid post ID" }));
  }

  // Check if the post belongs to the user
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId ?? '')
    .single();

  if (fetchError || !post) {
    res.setHeader('Content-Type', 'application/json');
    return res.writeHead(404, JSON.stringify({ error: "Post not found" }));
  }
  if (post.author_id !== userId) {
    res.setHeader('Content-Type', 'application/json');
    return res.writeHead(403, JSON.stringify({ error: "Forbidden" }));
  }

  // Delete the post
  const { error: deleteError } = await supabase.from("posts").delete().eq("id", postId ?? '');

  if (deleteError) {
    res.setHeader('Content-Type', 'application/json');
    return res.writeHead(500, JSON.stringify({ error: deleteError.message }));
  }

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify({ message: "Post deleted successfully" }));
};