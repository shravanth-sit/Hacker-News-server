import type { Post } from "@prisma/client";
import type { User } from "@prisma/client";

export type GetPostsResult = {
  posts: Post[];
}

export enum GetPostsError {
  UNKNOWN = "UNKNOWN",
}

export type GetMyPostsResult = {
  posts: Post[];
}

export enum GetMyPostsError {
  UNKNOWN = "UNKNOWN",
}

export type CreatePostResult = {
  post: Post;
}

export enum CreatePostError {
  UNKNOWN = "UNKNOWN",
}

export type DeletePostResult = {
  success: boolean;
}

export enum DeletePostError {
  POST_NOT_FOUND = "POST_NOT_FOUND",
  NOT_OWNED_BY_USER = "NOT_OWNED_BY_USER",
  UNKNOWN = "UNKNOWN",
}