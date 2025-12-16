import { Theme } from '@/custom-app-ui/common/src/models/theme';

const THEMES_URL = process.env.THEMES_CONFIG_URL;

export class ThemesApi {
  getThemes(): Promise<Theme[] | null> {
    return fetch(`${THEMES_URL}/config.json`)
      .then((res) => res.json())
      .then((res) => res.themes)
      .catch(() => null);
  }
}
