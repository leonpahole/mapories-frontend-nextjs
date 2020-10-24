import { AuthUser } from "../types/AuthUser";
import { api } from "./api";
import { UserProfileData } from "../types/UserProfile";

export const profile = async (): Promise<AuthUser> => {
  const res = await api.get<AuthUser>(`auth/me`);
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
