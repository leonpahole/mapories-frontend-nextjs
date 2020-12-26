import { Notification } from "../types/Notification";
import { PaginatedResponse } from "../types/PaginatedResponse";
import { api } from "./api";

export const subscribeToPushNotifications = async (
  subscription: PushSubscription
): Promise<void> => {
  await api.post<void>(`push/subscribe`, subscription);
};

export const getNotifications = async (
  pageNumber: number,
  pageSize: number = 10
): Promise<PaginatedResponse<Notification>> => {
  const res = await api.get<PaginatedResponse<Notification>>(
    `notification?pageNum=${pageNumber}&pageSize=${pageSize}`
  );
  return res.data;
};

export const readNotification = async (id: string): Promise<void> => {
  await api.post<void>(`notification/read/${id}`);
};
