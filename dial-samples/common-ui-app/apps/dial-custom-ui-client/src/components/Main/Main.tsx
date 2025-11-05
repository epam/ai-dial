/* eslint-disable @next/next/no-img-element */
import { useI18n } from '@/custom-app-ui/common/src/locales/client';

import { getConfig } from '@/custom-app-ui/client/src/app/[lang]/main/actions';
import ConfigView from '@/custom-app-ui/common/src/components/ConfigView/ConfigView';
import { BasicI18nKey } from '@/custom-app-ui/common/src/constants/i18n';
import { useNotification } from '@/custom-app-ui/common/src/context/NotificationContext';
import { Config } from '@/custom-app-ui/common/src/models/config';
import { getErrorNotification } from '@/custom-app-ui/common/src/utils/notification';
import { FC, useEffect, useRef, useState } from 'react';
import Loader from '@/custom-app-ui/common/src/components/Loader/Loader';

interface Props {
  config?: Config;
}

export const Main: FC<Props> = () => {
  const [config, setConfig] = useState<Config>({} as Config);
  const [isLoading, setIsLoading] = useState(true);
  const t = useI18n();

  const { showNotification } = useNotification();
  const showNotificationRef = useRef(showNotification);

  useEffect(() => {
    if (config == null || Object.keys(config).length === 0) {
      getConfig()
        .then((res) => {
          if (res && res.success && res.response) {
            setConfig(res.response);
          } else {
            showNotificationRef.current(
              getErrorNotification(
                t(BasicI18nKey.LoadFailed),
                `${res?.errorMessage?.slice(0, 1000)}${res?.errorMessage?.length && res.errorMessage.length > 1000 ? '...' : ''}`,
              ),
            );
          }
        })
        .catch((e) => {
          showNotificationRef.current(getErrorNotification(t(BasicI18nKey.LoadFailed), e.message));
        })
        .finally(() => setIsLoading(false));
    }
  }, [config, t]);

  return (
    <div className="flex flex-col flex-1 bg-layer-1 p-4">
      <div className="flex justify-between mb-4 sticky top-0 py-4 bg-layer-1 z-10">
        <h1 className="h-[38px]">{t(BasicI18nKey.Parameters)}</h1>
      </div>
      <>
        {isLoading ? (
          <Loader size={50} />
        ) : (
          <>
            <ConfigView config={config} readonly={true} />
          </>
        )}
      </>
    </div>
  );
};

export default Main;
