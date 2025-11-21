import { IncomingMessage } from 'http';
import { getToken, GetTokenParams, JWT } from 'next-auth/jwt';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { nextauthOptions } from './auth-callbacks';

export const getTokenRequest = async (
  headers: Promise<Headers>,
  cookies: Promise<unknown>,
): Promise<GetTokenParams> => {
  const headersList = await headers;
  const cookiesList = await cookies;

  return {
    req: { headers: headersList, cookies: cookiesList as NextApiRequestCookies } as unknown as IncomingMessage & {
      cookies: NextApiRequestCookies;
    },
    ...nextauthOptions,
  } as GetTokenParams;
};

export const getUserToken = async (
  isEnableAuth: boolean,
  headers: Promise<Headers>,
  cookies: Promise<unknown>,
): Promise<JWT | null> => {
  return isEnableAuth ? await getToken(await getTokenRequest(headers, cookies)) : null;
};
