import { Notification } from "../types/Notification";
import { PaginatedResponse } from "../types/PaginatedResponse";
import { api } from "./api";

export const getUnreadNotificationsCount = async (): Promise<{
  notificationCount: number;
}> => {
  const res = await api.get<{ notificationCount: number }>(
    `notification/unreadCount`
  );
  return res.data;
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
