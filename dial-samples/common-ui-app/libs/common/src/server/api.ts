import { JWT } from 'next-auth/jwt';
import { logger } from './logger';

export const V1 = 'v1';
export const API = `api/${V1}`;

const CACHE: RequestInit = { cache: 'no-store' };
export const CONTENT_TYPE = { 'Content-Type': 'application/json' };

export const sendRequest = async <T extends object>(
  url: string,
  type: string,
  dto?: T,
  initHeaders?: HeadersInit,
  token?: JWT | null,
  isFile?: boolean,
): Promise<Response> => {
  const headers = getHeaders(type, initHeaders, isFile);

  try {
    return fetch(url, {
      body: isFile ? dto : (JSON.stringify(dto) as any),
      method: type,
      ...CACHE,
      headers: {
        ...getApiHeaders({ jwt: token?.access_token }, isFile),
        ...headers,
      },
    });
  } catch (e) {
    logger.error(e, 'Error');
    return new Promise(() => null);
  }
};

const getHeaders = (type: string, initHeaders?: HeadersInit, isFile?: boolean): HeadersInit => {
  if (type === 'GET' || isFile) {
    return initHeaders || {};
  }
  return {
    ...initHeaders,
    ...CONTENT_TYPE,
  };
};

const getApiHeaders = ({ jwt }: { jwt?: string | unknown }, isFile?: boolean): Record<string, string> => {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (!isFile) {
    headers['Content-Type'] = 'application/json';
  }

  if (jwt) {
    headers['authorization'] = 'Bearer ' + jwt;
  }

  return headers;
};
