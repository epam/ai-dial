import { logger } from '@/custom-app-ui/common/src/server/logger';
import Auth0Provider from 'next-auth/providers/auth0';
import AzureProvider from 'next-auth/providers/azure-ad';
import CognitoProvider from 'next-auth/providers/cognito';
import GoogleProvider from 'next-auth/providers/google';
import { Provider, TokenEndpointHandler } from 'next-auth/providers/index';
import KeycloakProvider from 'next-auth/providers/keycloak';
import OktaProvider from 'next-auth/providers/okta';
import NextClient from './nextauth-client';

// Need to be set for all providers
export const tokenConfig: TokenEndpointHandler = {
  request: async (context) => {
    let tokens;
    logger.info(`Callback request: set client for provider: ${context.provider.id}`);

    NextClient.setClient(context.client, context.provider);

    if (context.provider.idToken) {
      tokens = await context.client.callback(context.provider.callbackUrl, context.params, context.checks);
    } else {
      tokens = await context.client.oauthCallback(context.provider.callbackUrl, context.params, context.checks);
    }
    return { tokens };
  },
};

const DEFAULT_NAME = 'SSO';

const allProviders: (Provider | boolean)[] = [
  !!process.env.AUTH_AZURE_AD_CLIENT_ID &&
    !!process.env.AUTH_AZURE_AD_SECRET &&
    !!process.env.AUTH_AZURE_AD_TENANT_ID &&
    AzureProvider({
      clientId: process.env.AUTH_AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AUTH_AZURE_AD_SECRET,
      tenantId: process.env.AUTH_AZURE_AD_TENANT_ID,
      name: process.env.AUTH_AZURE_AD_NAME ?? DEFAULT_NAME,
      authorization: {
        params: {
          scope: process.env.AUTH_AZURE_AD_SCOPE || 'openid profile user.Read email offline_access',
        },
      },
      token: tokenConfig,
    }),

  !!process.env.AUTH_GOOGLE_CLIENT_ID &&
    !!process.env.AUTH_GOOGLE_SECRET &&
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      name: process.env.AUTH_GOOGLE_NAME ?? DEFAULT_NAME,
      authorization: {
        params: {
          scope: process.env.AUTH_GOOGLE_SCOPE || 'openid email profile offline_access',
        },
      },
      token: tokenConfig,
    }),

  !!process.env.AUTH_AUTH0_CLIENT_ID &&
    !!process.env.AUTH_AUTH0_SECRET &&
    !!process.env.AUTH_AUTH0_HOST &&
    Auth0Provider({
      clientId: process.env.AUTH_AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH_AUTH0_SECRET,
      name: process.env.AUTH_AUTH0_NAME ?? DEFAULT_NAME,
      issuer: process.env.AUTH_AUTH0_HOST,
      authorization: {
        params: {
          audience: process.env.AUTH_AUTH0_AUDIENCE,
          scope: process.env.AUTH_AUTH0_SCOPE || 'openid email profile offline_access',
        },
      },
      token: tokenConfig,
    }),

  !!process.env.AUTH_KEYCLOAK_CLIENT_ID &&
    !!process.env.AUTH_KEYCLOAK_SECRET &&
    !!process.env.AUTH_KEYCLOAK_HOST &&
    KeycloakProvider({
      clientId: process.env.AUTH_KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      name: process.env.AUTH_KEYCLOAK_NAME ?? DEFAULT_NAME,
      issuer: process.env.AUTH_KEYCLOAK_REALM
        ? `${process.env.AUTH_KEYCLOAK_HOST}/realms/${process.env.AUTH_KEYCLOAK_REALM}`
        : process.env.AUTH_KEYCLOAK_HOST,

      userinfo: {
        async request(context) {
          const userinfo = await context.client.userinfo(context.tokens.access_token as string);
          return userinfo;
        },
      },
      authorization: {
        params: {
          scope: process.env.AUTH_KEYCLOAK_SCOPE || 'openid email profile offline_access',
        },
      },
      token: tokenConfig,
    }),

  !!process.env.AUTH_COGNITO_CLIENT_ID &&
    !!process.env.AUTH_COGNITO_SECRET &&
    !!process.env.AUTH_COGNITO_HOST &&
    CognitoProvider({
      clientId: process.env.AUTH_COGNITO_CLIENT_ID,
      clientSecret: process.env.AUTH_COGNITO_SECRET,
      issuer: process.env.AUTH_COGNITO_HOST,
      name: process.env.AUTH_COGNITO_NAME ?? DEFAULT_NAME,
      authorization: {
        params: {
          scope: process.env.AUTH_COGNITO_SCOPE || 'openid email profile',
        },
      },
      token: tokenConfig,
    }),

  !!process.env.AUTH_OKTA_CLIENT_SECRET &&
    !!process.env.AUTH_OKTA_CLIENT_ID &&
    !!process.env.AUTH_OKTA_ISSUER &&
    OktaProvider({
      clientId: process.env.AUTH_OKTA_CLIENT_ID,
      clientSecret: process.env.AUTH_OKTA_CLIENT_SECRET,
      issuer: process.env.AUTH_OKTA_ISSUER,
      authorization: {
        params: {
          scope: process.env.AUTH_OKTA_SCOPE || 'openid email profile',
        },
      },
      token: tokenConfig,
    }),
];

export const authProviders = allProviders.filter(Boolean) as Provider[];
