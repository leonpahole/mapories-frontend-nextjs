import { UserExcerpt } from "./UserExcerpt";
import { MapLocation } from "./MaporyMapItem";

export type PostExcerpt = {
  id: string;
  createdAt: Date;
  content: string;

  mapory?: {
    placeName: string;
    location: MapLocation;
    visitDate: Date;
    rating?: number;
  };

  images: PostImage[];

  likes: {
    likesAmount: number;
    myLike: boolean;
  };
};

export type PostImage = {
  url: string;
};

export type Post = {
  post: PostExcerpt;
  author: UserExcerpt;
};
