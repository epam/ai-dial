import { UNAUTHORIZED_ERROR } from '@/custom-app-ui/common/src/constants/auth';
import { ServerActionResponse } from '@/custom-app-ui/common/src/models/server-action';
import { safeDecodeJwt } from '@/custom-app-ui/common/src/utils/auth/auth-callbacks';
import { JWT } from 'next-auth/jwt';
import { sendRequest } from './api';
import { getParsedError } from './error';
import { logger } from './logger';

function logAccessDeniedError(token?: JWT | null): void {
  const parsedJwt = token?.access_token ? safeDecodeJwt(token.access_token as string) : {};
  if ('exp' in parsedJwt) {
    logger.error(
      `Received 401 error, JWT token: ${parsedJwt.exp} (${new Date(Number(parsedJwt.exp) * 1000).toISOString()}), iss at ${parsedJwt.iat} (${new Date(Number(parsedJwt.iat) * 1000).toISOString()}) for ${parsedJwt.name}`,
    );
  } else {
    logger.error('Received 401 error, JWT is empty or invalid', token?.access_token);
  }
}

export interface BaseApiConfig {
  host?: string;
}
/**
 * Builds a URL using Node's URL API, handling edge cases with slashes
 * @param base The base URL (e.g. http://example.com)
 * @param path The path to append to the base URL
 * @returns A properly formatted URL
 */
export function buildUrl(base: string | undefined, path: string): string {
  if (!base) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  try {
    const url = new URL(path, base);
    return url.toString();
  } catch (e) {
    logger.error('Failed to build URL', e);
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    return `${normalizedBase}${normalizedPath}`;
  }
}

export class BaseApi {
  protected config: BaseApiConfig;

  constructor(config: BaseApiConfig) {
    this.config = config;
  }

  protected async deleteAction<R = unknown>(url: string, token?: JWT | null): Promise<ServerActionResponse<R>> {
    return this.sendActionRequest<undefined, R>(url, 'DELETE', void 0, token);
  }

  protected async putAction<T extends object, R = unknown>(
    url: string,
    dto: T,
    token?: JWT | null,
    initHeaders?: HeadersInit,
    isFile?: boolean,
  ): Promise<ServerActionResponse<R>> {
    return this.sendActionRequest<T, R>(url, 'PUT', dto, token, initHeaders, isFile);
  }

  protected async postAction<T extends object, R = unknown>(
    url: string,
    dto: T,
    token?: JWT | null,
    initHeaders?: HeadersInit,
  ): Promise<ServerActionResponse<R>> {
    return this.sendActionRequest<T, R>(url, 'POST', dto, token, initHeaders);
  }

  protected get<R extends object>(url: string, token?: JWT | null): Promise<R | null> {
    return this.sendRequest<object, R>(url, 'GET', void 0, token, void 0);
  }

  protected getAction<R = unknown>(url: string, token?: JWT | null): Promise<ServerActionResponse<R>> {
    return this.sendActionRequest<undefined, R>(url, 'GET', void 0, token, void 0);
  }

  private async sendActionRequest<T extends object | undefined, R = unknown>(
    path: string,
    type: string,
    dto?: T,
    token?: JWT | null,
    initHeaders?: HeadersInit,
    isFile?: boolean,
  ): Promise<ServerActionResponse<R>> {
    const url = buildUrl(this.config.host, path);
    return sendRequest(url, type, dto, initHeaders, token, isFile).then((res) => this.handleResponse<R>(res, type));
  }

  private async sendRequest<T extends object, R = unknown>(
    path: string,
    type: string,
    dto?: T,
    token?: JWT | null,
    initHeaders?: HeadersInit,
    isFile?: boolean,
  ): Promise<R | null> {
    const url = buildUrl(this.config.host, path);
    const res = await sendRequest(url, type, dto, initHeaders, token, isFile);
    if (isFailedRequest(res)) {
      logger.error({ url: res.url, status: res.status, dto }, 'Request error Url');

      if (res.status === UNAUTHORIZED_ERROR) {
        logAccessDeniedError(token);
      }

      return res.text().then((error) => {
        logger.error(error, 'Request error');
        return null;
      });
    }
    return await getResponse<R>(type, res);
  }

  private handleError<T>(res: Response): Promise<ServerActionResponse<T>> {
    logger.error(
      {
        status: res.status,
        statusText: res.statusText,
        url: res.url,
      },
      `Request error`,
    );

    return res.text().then((error) => {
      const errObject = getParsedError(error);

      logger.error({ err: errObject }, 'Request error object');

      return {
        success: false,
        statusCode: res.status,
        errorMessage: errObject.message ?? res.statusText,
        errorHeader: errObject.error,
      };
    });
  }

  private handleResponse<T>(res: Response, type: string): Promise<ServerActionResponse<T>> {
    if (isFailedRequest(res)) {
      return this.handleError(res);
    }

    return getResponse<T>(type, res).then((r) => {
      return { success: true, response: r };
    });
  }
}

const isFailedRequest = (res: Response) => {
  return !(res.status >= 200 && res.status < 300);
};

const getResponse = <T>(type: string, res: Response) => {
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('text/plain')) {
    return res.text() as Promise<T>;
  }

  if (contentType && contentType.includes('application/octet-stream')) {
    return res.blob() as Promise<T>;
  }

  return (type === 'DELETE' ? res.text() : res.json().catch(() => res.text().catch(() => ''))) as Promise<T>;
};
