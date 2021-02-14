import { Notification } from "../types/Notification";
import {
  CursorPaginatedResponse,
  PaginatedResponse,
} from "../types/PaginatedResponse";
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
  cursor?: number,
  pageSize: number = 10
): Promise<CursorPaginatedResponse<Notification>> => {
  const res = await api.get<CursorPaginatedResponse<Notification>>(
    `notification?pageSize=${pageSize}${cursor ? `&cursor=${cursor}` : ""}`
  );
  return res.data;
};

export const readNotification = async (id: string): Promise<void> => {
  await api.post<void>(`notification/read/${id}`);
};
