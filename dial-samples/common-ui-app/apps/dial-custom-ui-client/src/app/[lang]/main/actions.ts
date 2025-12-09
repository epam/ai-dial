'use server';
import { cookies, headers } from 'next/headers';

import { configApi } from '@/custom-app-ui/client/src/app/api/api';
import { getUserToken } from '@/custom-app-ui/common/src/utils/auth/auth-request';
import { getIsEnableAuthToggle } from '@/custom-app-ui/common/src/utils/env/get-auth-toggle';

export async function getConfig() {
  const token = await getUserToken(getIsEnableAuthToggle(), headers(), cookies());
  return configApi.getConfig(token);
}
