import { UserExcerpt } from "./UserExcerpt";

export type Comment = {
  id: string;
  content: string;
  postedAt: Date;
  author: UserExcerpt;
  likesAmount: number;
  myLike: boolean;
};
