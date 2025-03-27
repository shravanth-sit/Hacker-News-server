import { Request, Response } from "express";
import { supabase } from "../../extras/supabaseClient";

export const getAllPosts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + Number(limit) - 1);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(data);
};
