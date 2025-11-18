import { FC } from 'react';

import { Config } from '@/custom-app-ui/common/src/models/config';
import ConfigView from '@/custom-app-ui/common/src/components/ConfigView/ConfigView';

interface Props {
  config?: Config;
  isHighlightError?: boolean;
  onChange: (config: Config) => void;
}

const Settings: FC<Props> = ({ config, isHighlightError, onChange }) => {
  return <ConfigView config={config} isHighlightError={isHighlightError} onChange={onChange} />;
};

export default Settings;
