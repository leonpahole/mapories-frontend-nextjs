import { api } from "./api";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";

export const getPostsForUser = async (
  userId: string | null = null
): Promise<Post[]> => {
  const res = await api.get<Post[]>(`post/my/${userId ? userId : ""}`);

  return res.data;
};

export const getMaporiesForUser = async (
  userId: string | null = null
): Promise<Post[]> => {
  const res = await api.get<Post[]>(
    `post/my${userId ? "/" + userId : ""}?type=mapory`
  );

  return res.data;
};

export const createPost = async (content: string): Promise<Post> => {
  const res = await api.post<Post>(`post`, {
    content,
  });
  return res.data;
};

export const createMapory = async (
  content: string,
  latitude: number,
  longitude: number,
  placeName: string,
  visitDate: Date,
  rating: number | null
): Promise<Post> => {
  const res = await api.post<Post>(`post`, {
    content,
    mapory: {
      rating,
      latitude,
      longitude,
      placeName,
      visitDate,
    },
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

export const createComment = async (
  id: string,
  content: string
): Promise<Comment> => {
  const res = await api.post<Comment>(`post/${id}/comment`, {
    content,
  });

  return res.data;
};

export const getPostComments = async (
  id: string,
  pageNum: number,
  pageSize: number = 10
): Promise<Comment[]> => {
  const res = await api.get<Comment[]>(
    `post/${id}/comment?pageNum=${pageNum}&pageSize=${pageSize}`
  );

  return res.data;
};

export const likeComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  await api.post<Post>(`post/${postId}/comment/${commentId}/like`);
};

export const unlikeComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  await api.post<Post>(`post/${postId}/comment/${commentId}/unlike`);
};
