import { api } from "./api";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";
import { PaginatedResponse } from "../types/PaginatedResponse";
import { MaporyMapItem } from "../types/MaporyMapItem";
import { FileType } from "rsuite/lib/Uploader";

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

export const getMyFeed = async (
  pageNumber: number,
  pageSize: number = 10
): Promise<PaginatedResponse<Post>> => {
  const res = await api.get<PaginatedResponse<Post>>(
    `post/feed?pageNum=${pageNumber}&pageSize=${pageSize}`
  );

  return res.data;
};

export const getFeedMapData = async (): Promise<MaporyMapItem[]> => {
  const res = await api.get<MaporyMapItem[]>(`post/my-mapories-feed`);
  return res.data;
};

export const getMapDataForUser = async (
  userId: string | null = null
): Promise<MaporyMapItem[]> => {
  const res = await api.get<MaporyMapItem[]>(`post/my-mapories/${userId}`);
  return res.data;
};

export interface CreateOrUpdatePostData {
  content: string;
  mapory?: {
    latitude: number;
    longitude: number;
    placeName: string;
    visitDate: Date;
    rating: number | null;
  };
}

export const createPost = async (
  post: CreateOrUpdatePostData
): Promise<Post> => {
  const res = await api.post<Post>(`post`, post);

  return res.data;
};

export const updatePicturesForPost = async (
  postId: string,
  pictures: FileType[],
  deletedPictures: string[] = []
): Promise<string[]> => {
  const formData = new FormData();
  for (let p of pictures) {
    formData.append(`pictures`, p.blobFile as Blob);
  }

  formData.append(`deletedPictures`, JSON.stringify(deletedPictures));

  const res = await api.patch<string[]>(
    `post/update-pictures/${postId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const updatePost = async (
  postId: string,
  post: CreateOrUpdatePostData
): Promise<Post> => {
  const res = await api.patch<Post>(`post/${postId}`, post);
  return res.data;
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
  const res = await api.post<Comment>(`comment/post/${id}`, {
    content,
  });

  return res.data;
};

export const updateComment = async (
  postId: string,
  commentId: string,
  content: string
): Promise<void> => {
  await api.patch<void>(`comment/post/${postId}/${commentId}`, {
    content,
  });
};

export const deleteComment = async (
  postId: string,
  commentId: string
): Promise<{ markedDeleted: boolean }> => {
  const res = await api.delete<{ markedDeleted: boolean }>(
    `comment/post/${postId}/${commentId}`
  );
  return res.data;
};

export const getPostComments = async (
  id: string,
  pageNum: number,
  pageSize: number = 10
): Promise<PaginatedResponse<Comment>> => {
  const res = await api.get<PaginatedResponse<Comment>>(
    `comment/post/${id}?pageNum=${pageNum}&pageSize=${pageSize}`
  );

  return res.data;
};

export const likeComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  await api.post<Post>(`comment/post/${postId}/${commentId}/like`);
};

export const unlikeComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  await api.post<Post>(`comment/post/${postId}/${commentId}/unlike`);
};

/* comments on comments */

export const createCommentOnComment = async (
  commentId: string,
  content: string
): Promise<Comment> => {
  const res = await api.post<Comment>(`comment/comment/${commentId}`, {
    content,
  });

  return res.data;
};

export const updateCommentOnComment = async (
  commentId: string,
  commentOnCommentId: string,
  content: string
): Promise<void> => {
  await api.patch<void>(`comment/comment/${commentId}/${commentOnCommentId}`, {
    content,
  });
};

export const deleteCommentOnComment = async (
  commentId: string,
  commentOnCommentId: string
): Promise<{ parentDeleted: boolean }> => {
  const res = await api.delete<{ parentDeleted: boolean }>(
    `comment/comment/${commentId}/${commentOnCommentId}`
  );

  return res.data;
};

export const getCommentComments = async (
  commentId: string,
  pageNum: number,
  pageSize: number = 10
): Promise<PaginatedResponse<Comment>> => {
  const res = await api.get<PaginatedResponse<Comment>>(
    `comment/comment/${commentId}?pageNum=${pageNum}&pageSize=${pageSize}`
  );

  return res.data;
};

export const likeCommentOnComment = async (
  commentId: string,
  commentOnCommentId: string
): Promise<void> => {
  await api.post<Post>(
    `comment/comment/${commentId}/${commentOnCommentId}/like`
  );
};

export const unlikeCommentOnComment = async (
  commentId: string,
  commentOnCommentId: string
): Promise<void> => {
  await api.post<Post>(
    `comment/comment/${commentId}/${commentOnCommentId}/unlike`
  );
};
