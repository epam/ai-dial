import { editor } from 'monaco-editor';

export type JSONEditorThemeConfig = editor.IStandaloneThemeData;

export enum EDITOR_THEMES {
  dark = 'dark',
  light = 'light',
}

export const EDITOR_THEMES_CONFIG: Record<EDITOR_THEMES, JSONEditorThemeConfig> = {
  [EDITOR_THEMES.dark]: {
    base: 'vs-dark',
    inherit: false,
    rules: [
      { token: 'string.key.json', foreground: '#37BABC' },
      { token: 'string.value.json', foreground: '#5C8DEA' },
      { token: 'number', foreground: '#D97C27' },
      { token: 'keyword.json', foreground: '#F4CE46' },
      { token: 'delimiter', foreground: '#F3F4F6' },
      { token: 'delimiter.bracket.json', foreground: '#A972FF' },
      { token: 'delimiter.parenthesis', foreground: '#A972FF' },
    ],
    colors: {
      'editor.foreground': '#F76464',
      'editor.background': '#141A23',
      'editorCursor.foreground': '#F3F4F6',
      'editor.selectionBackground': '#5C8DEA2B',
      'editorLineNumber.foreground': '#333942',
      'scrollbarSlider.background': '#333942',
      'scrollbarSlider.hoverBackground': '#333942',
      'scrollbarSlider.activeBackground': '#333942',
    },
  },
  [EDITOR_THEMES.light]: {
    base: 'vs',
    inherit: false,
    rules: [
      { token: 'string.key.json', foreground: '#009D9F' },
      { token: 'string.value.json', foreground: '#2764D9' },
      { token: 'number', foreground: '#B25500' },
      { token: 'keyword.json', foreground: '#3F3D25' },
      { token: 'delimiter', foreground: '#141A23' },
      { token: 'delimiter.bracket.json', foreground: '#843EF3' },
      { token: 'delimiter.parenthesis', foreground: '#843EF3' },
    ],
    colors: {
      'editor.foreground': '#AE2F2F',
      'editor.background': '#F3F4F6',
      'editorCursor.foreground': '#141A23',
      'editor.selectionBackground': '#5C8DEA2B',
      'editorLineNumber.foreground': '#333942',
      'scrollbarSlider.background': '#333942',
      'scrollbarSlider.hoverBackground': '#333942',
      'scrollbarSlider.activeBackground': '#333942',
    },
  },
};
