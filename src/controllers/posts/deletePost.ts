import { Request, Response } from "express";
import { supabase } from "../../extras/supabaseClient";

export const deletePost = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { postId } = req.params;

    // Check if the post belongs to the user
    const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("author_id")
        .eq("id", postId)
        .single();

    if (fetchError || !post) return res.status(404).json({ error: "Post not found" });
    if (post.author_id !== userId) return res.status(403).json({ error: "Forbidden" });

    // Delete the post
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", postId);

    if (deleteError) return res.status(500).json({ error: deleteError.message });

    res.status(200).json({ message: "Post deleted successfully" });
};
