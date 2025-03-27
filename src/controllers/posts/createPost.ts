import supabase from '../../extras/supabaseClient';
import { IncomingMessage, ServerResponse } from "http";

export const createPost = async (req: IncomingMessage, res: ServerResponse) => {
  const userId = req.headers["user-id"];
  if (!userId) {
    res.setHeader('Content-Type', 'application/json');
    return res.writeHead(401, JSON.stringify({ error: "Unauthorized" }));
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    const { title, content } = JSON.parse(body);
    if (!title || !content) {
      res.setHeader('Content-Type', 'application/json');
      return res.writeHead(400, JSON.stringify({ error: "Title and content are required" }));
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content, author_id: userId }])
      .select();

    if (error) {
      res.setHeader('Content-Type', 'application/json');
      return res.writeHead(500, JSON.stringify({ error: error.message }));
    }

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(201);
    res.end(JSON.stringify(data[0]));
  });
};