import { BaseApi, BaseApiConfig } from '@/custom-app-ui/common/src/server/base-api';
import { ServerActionResponse } from '@/custom-app-ui/common/src/models/server-action';
import { Config } from '@/custom-app-ui/common/src/models/config';
import { JWT } from 'next-auth/jwt';

export class ApplicationApi extends BaseApi {
    private applicationUrl: string;

    constructor(options: BaseApiConfig) {
      super(options);
      this.applicationUrl = `/v1/`;
    }

    async getApplication(applicationId: string | null, token: JWT | null): Promise<ServerActionResponse<Config>> {
      if (!applicationId) {
        throw Error("Application identifier is null");
      }

      const applicationResponse = await this.getAction<any>(this.applicationUrl + applicationId, token);
      return {
        success: applicationResponse.success,
        errorHeader: applicationResponse.errorHeader,
        errorMessage: applicationResponse.errorMessage,
        statusCode: applicationResponse.statusCode,
        response: {
          count: applicationResponse.response?.application_properties?.count || 1
        }
      };
    }

    async updateApplication(config: Config, applicationId: string | null, token: JWT | null): Promise<ServerActionResponse> {
      if (!applicationId) {
        throw Error("Application identifier is null");
      }

      const application = await this.getAction<any>(this.applicationUrl + applicationId, token);

      var result = await this.putAction(this.applicationUrl + applicationId,
        {
            ...application.response,
            application_properties: { count: config.count }
        }, token);

      return result;
    }
}
