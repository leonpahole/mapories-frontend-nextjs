import { api } from "./api";
import { Post } from "../types/Post";

export const getPostsForUser = async (
  userId: string | null = null
): Promise<Post[]> => {
  const res = await api.get<Post[]>(`post/my/${userId ? userId : ""}`);

  return res.data;
};

export const createPost = async (content: string): Promise<Post> => {
  const res = await api.post<Post>(`post`, {
    content,
  });
  return res.data;
};

export const getPostById = async (id: string): Promise<Post> => {
  const res = await api.get<Post>(`post/${id}`);
  return res.data;
};

export const likePost = async (id: string): Promise<void> => {
  await api.post<Post>(`post/like/${id}`);
};

export const unlikePost = async (id: string): Promise<void> => {
  await api.post<Post>(`post/unlike/${id}`);
};
