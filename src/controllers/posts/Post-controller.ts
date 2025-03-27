import { prisma } from "../../extras/prisma";
import { jwtSecretKey } from "../../../environment.ts";
import jwt from "jsonwebtoken";
import {
  type GetPostsResult,
  type GetMyPostsResult,
  type CreatePostResult,
  type DeletePostResult,
} from "./Post-types";

export const getPosts = async (parameters: {
  limit: number;
  offset: number;
}): Promise<GetPostsResult> => {
  try {
    const posts = await prisma.post.findMany({
      take: parameters.limit,
      skip: parameters.offset,
      orderBy: {
        createAt: "desc",
      },
    });

    const result: GetPostsResult = {
      posts,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw Error("Failed to retrieve posts");
  }
};

export const getMyPosts = async (parameters: {
  limit: number;
  offset: number;
  userId: string;
}): Promise<GetMyPostsResult> => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: parameters.userId,
      },
      take: parameters.limit,
      skip: parameters.offset,
      orderBy: {
        createAt: "desc",
      },
    });

    const result: GetMyPostsResult = {
      posts,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw Error("Failed to retrieve my posts");
  }
};

export const createPost = async (parameters: {
  title: string;
  content: string;
  userId: string;
}): Promise<CreatePostResult> => {
  try {
    const post = await prisma.post.create({
      data: {
        title: parameters.title,
        content: parameters.content,
        authorId: parameters.userId,
      },
    });

    const result: CreatePostResult = {
      post,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw Error("Failed to create post");
  }
};

export const deletePost = async (parameters: {
  postId: string;
  userId: string;
}): Promise<DeletePostResult> => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parameters.postId,
      },
    });

    if (!post || post.authorId !== parameters.userId) {
      throw Error("Post not found or not owned by user");
    }

    await prisma.post.delete({
      where: {
        id: parameters.postId,
      },
    });

    const result: DeletePostResult = {
      success: true,
    };

    return result;
  } catch (e) {
    console.error(e);
    throw Error("Failed to delete post");
  }
};