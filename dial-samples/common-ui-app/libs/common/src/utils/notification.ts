import { NotificationType, Notification } from '../models/notification';

export const getErrorNotification = (
  title?: string,
  description?: string,
  duration: number | null = null,
): Notification => {
  return {
    type: NotificationType.error,
    title: title ?? '',
    description: description ?? '',
    duration,
  };
};
