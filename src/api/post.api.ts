import { api } from "./api";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";
import { PaginatedResponse } from "../types/PaginatedResponse";
import { MaporyMapItem } from "../types/MaporyMapItem";

export const getPostsForUser = async (
  userId: string | null = null,
  pageNumber: number,
  pageSize: number = 10
): Promise<PaginatedResponse<Post>> => {
  const res = await api.get<PaginatedResponse<Post>>(
    `post/my${
      userId ? "/" + userId : ""
    }?pageNum=${pageNumber}&pageSize=${pageSize}`
  );

  return res.data;
};

export const getMapDataForUser = async (
  userId: string | null = null
): Promise<MaporyMapItem[]> => {
  const res = await api.get<MaporyMapItem[]>(`post/my-mapories/${userId}`);
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

export const updatePost = async (
  postId: string,
  content: string
): Promise<void> => {
  await api.patch<void>(`post/${postId}`, {
    content,
  });
};

export const updateMapory = async (
  postId: string,
  content: string,
  latitude: number,
  longitude: number,
  placeName: string,
  visitDate: Date,
  rating: number | null
): Promise<void> => {
  await api.patch<void>(`post/${postId}`, {
    content,
    mapory: {
      rating,
      latitude,
      longitude,
      placeName,
      visitDate,
    },
  });
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete<void>(`post/${id}`);
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

export const updateComment = async (
  postId: string,
  commentId: string,
  content: string
): Promise<void> => {
  await api.patch<void>(`post/${postId}/comment/${commentId}`, {
    content,
  });
};

export const deleteComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  await api.delete<void>(`post/${postId}/comment/${commentId}`);
};

export const getPostComments = async (
  id: string,
  pageNum: number,
  pageSize: number = 10
): Promise<PaginatedResponse<Comment>> => {
  const res = await api.get<PaginatedResponse<Comment>>(
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
