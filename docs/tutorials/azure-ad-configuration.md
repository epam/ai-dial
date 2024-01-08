# How to Enable Authentication with Azure AD

To enable authentication with Azure AD, you can use Chat environment variables. 
1. Register your application via the Microsoft Azure Portal. Refer to [Microsoft Documentation](https://learn.microsoft.com/en-us/azure/healthcare-apis/register-application) to learn how to register a new application.
2. Define environment variables for AI DIAL Chat: `AUTH_AZURE_AD_CLIENT_ID`, `AUTH_AZURE_AD_NAME`, `AUTH_AZURE_AD_SECRET`, `AUTH_AZURE_AD_TENANT_ID`, `AUTH_AZURE_AD_SCOPE`.

  > Refer to [Chat](https://github.com/epam/ai-dial-chat?tab=readme-ov-file#environment-variables) to view the complete list of environment variables.

3. Launch AI DIAL Chat. Refer to [Deployment](https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple) to learn how to launch AI DIAL.
