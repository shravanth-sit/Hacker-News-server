import { supabase } from "../../extras/supabaseClient";
import { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

export const deletePost = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.writeHead(401, { "Content-Type": "application/json" }, JSON.stringify({ error: "Unauthorized" }));

  const url = new URL(req.url, `http://${req.headers.host}`);
  const postId = url.pathname.split("/").pop();

  // Check if the post belongs to the user
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (fetchError || !post) return res.writeHead(404, { "Content-Type": "application/json" }, JSON.stringify({ error: "Post not found" }));
  if (post.author_id !== userId) return res.writeHead(403, { "Content-Type": "application/json" }, JSON.stringify({ error: "Forbidden" }));

  // Delete the post
  const { error: deleteError } = await supabase.from("posts").delete().eq("id", postId);

  if (deleteError) return res.writeHead(500, { "Content-Type": "application/json" }, JSON.stringify({ error: deleteError.message }));

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Post deleted successfully" }));
};