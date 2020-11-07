export type UserProfileData = {
  id: string;
  name: string;
  profilePictureUrl?: string;
  friendStatus: FriendStatus;
};

export enum FriendStatus {
  IS_ME = 0,
  NONE = 1,
  PENDING_FROM_ME = 2,
  PENDING_FROM_THEM = 3,
  FRIENDS = 4,
}
