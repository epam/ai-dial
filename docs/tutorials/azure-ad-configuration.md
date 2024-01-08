# How to Enable Authentication with Azure AD

To enable authentication with Azure AD, you can use Chat environment variables. 

> Refer to [Chat](https://github.com/epam/ai-dial-chat?tab=readme-ov-file#environment-variables) to view the complete list of environment variables.

1. Register your application via the Microsoft Azure Portal. Refer to [Microsoft Documentation](https://learn.microsoft.com/en-us/azure/healthcare-apis/register-application) to learn how to register a new application.
2. Define environment variables for AI DIAL Chat using your application's values from the Azure Portal:

| Variable                  | Required             | Description                                                         | Available Values | Default values |
| ------------------------- | -------------------- | ------------------------------------------------------------------- | ---------------- | -------------- |
| `AUTH_AZURE_AD_CLIENT_ID` | Yes                   | A unique identifier for the client application registered in Azure Active Directory (AD). It is used to authenticate the client application when accessing Azure AD resources.                                                  | Any string       |                |
| `AUTH_AZURE_AD_NAME`      | No                   | A name of the Azure AD tenant. It is used to specify the specific Azure AD instance to authenticate against.                                                       | Any string       |                |
| `AUTH_AZURE_AD_SECRET`    | Yes                   | Also known as the client secret or application secret, this parameter is a confidential string that authenticates and authorizes the client application to access Azure AD resources. It serves as a password for the client application.

                                                     | Any string       |                |
| `AUTH_AZURE_AD_TENANT_ID` | Yes                   | Tenant ID refers to a globally unique identifier (GUID) that represents a specific Azure AD tenant. It is used to identify and authenticate the Azure AD tenant that the client application belongs to.                                                  | Any string       |                |
| `AUTH_AZURE_AD_SCOPE`     | No                   | This parameter specifies the level of access and permissions that the client application requests when making a request to Azure AD resources. It defines the resources and actions that the application can access on behalf of a user or itself.                                                      | Any string       | `openid profile user.Read email offline_access` |

3. Launch AI DIAL Chat. Refer to [Deployment](https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple) to learn how to launch AI DIAL.
