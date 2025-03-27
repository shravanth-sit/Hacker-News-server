import { Request, Response } from "express";
import { supabase } from '../../extras/prisma';

export const getMyPosts = async (req: Request, res: Response) => {
    const userId = req.user?.id; // Assuming user info is added via middleware
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + Number(limit) - 1);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(data);
};
