import { JWT } from 'next-auth/jwt';
import { logger } from '@/custom-app-ui/common/src/server/logger';
import NextClient from './nextauth-client';

export const validateToken = async (token: JWT): Promise<{ error?: string }> => {
  if (!token || typeof token.providerId !== 'string') {
    logger.warn('Token is missing or providerId not found.');
    return { error: 'NoClientForProvider' };
  }

  const client = NextClient.getClient(token.providerId);
  if (!client) {
    logger.warn(`Client for providerId ${token.providerId} not found.`);
    return { error: 'NoClientForProvider' };
  }
  if (!client.introspect) {
    logger.warn(`Introspection URL for providerId ${token.providerId} not found.`);
    return { error: 'NoClientForProvider' };
  }
  if (token.access_token && typeof token.access_token === 'string') {
    const response = await client.introspect(token.access_token as string);
    logger.info('🚀 ~ validateToken ~ response:', response);

    return { error: response.active ? undefined : 'RefreshAccessTokenError' };
  }

  return {};
};
