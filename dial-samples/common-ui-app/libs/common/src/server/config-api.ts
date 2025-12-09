import { BaseApi, BaseApiConfig } from '@/custom-app-ui/common/src/server/base-api';
import { Config } from '@/custom-app-ui/common/src/models/config';
import { ServerActionResponse } from '@/custom-app-ui/common/src/models/server-action';
import { V1 } from '@/custom-app-ui/common/src/server/api';
import { JWT } from 'next-auth/jwt';

export class ConfigApi extends BaseApi {
  private configUrl: string;

  constructor(options: BaseApiConfig) {
    super(options);
    this.configUrl = `api/${V1}/config`;
  }

  getConfig(token: JWT | null): Promise<ServerActionResponse<Config>> {
    return this.getAction(this.configUrl, token);
  }

  setConfig(config: Config, token: JWT | null): Promise<ServerActionResponse> {
    return this.putAction(this.configUrl, { ...config }, token);
  }
}
