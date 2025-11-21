'use client';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { ServerActionResponse } from '@/custom-app-ui/common/src/models/server-action';
import { UNAUTHORIZED_ERROR } from '@/custom-app-ui/common/src/constants/auth';
import { isClientSessionValid } from '@/custom-app-ui/common/src/utils/auth/session';
import { useAuth } from './use-auth';

interface ProtectedRequestOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export const useProtectedRequest = (options?: ProtectedRequestOptions) => {
  const { update: updateSession } = useAuth();
  const router = useRouter();

  return async <T = unknown>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actionFn: (...r: any[]) => Promise<ServerActionResponse<T>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => {
    const { maxRetries = 0, retryDelay = 1000 } = options ?? {};

    const ensureSessionValidity = async (session: Session | null) => {
      if (!isClientSessionValid(session)) {
        console.error('Session is not valid, signing out');
        await signOut({ redirect: false });
        await updateSession();
        router.push('/');
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    };

    const executeWithRetry = async (retryCount = 0): Promise<ServerActionResponse<T> | undefined> => {
      try {
        const response = await actionFn(...args);

        if (response?.success) {
          return response;
        }

        if (response?.statusCode === UNAUTHORIZED_ERROR) {
          console.error('Session expired, trying to refresh');

          const session = await updateSession();
          const isRedirected = await ensureSessionValidity(session);
          if (isRedirected) {
            return response;
          }

          const secondResponse = await actionFn(...args);
          if (secondResponse?.success || secondResponse?.statusCode !== UNAUTHORIZED_ERROR) {
            if (!secondResponse?.success && secondResponse?.statusCode) {
              console.error(`Received response with status code ${secondResponse.statusCode}`);
            }
            return secondResponse;
          }

          console.error('Received 401 after session refresh');
          await ensureSessionValidity(session);
          return secondResponse;
        }

        if (!response?.success && retryCount < maxRetries) {
          console.error(
            `Request failed with status code ${response?.statusCode}, retrying (${retryCount + 1}/${maxRetries})`,
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return executeWithRetry(retryCount + 1);
        }

        if (!response?.statusCode) {
          console.error(`Received final response with status code ${response.statusCode}`);
        }
        return response;
      } catch (error) {
        console.error(`Error executing request: ${error}`);

        if (retryCount < maxRetries) {
          console.error(`Retrying after error (${retryCount + 1}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return executeWithRetry(retryCount + 1);
        }

        return {
          success: false,
          statusCode: 500,
          error: `Request failed after ${maxRetries} retries: ${error}`,
        } as ServerActionResponse<T>;
      }
    };

    return executeWithRetry();
  };
};
