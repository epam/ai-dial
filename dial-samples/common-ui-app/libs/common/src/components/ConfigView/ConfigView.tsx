import { FC, useCallback } from 'react';

import { Config } from '@/custom-app-ui/common/src/models/config';
import { NumberInputField } from '@/custom-app-ui/common/src/components/InputField/InputField';
import { useI18n } from '@/custom-app-ui/common/src/locales/client';
import { BasicI18nKey } from '@/custom-app-ui/common/src/constants/i18n';

interface Props {
  config?: Config;
  readonly?: boolean;
  isHighlightError?: boolean;
  onChange?: (config: Config) => void;
}

const ConfigView: FC<Props> = ({ config, readonly, isHighlightError, onChange }) => {
  const t = useI18n();

  const onCountChange = useCallback(
    (count: number | string) => {
      const newConfig = { ...(config ?? {}), count: Number(count) };
      onChange?.(newConfig);
    },
    [config, onChange],
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-6 bg-layer-1">
          <NumberInputField
            elementId="num"
            value={config?.count}
            fieldTitle={t(BasicI18nKey.Number)}
            placeholder={t(BasicI18nKey.EnterValue)}
            invalid={isHighlightError}
            onChange={onCountChange}
            disabled={readonly}
            containerCssClass="max-w-[400px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigView;
