import { Request, Response } from "express";
import { supabase } from "../../extras/supabaseClient";

export const createPost = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content are required" });

    const { data, error } = await supabase
        .from("posts")
        .insert([{ title, content, author_id: userId }])
        .select();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data[0]);
};

