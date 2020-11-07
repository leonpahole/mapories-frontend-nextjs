import { api } from "./api";
import { MaporyExcerpt, Mapory } from "../types/mapory";
import { Comment } from "../types/Comment";

export const getMaporiesForUser = async (
  userId: string | null = null
): Promise<MaporyExcerpt[]> => {
  const res = await api.get<MaporyExcerpt[]>(
    `mapory/my/${userId ? userId : ""}`
  );

  return res.data;
};

export const createMapory = async (
  name: string,
  description: string | null,
  rating: number | null,
  latitude: number,
  longitude: number,
  placeName: string,
  visitDate: Date
): Promise<MaporyExcerpt> => {
  const res = await api.post<MaporyExcerpt>(`mapory`, {
    name,
    description,
    rating,
    latitude,
    longitude,
    placeName,
    visitDate,
  });
  return res.data;
};

export const getMaporyById = async (id: string): Promise<Mapory> => {
  const res = await api.get<Mapory>(`mapory/${id}`);
  return res.data;
};

export const likeMapory = async (id: string): Promise<void> => {
  await api.post<void>(`mapory/like/${id}`);
};

export const unlikeMapory = async (id: string): Promise<void> => {
  await api.post<void>(`mapory/unlike/${id}`);
};

export const commentMapory = async (
  id: string,
  content: string
): Promise<void> => {
  await api.post<void>(`mapory/${id}/comment`, {
    content,
  });
};

export const getMaporyComments = async (
  id: string,
  pageNum: number,
  pageSize: number = 10
): Promise<Comment> => {
  const res = await api.get<Comment>(
    `mapory/${id}/comment?pageNum=${pageNum}&pageSize=${pageSize}`
  );

  return res.data;
};
