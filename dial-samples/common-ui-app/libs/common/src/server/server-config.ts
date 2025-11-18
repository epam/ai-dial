'use server';

import { getIsEnableAuthToggle } from '@/custom-app-ui/common/src/utils/env/get-auth-toggle';

export async function getServerConfig() {
  const isAuthEnabled = getIsEnableAuthToggle();
  return { isAuthEnabled };
}
