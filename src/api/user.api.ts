import { UserExcerpt } from "../types/UserExcerpt";
import { api } from "./api";
import { UserProfileData, FriendStatus } from "../types/UserProfile";
import { FriendRequest } from "../types/FriendRequest";

export const profile = async (): Promise<UserExcerpt> => {
  const res = await api.get<UserExcerpt>(`auth/me`);
  return res.data;
};

export const uploadProfilePicture = async (
  profilePicture: File
): Promise<void> => {
  let data = new FormData();
  data.append("profile-picture", profilePicture, profilePicture.name);
  await api.post<void>(`user/upload-profile-picture`, data, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
};

export const getUserProfile = async (
  userId: string | null = null
): Promise<UserProfileData> => {
  const res = await api.get<UserProfileData>(
    `user/${userId ? userId : "profile"}`
  );
  return res.data;
};

export const searchUsers = async (q: string): Promise<UserProfileData[]> => {
  const res = await api.get<UserProfileData[]>(`user/search?q=${q}`);

  return res.data;
};

export const sendFriendRequest = async (
  userId: string
): Promise<FriendStatus> => {
  const res = await api.post<{ newStatus: FriendStatus }>(
    `user/send-friend-request/${userId}`
  );

  return res.data.newStatus;
};

export const cancelFriendRequest = async (userId: string): Promise<void> => {
  await api.delete<void>(`user/cancel-friend-request/${userId}`);
};

export const acceptFriendRequest = async (userId: string): Promise<void> => {
  await api.post<void>(`user/accept-friend-request/${userId}`);
};

export const declineFriendRequest = async (userId: string): Promise<void> => {
  await api.delete<void>(`user/decline-friend-request/${userId}`);
};

export const removeFriendship = async (userId: string): Promise<void> => {
  await api.delete<void>(`user/remove-friendship/${userId}`);
};

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  const res = await api.get<FriendRequest[]>(`user/friend-requests`);
  return res.data;
};

export const getFriends = async (): Promise<UserExcerpt[]> => {
  const res = await api.get<UserExcerpt[]>(`user/friends`);
  return res.data;
};
