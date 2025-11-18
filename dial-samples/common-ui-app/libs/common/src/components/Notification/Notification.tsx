import { IconChevronDown, IconCircleCheck, IconExclamationCircle, IconLoader, IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import { FC, ReactNode } from 'react';

import Button from '@/custom-app-ui/common/src/components/Button/Button';
import {
  NotificationConfig,
  NotificationIconColor,
  NotificationType,
} from '@/custom-app-ui/common/src/models/notification';
import { BASE_ICON_PROPS } from '@/custom-app-ui/common/src/constants/main-layout';

export const NotificationIcons: Record<NotificationType, ReactNode> = {
  success: <IconCircleCheck {...BASE_ICON_PROPS} />,
  error: <IconExclamationCircle {...BASE_ICON_PROPS} />,
  dynamic: <IconChevronDown {...BASE_ICON_PROPS} />,
  progress: <IconLoader {...BASE_ICON_PROPS} />,
};

const Notification: FC<NotificationConfig> = ({ type, title, description, onClose }) => {
  const Icon = NotificationIcons[type];
  const iconClassNames = classNames('inline mr-2', NotificationIconColor[type]);

  return (
    <div className="flex flex-col layer-3 px-4 py-2 w-[400px] bg-layer-3 [&:not(:last-child)]:mb-4 rounded shadow">
      <div className="flex flex-row w-full relative pr-5 items-center">
        <div className="flex items-center w-full">
          <i className={iconClassNames}>{Icon}</i>
          <p className="small-text-semi truncate">{title}</p>
        </div>
        <Button cssClass={'absolute right-0'} onClick={onClose} icon={<IconX height={18} width={18} />} />
      </div>
      {description ? <p className="tiny text-secondary break-words whitespace-pre-wrap mt-2">{description}</p> : null}
    </div>
  );
};

export default Notification;
