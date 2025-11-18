import { JWT } from 'next-auth/jwt';

export const getIsTokenExpired = async (token: JWT | null) => {
  return token == null || (typeof token.accessTokenExpires === 'number' && Date.now() > token.accessTokenExpires);
};
