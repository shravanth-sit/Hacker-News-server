import { supabase } from "../../extras/supabaseClient";
import { IncomingMessage, ServerResponse } from "http";
import { URLSearchParams } from "url";

export const getAllPosts = async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const params = new URLSearchParams(url.search);
  const page = params.get("page") || "1";
  const limit = params.get("limit") || "10";
  const offset = (Number(page) - 1) * Number(limit);

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  if (error) return res.writeHead(500, { "Content-Type": "application/json" }, JSON.stringify({ error: error.message }));

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};