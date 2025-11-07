'use client';

import JSONEditor from '@/custom-app-ui/admin/src/components/JSONEditor/JSONEditor';
import { DEFAULT_CONFIG } from '@/custom-app-ui/admin/src/constants/config';
import { BasicI18nKey } from '@/custom-app-ui/common/src/constants/i18n';
import { Config } from '@/custom-app-ui/common/src/models/config';
import Button from '@/custom-app-ui/common/src/components/Button/Button';
import { ButtonsI18nKey } from '@/custom-app-ui/common/src/constants/i18n';
import { useAppContext } from '@/custom-app-ui/common/src/context/AppContext';
import { useNotification } from '@/custom-app-ui/common/src/context/NotificationContext';
import { useI18n } from '@/custom-app-ui/common/src/locales/client';
import { getErrorNotification } from '@/custom-app-ui/common/src/utils/notification';
import { ChatVisualizerConnector } from '@epam/ai-dial-chat-visualizer-connector';
import {
  VisualizerConnectorEvents,
  VisualizerConnectorRequest,
  VisualizerConnectorRequests,
} from '@epam/ai-dial-shared';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import Settings from '@/custom-app-ui/admin/src/components/Settings';
import { getConfig, saveConfig } from './actions';
import Loader from '@/custom-app-ui/common/src/components/Loader/Loader';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const t = useI18n();
  const searchParams = useSearchParams();
  const { visualizerConnector, applicationId } = useAppContext();
  const [isEditor, setIsEditor] = useState(false);
  const [config, setConfig] = useState<Config>({} as Config);
  const [initialConfig, setInitialConfig] = useState<Config>({} as Config);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaveDisable, setIsSaveDisable] = useState(false);

  const { showNotification } = useNotification();
  const showNotificationRef = useRef(showNotification);

  const isSaveBtnDisable = useCallback(
    () => !config.count || Number.isNaN(Number(config.count)) || config.count <= 0,
    [config],
  );

  useEffect(() => {
    setIsChanged(!isEqual(initialConfig, config));
    setIsSaveDisable(isSaveBtnDisable());
  }, [initialConfig, config, isSaveBtnDisable]);

  const saveNewConfig = useCallback(() => {
    if (isSaveBtnDisable()) {
      setIsSaveDisable(true);
      return;
    }
    setIsLoading(true);

    saveConfig(config, applicationId)
      .then((res) => {
        if (!res?.success) {
          console.error('Error saving config:', res.statusCode, res.response, res.errorHeader, res.errorMessage);
          showNotificationRef.current(getErrorNotification(t(BasicI18nKey.SaveFailed), res.errorMessage));
        } else {
          setInitialConfig(config);
        }
      })
      .catch((e) => {
        console.error('Failed to safe config', e);
        showNotificationRef.current(getErrorNotification(t(BasicI18nKey.SaveFailed), e.message));
      })
      .finally(() => setIsLoading(false));
  }, [config, isSaveBtnDisable, searchParams, t]);

  const discardConfig = () => {
    setConfig(initialConfig);
    setIsChanged(false);
  };

  const onChangeJSON = useCallback((config: Config) => {
    setConfig(config);
  }, []);

  const onChangeConfig = useCallback(
    (newConfig: Config) => {
      setConfig(newConfig);
    },
    [setConfig],
  );

  const handleMessage = useCallback(
    (event: MessageEvent<VisualizerConnectorRequest>) => {
      if (event.data?.type?.split('/')[1] === VisualizerConnectorRequests.sendVisualizeData) {
        const payloadData = (
          event.data.payload as {
            visualizerData: {
              jsonEditorEnabled?: boolean;
              saveChanges?: boolean;
            };
          }
        ).visualizerData;

        const editorEnabled = payloadData?.jsonEditorEnabled;
        if (editorEnabled != null) {
          setIsEditor(editorEnabled);
        }

        const saveChanges = payloadData?.saveChanges;
        if (saveChanges) {
          saveNewConfig();
        }
      }
    },
    [saveNewConfig],
  );

  const sendMessage = useCallback(
    async (visualizer: ChatVisualizerConnector) => {
      visualizer.send({
        type: VisualizerConnectorEvents.sendMessage,
        payload: { isChanged },
      });
    },
    [isChanged],
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    if (visualizerConnector) {
      sendMessage(visualizerConnector);
    }
  }, [isChanged, sendMessage, visualizerConnector]);

  useEffect(() => {
    if (applicationId != null && (config == null || Object.keys(config).length === 0)) {
      getConfig(applicationId)
        .then((res) => {
          if (res && res.success && res.response) {
            setInitialConfig(res.response);
            setConfig(res.response);
          } else {
            showNotificationRef.current(
              getErrorNotification(
                t(BasicI18nKey.LoadFailed),
                `${res?.errorMessage?.slice(0, 1000)}${res?.errorMessage?.length && res.errorMessage.length > 1000 ? '...' : ''}`,
              ),
            );
            setConfig(DEFAULT_CONFIG);
            setInitialConfig(DEFAULT_CONFIG);
          }
        })
        .catch((e) => {
          showNotificationRef.current(getErrorNotification(t(BasicI18nKey.LoadFailed), e.message));
          setConfig(DEFAULT_CONFIG);
          setInitialConfig(DEFAULT_CONFIG);
        })
        .finally(() => setIsLoading(false));
    }
  }, [applicationId, config, t]);

  return (
    <div className="flex flex-col flex-1 bg-layer-1 p-4">
      <div className="flex justify-between mb-4 sticky top-0 py-4 bg-layer-1 z-10">
        <h1 className="h-[38px]">{t(BasicI18nKey.Parameters)}</h1>
        {isChanged && (
          <div className={`flex gap-4 ${isChanged ? '' : 'hidden'}`}>
            <Button cssClass="secondary" title={t(ButtonsI18nKey.Discard)} onClick={discardConfig} />
            <Button cssClass="primary" title={t(ButtonsI18nKey.Save)} onClick={saveNewConfig} disable={isSaveDisable} />
          </div>
        )}
      </div>
      <>
        {isLoading ? (
          <Loader size={50} />
        ) : (
          <>
            {isEditor ? (
              <JSONEditor config={config} onChangeJSON={onChangeJSON} />
            ) : (
              <Settings config={config} isHighlightError={isSaveDisable} onChange={onChangeConfig} />
            )}
          </>
        )}
      </>
    </div>
  );
}
