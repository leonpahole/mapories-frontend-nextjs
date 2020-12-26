import { UserExcerpt } from "./UserExcerpt";

export enum NotificationType {
  SENT_FRIEND_REQUEST = "SENT_FRIEND_REQUEST",
  ACCEPTED_FRIEND_REQUEST = "ACCEPTED_FRIEND_REQUEST",
  LIKED_YOUR_POST = "LIKED_YOUR_POST",
  COMMENTED_ON_YOUR_POST = "COMMENTED_ON_YOUR_POST",
  LIKED_YOUR_COMMENT = "LIKED_YOUR_COMMENT",
  REPLIED_TO_YOUR_COMMENT = "REPLIED_TO_YOUR_COMMENT",
  REPLIED_TO_A_COMMENT_YOU_REPLIED_TO = "REPLIED_TO_A_COMMENT_YOU_REPLIED_TO",
}

export interface Notification {
  id: string;
  createdAt: Date;
  type: NotificationType;
  sender: UserExcerpt;
  entityId?: string;
  read: boolean;
}

export type AddNotificatonsData = {
  notifications: Notification[];
  moreAvailable: boolean;
};
