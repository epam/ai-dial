import { Theme } from '@/custom-app-ui/common/src/models/theme';

export const applyTheme = (themes: Theme[] | null, currentTheme: string | null, root?: HTMLElement): void => {
  const theme = themes?.find((t) => t.id === currentTheme);
  if (theme && root) {
    const themeColors = theme.colors;

    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string);
    });
  }
};
