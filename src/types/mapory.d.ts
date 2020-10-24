import { UserProfileData } from "./UserProfile";

export type MaporyExcerpt = {
  id: string;
  name: string;
  description?: string;
  visitDate: Date;
  placeName: string;
  latitude: number;
  longitude: number;
};

export type Mapory = {
  mapory: MaporyExcerpt;
  author: UserProfileData;
};
