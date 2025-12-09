import { Account, AuthOptions, CallbacksOptions, CookiesOptions, Profile } from 'next-auth';

import { logger } from '@/custom-app-ui/common/src/server/logger';
import { Token } from '@/custom-app-ui/common/src/types/auth';
import { decodeJwt } from 'jose';
import { TokenSet } from 'openid-client';
import { isDefined } from '../../types/utility';
import { authProviders } from './auth-providers';
import NextClient, { RefreshToken } from './nextauth-client';
import { logTokenExpiration } from './log-token-info';

declare module 'next-auth' {
  interface Session {
    error?: string;
  }

  interface User {
    isAdmin?: boolean;
  }
}

const waitRefreshTokenTimeout = 5;

const REFRESH_TOKEN_THRESHOLD = 90 * 60 * 1000; // 32 minutes

const COOKIE_MAX_AGE = 15 * 60; // time in seconds

export const safeDecodeJwt = (accessToken: string) => {
  try {
    return decodeJwt(accessToken);
  } catch (err) {
    logger.error(err, "Token couldn't be parsed as JWT");
    return {};
  }
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: Token) {
  const displayedTokenSub = process.env.SHOW_TOKEN_SUB === 'true' ? token.sub : '******';

  try {
    // Ensure the token contains provider information
    if (!token.providerId) {
      throw new Error(`No provider information exists in token`);
    }

    const client = NextClient.getClient(token.providerId);
    if (!client) {
      logger.error(
        `No client for provider: ${token.providerId}. Sub: ${displayedTokenSub}. Token refresh failed for ${token.userId}`,
      );
      return {
        ...token,
        error: 'NoClientForProvider',
      };
    }

    let msWaiting = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const refresh = NextClient.getRefreshToken(token.userId);
      if (!refresh || !refresh.isRefreshing) {
        const localToken: RefreshToken = refresh || {
          isRefreshing: true,
          token,
        };
        logger.info(
          `Refreshing token: expires - ${new Date(Number(localToken.token?.accessTokenExpires))} now - ${new Date(
            Date.now(),
          )}, expires - threshold: ${new Date(Number(localToken.token?.accessTokenExpires) - REFRESH_TOKEN_THRESHOLD)}`,
        );
        if (
          typeof localToken.token?.accessTokenExpires === 'number' &&
          Date.now() < localToken.token.accessTokenExpires - REFRESH_TOKEN_THRESHOLD
        ) {
          return localToken.token;
        }

        NextClient.setIsRefreshTokenStart(token.userId, localToken);
        break;
      }

      await NextClient.delay();
      msWaiting += 50;

      if (msWaiting >= waitRefreshTokenTimeout * 1000) {
        throw new Error(`Waiting more than ${waitRefreshTokenTimeout} seconds for refreshing token`);
      }
    }

    const refreshedTokens = await client.refresh(token.refreshToken as string | TokenSet);

    if (!refreshedTokens || (!refreshedTokens.expires_in && !refreshedTokens.expires_at)) {
      throw new Error(`Error from auth provider while refreshing token`);
    }

    if (!refreshedTokens.refresh_token) {
      logger.warn(`Auth provider didn't provide new refresh token. Sub: ${displayedTokenSub}`);
    }

    if (!refreshedTokens.refresh_token && !token.refreshToken) {
      throw new Error('No refresh tokens exists');
    }

    logTokenExpiration(refreshedTokens, 'in refreshAccessToken callback');
    const returnToken = {
      ...token,
      access_token: refreshedTokens.access_token,
      accessTokenExpires: refreshedTokens.expires_in
        ? Date.now() + refreshedTokens.expires_in * 1000
        : (refreshedTokens.expires_at as number) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };

    NextClient.setIsRefreshTokenStart(token.userId, {
      isRefreshing: false,
      token: returnToken,
    });
    return returnToken;
  } catch (error: unknown) {
    logger.error(error, `Error when refreshing token: ${(error as Error).message}. Sub: ${displayedTokenSub}`);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

function buildCookiePrefix(useSecureCookies: boolean): string {
  let cookiePrefix = (useSecureCookies ? '__Secure-' : '')
  if (process.env.COOKIE_PREFIX) {
    cookiePrefix += process.env.COOKIE_PREFIX;
    cookiePrefix += '-';
  }

  return cookiePrefix;
}

// https://github.com/nextauthjs/next-auth/blob/a8dfc8ebb11ccb96fd694db888e52f0d20395e64/packages/core/src/lib/cookie.ts#L53
function defaultCookies(useSecureCookies: boolean, sameSite = 'lax'): CookiesOptions {
  const cookiePrefix = buildCookiePrefix(useSecureCookies);

  return {
    // default cookie options
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite,
        path: '/',
        secure: useSecureCookies,
        domain: process.env.COOKIE_DOMAIN || undefined,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite,
        path: '/',
        secure: useSecureCookies,
        domain: process.env.COOKIE_DOMAIN || undefined,
      },
    },
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using useSecureCookies
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name: `${useSecureCookies ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite,
        path: '/',
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite,
        path: '/',
        secure: useSecureCookies,
        maxAge: COOKIE_MAX_AGE,
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite,
        path: '/',
        secure: useSecureCookies,
        maxAge: COOKIE_MAX_AGE,
      },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite,
        path: '/',
        secure: useSecureCookies,
      },
    },
  };
}

const isSecure = !!process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.startsWith('https:');

export const callbacks: Partial<CallbacksOptions<Profile & { job_title?: string }, Account>> = {
  jwt: async (options) => {
    if (options.account) {
      return {
        ...options.token,
        jobTitle: options.profile?.job_title,
        access_token: options.account.access_token,
        accessTokenExpires:
          typeof options.account.expires_in === 'number'
            ? Date.now() + options.account.expires_in * 1000
            : (options.account.expires_at as number) * 1000,
        refreshToken: options.account.refresh_token,
        providerId: options.account.provider,
        userId: options.user.id,
        idToken: options.account.id_token,
      };
    }

    // Calculate remaining time until the access token expires
    const timeLeft =
      typeof options.token.accessTokenExpires === 'number' && options.token.accessTokenExpires - Date.now();

    if (timeLeft && timeLeft > REFRESH_TOKEN_THRESHOLD) {
      return {
        ...options.token,
      };
    }
    const typedToken = options.token as Token;
    const refreshedToken = await refreshAccessToken(typedToken);

    const newToken = { ...refreshedToken, isNew: true };
    if ((newToken as { error?: string }).error) {
      logger.error((newToken as { error?: string }).error, `Error during token refresh`);
    } else {
      logger.info('refreshed token');
    }
    return { ...newToken };
  },
  signIn: async (options) => isDefined(options.account?.access_token),
  session: async (options) => {
    if (options.token?.error) {
      logger.info(`Session error: ${options.token.error}`);
      (options.session as { error: unknown }).error = options.token.error;
    }
    return options.session;
  },
};

export const nextauthOptions: AuthOptions = {
  providers: authProviders,
  cookies: defaultCookies(isSecure, isSecure ? 'none' : 'lax'),
  callbacks: callbacks,
  session: {
    strategy: 'jwt',
  },
  // temp
  theme: {
    colorScheme: 'dark',
  },
  pages: {
    signIn: '/signin',
  },
  debug: true,
};
