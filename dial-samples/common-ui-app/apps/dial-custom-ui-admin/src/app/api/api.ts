import { ApplicationApi } from './application-api';
import { ConfigApi } from '@/custom-app-ui/common/src/server/config-api';
import { ThemesApi } from '@/custom-app-ui/common/src/server/themes-api';

export const themesApi = new ThemesApi();

export const configApi = new ConfigApi({
  host: process.env.API_URL,
});

export const applicationApi = new ApplicationApi({
  host: process.env.API_URL,
});
