export interface Notification {
  type: NotificationType;
  title: string;
  description: string;
  duration?: number | null;
  onClose?: () => void;
  downloadDetails?: FileDetails[];
}

export interface FileDetails {
  id: string;
  name: string;
  progress: number;
  onCancel?: () => void;
  failed: boolean;
  complete: boolean;
}

export interface NotificationConfig extends Notification {
  id: string;
}

export enum NotificationType {
  success = 'success',
  error = 'error',
  dynamic = 'dynamic',
  progress = 'progress',
}

export enum NotificationIconColor {
  success = 'text-icon-accent-secondary',
  error = 'text-icon-error',
  dynamic = 'text-icon-secondary',
  progress = 'text-icon-primary',
}
