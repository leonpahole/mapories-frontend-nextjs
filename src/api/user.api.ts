import { User } from "../types/User";
import { api } from "./api";

export const profile = async (): Promise<User> => {
  const res = await api.get<User>(`user/me`);
  return res.data;
};
