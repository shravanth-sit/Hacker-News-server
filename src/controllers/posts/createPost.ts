import { supabase } from "../../extras/supabaseClient";
import { IncomingMessage, ServerResponse } from "http";

export const createPost = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.writeHead(401, { "Content-Type": "application/json" }, JSON.stringify({ error: "Unauthorized" }));

  const { title, content } = JSON.parse(req.body);
  if (!title || !content) return res.writeHead(400, { "Content-Type": "application/json" }, JSON.stringify({ error: "Title and content are required" }));

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, author_id: userId }])
    .select();

  if (error) return res.writeHead(500, { "Content-Type": "application/json" }, JSON.stringify({ error: error.message }));

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data[0]));
};