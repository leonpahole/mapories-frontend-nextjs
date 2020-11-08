import { UserExcerpt } from "./UserExcerpt";

export type PostExcerpt = {
  id: string;
  createdAt: Date;
  content: string;

  mapory?: {
    placeName: string;
    location: {
      latitude: number;
      longitude: number;
    };
    visitDate: Date;
    rating?: number;
  };

  likes: {
    likesAmount: number;
    myLike: boolean;
  };
};

export type Post = {
  post: PostExcerpt;
  author: UserExcerpt;
};
