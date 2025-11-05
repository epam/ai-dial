import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import Notification from '@/custom-app-ui/common/src/components/Notification/Notification';
import DynamicNotification from '@/custom-app-ui/common/src/components/Notification/DynamicNotification';
import { NotificationConfig, NotificationType } from '@/custom-app-ui/common/src/models/notification';

interface Props {
  notifications: NotificationConfig[];
}

const NotificationPortal: FC<Props> = ({ notifications }) => {
  return (
    <>
      {createPortal(
        <div className="flex flex-col fixed bottom-3 right-3 z-50">
          {notifications.map((notification) =>
            notification.type === NotificationType.dynamic ? (
              <DynamicNotification key={notification.id} {...notification} />
            ) : (
              <Notification key={notification.id} {...notification} />
            ),
          )}
        </div>,
        document.body,
      )}
    </>
  );
};

export default NotificationPortal;
