import { ThemesApi } from '@/custom-app-ui/common/src/server/themes-api';
import { ConfigApi } from '@/custom-app-ui/common/src/server/config-api';

export const themesApi = new ThemesApi();

export const configApi = new ConfigApi({
  host: process.env.API_URL,
});
