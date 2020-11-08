import { UserExcerpt } from "./UserExcerpt";

export type Comment = {
  id: string;
  content: string;
  postedAt: Date;
  author: UserExcerpt;
  likes: {
    likesAmount: number;
    myLike: boolean;
  };
};
