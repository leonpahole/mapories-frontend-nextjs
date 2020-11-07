import { UserExcerpt } from "./UserExcerpt";

export type Post = {
  id: string;
  content: string;
  postedAt: Date;
  author: UserExcerpt;
  likesAmount: number;
  myLike: boolean;
};
