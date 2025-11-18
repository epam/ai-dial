'use server';
import { cookies, headers } from 'next/headers';

import { applicationApi, configApi } from '@/custom-app-ui/admin/src/app/api/api';
import { Config } from '@/custom-app-ui/common/src/models/config';
import { getUserToken } from '@/custom-app-ui/common/src/utils/auth/auth-request';
import { getIsEnableAuthToggle } from '@/custom-app-ui/common/src/utils/env/get-auth-toggle';
import { ServerActionResponse } from '@/custom-app-ui/common/src/models/server-action';

export async function getConfig(applicationId: string | null): Promise<ServerActionResponse<Config>> {
  const token = await getUserToken(getIsEnableAuthToggle(), headers(), cookies());

  //Use the following line for a custom standalone application sample
  //return await configApi.getConfig(token);

  //Use the following line for a custom application runner sample
  return await applicationApi.getApplication(applicationId, token);
}

export async function saveConfig(config: Config, applicationId: string | null): Promise<ServerActionResponse> {
  const token = await getUserToken(getIsEnableAuthToggle(), headers(), cookies());

  //Use the following line for a custom standalone application sample
  //return await configApi.setConfig(config, token);

  //Use the following line for a custom application runner sample
  return await applicationApi.updateApplication(config, applicationId, token);
}
