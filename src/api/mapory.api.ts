import { api } from "./api";
import { MaporyExcerpt, Mapory } from "../types/mapory";

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
