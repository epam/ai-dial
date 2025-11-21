import { Editor, Monaco } from '@monaco-editor/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { EDITOR_THEMES, EDITOR_THEMES_CONFIG } from '@/custom-app-ui/admin/src/constants/editor';
import { Config } from '@/custom-app-ui/common/src/models/config';

interface Props {
  config: Config;
  onChangeJSON: (config: Config) => void;
}

const JSONEditor: FC<Props> = ({ config, onChangeJSON }) => {
  const [currentConfig, setCurrentConfig] = useState('');

  function handleBeforeMount(monaco: Monaco) {
    monaco?.editor?.defineTheme(EDITOR_THEMES.dark, EDITOR_THEMES_CONFIG[EDITOR_THEMES.dark]);
  }

  const onChange = useCallback(
    (updatedConfig?: string) => {
      if (updatedConfig) {
        onChangeJSON(JSON.parse(updatedConfig));
      }
    },
    [onChangeJSON],
  );

  useEffect(() => {
    setCurrentConfig(JSON.stringify(config, null, 4));
  }, [config]);

  return (
    <Editor
      beforeMount={handleBeforeMount}
      height="100%"
      defaultLanguage="json"
      value={currentConfig}
      onChange={onChange}
      theme={EDITOR_THEMES.dark}
      options={{
        minimap: { enabled: false },
        formatOnType: true,
        formatOnPaste: true,
        selectOnLineNumbers: false,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        smoothScrolling: true,
        overviewRulerLanes: 0,
        scrollbar: {
          horizontal: 'hidden',
          verticalScrollbarSize: 4,
          verticalSliderSize: 4,
        },
      }}
    />
  );
};

export default JSONEditor;
