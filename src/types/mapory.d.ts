import { UserProfileData } from "./UserProfile";
import { UserExcerpt } from "./UserExcerpt";

export type MaporyExcerpt = {
  id: string;
  name: string;
  description?: string;
  visitDate: Date;
  placeName: string;
  latitude: number;
  longitude: number;
  likesAmount: number;
  myLike: boolean;
};

export type Mapory = {
  mapory: MaporyExcerpt;
  author: UserExcerpt;
};
