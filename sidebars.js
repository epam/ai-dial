/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  CustomSideBar: [
    {
      type: 'doc',
      id: 'README', // document ID
      label: 'Home', // sidebar label
    },
    {
      type: 'category',
      label: 'Understand DIAL',
      items: [
        {
          type: 'doc',
          id: 'platform/architecture-and-concepts/vision',
          label: 'What is DIAL',
        },
        {
          type: 'category',
          label: 'Architecture',
          items: [

            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/architecture',
              label: 'Architecture Highlights',
            },            
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/stack',
              label: 'DIAL Stack',
            },
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/app-server',
              label: 'Application Server',
            },
            {
              type: 'doc',
              id: 'platform/core/auth-intro',
              label: 'Unified API Overview',
            },
          ],
        },
        {
          type: 'category',
          label: 'Capabilities',
          items: [
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/agentic-platform',
              label: 'Agentic Platform',
            },
            {
              type: 'doc',
              id: 'platform/multimodality',
              label: 'Multimodality',
            },
            {
              type: 'doc',
              id: 'platform/collaboration-intro',
              label: 'Collaboration',
            },
          ],
        },
        {
          type: 'category',
          label: 'Security and governance',
          items: [
            {
              type: 'doc',
              id: 'platform/core/auth-intro',
              label: 'Authentication',
            },
            {
              type: 'doc',
              id: 'platform/core/privacy',
              label: 'Privacy',
            },
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/access-control',
              label: 'Access Control Overview',
            },
            {
              type: 'doc',
              id: 'platform/core/token-limits-and-cost-control',
              label: 'Usage Limits and Cost Control',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Building with DIAL',
      items: [
        {
          type: 'category',
          label: 'Apps',
          items: [
            {
              type: 'doc',
              id: 'platform/core/apps',
              label: 'DIAL Apps overview',
            },
            {
              type: 'category',
              label: 'Custom Apps',
              items: [
                {
                  type: 'doc',
                  id: 'platform/core/apps',
                  label: 'Architecture and lifecycle',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/apps-development/custom-buttons',
                  label: 'Custom buttons in apps',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/apps-development/enable-app',
                  label: 'Registering apps in DIAL Core',
                },
                {
                  type: 'category',
                  label: 'Examples',
                  items: [
                    'tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_text_applications',
                    'tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_image_applications',
                    'tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_image_to_text_applications',
                    'tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_gpt_image_1_with_configuration',
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Quick Apps',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/developers/apps-development/quick-app-configuration',
                  label: 'Quick Apps',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Extension points',
          items: [
            {
              type: 'doc',
              id: 'platform/core/interceptors',
              label: 'Interceptors',
            },
            {
              type: 'category',
              label: 'Adapters',
              items: [
                {
                  type: 'doc',
                  id: 'platform/architecture-and-concepts/architecture',
                  label: 'What are Adapters',
                },
                {
                  type: 'doc',
                  id: 'platform/supported-models',
                  label: 'Supported adapters',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Developer tools',
          items: [
            {
              type: 'category',
              label: 'Chat customization',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/developers/chat/chat-objects',
                  label: 'Custom content in chat',
                },
                {
                  type: 'doc',
                  id: 'platform/chat/data-visualization-intro',
                  label: 'Data visualization',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/chat/create-custom-visualizer',
                  label: 'Create custom visualizer',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/chat/localization',
                  label: 'Chat localization',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/chat/chat-design',
                  label: 'Theming and design',
                },
                {
                  type: 'doc',
                  id: 'platform/chat/marketplace',
                  label: 'Marketplace',
                },
              ],
            },
            {
              type: 'category',
              label: 'Integrations',
              items: [
                {
                  type: 'category',
                  label: 'Chatbot integrations',
                  items: [
                    {
                      type: 'doc',
                      id: 'tutorials/developers/integrations/msteams-bot',
                      label: 'Integration with MS Teams',
                    },
                    {
                      type: 'doc',
                      id: 'tutorials/developers/integrations/copilot-to-dial',
                      label: 'Integration with MS Copilot',
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Productivity add-ins',
                  items: [
                    {
                      type: 'doc',
                      id: 'tutorials/developers/integrations/ms-excel-addin',
                      label: 'Integration with MS Excel',
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Workflow automation',
                  items: [
                    {
                      type: 'doc',
                      id: 'tutorials/developers/integrations/n8n-integration',
                      label: 'Integration with n8n',
                    },
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Platform APIs and resources',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/developers/work-with-resources/work-with-publications',
                  label: 'Publications API',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/work-with-resources/sharing',
                  label: 'Sharing API',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/work-with-resources/notifications',
                  label: 'Notifications',
                },
                {
                  type: 'doc',
                  id: 'platform/core/per-request-keys',
                  label: 'Per-request keys',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/apps-development/auth-matrix',
                  label: 'Auth matrix for apps',
                },
              ],
            },
            {
              type: 'category',
              label: 'Advanced topics',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/developers/prompt-caching',
                  label: 'Prompt caching',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Operating DIAL',
      items: [
        {
          type: 'category',
          label: 'Local setup',
          items: [
            {
              type: 'doc',
              id: 'tutorials/developers/local-run/quick-start-model',
              label: 'Docker Compose with Azure model',
            },
            {
              type: 'doc',
              id: 'tutorials/developers/local-run/quick-start-with-self-hosted-model-ollama',
              label: 'Docker Compose with Ollama',
            },
            {
              type: 'doc',
              id: 'tutorials/developers/local-run/quick-start-with-self-hosted-model-vllm',
              label: 'Docker Compose with vLLM',
            },
            {
              type: 'doc',
              id: 'tutorials/developers/local-run/quick-start-with-application',
              label: 'Docker Compose with application',
            },
            {
              type: 'doc',
              id: 'tutorials/developers/apps-development/adapter-dial',
              label: 'DIAL-to-DIAL Adapter for local dev',
            },
          ],
        },
        {
          type: 'category',
          label: 'Cloud deployment',
          items: [
            {
              type: 'doc',
              id: 'tutorials/devops/deployment/aws-deployment-guide',
              label: 'AWS deployment',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/deployment/azure-deployment-guide',
              label: 'Azure deployment',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/deployment/gcp-deployment-guide',
              label: 'GCP deployment',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/deployment/azure-secrets',
              label: 'Azure Secrets deployment',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/deployment/custom_apps_deployment',
              label: 'Custom Apps deployment',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/deployment/quick_apps_deployment',
              label: 'Quick Apps installation',
            },
          ],
        },
        {
          type: 'category',
          label: 'Model deployment',
          items: [
            {
              type: 'doc',
              id: 'tutorials/devops/deployment/deployment-of-models/bedrock-model-deployment',
              label: 'Bedrock model deployment',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/deployment/deployment-of-models/openai-model-deployment',
              label: 'OpenAI model deployment',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/deployment/deployment-of-models/vertex-model-deployment',
              label: 'Vertex model deployment',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/use-databricks-model',
              label: 'Databricks model deployment',
            },
          ],
        },
        {
          type: 'category',
          label: 'Configuration reference',
          items: [
            {
              type: 'doc',
              id: 'tutorials/devops/configuration/configuration-guide',
              label: 'Configuration',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/configuration/realtime-analytics-config',
              label: 'Realtime analytics config',
            },
            {
              type: 'doc',
              id: 'platform/core/load-balancer',
              label: 'Load balancer',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/configuration/enable-publications-chat',
              label: 'Enable publications',
            },
          ],
        },
        {
          type: 'category',
          label: 'Auth and Access Control',
          items: [
            {
              type: 'doc',
              id: 'tutorials/devops/auth-and-access-control/api-keys',
              label: 'API keys',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/auth-and-access-control/jwt',
              label: 'JWT configuration',
            },
            {
              type: 'doc',
              id: 'platform/core/token-limits-and-cost-control',
              label: 'Roles and rate limits',
            },
            {
              type: 'category',
              label: 'SSO/IDP setup',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/configure-idps/overview',
                  label: 'Overview',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/configure-idps/auth0',
                  label: 'Auth0',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/configure-idps/cognito',
                  label: 'AWS Cognito',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/configure-idps/azureb2c',
                  label: 'Azure AD B2C',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/configure-idps/entraID',
                  label: 'Microsoft Entra ID',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/configure-idps/google',
                  label: 'Google Identity',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/configure-idps/keycloak',
                  label: 'Keycloak',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/configure-idps/okta',
                  label: 'Okta',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Observability',
          items: [
            {
              type: 'doc',
              id: 'tutorials/devops/observability-config',
              label: 'Overview',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/configuration/realtime-analytics-config',
              label: 'Analytics Realtime',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Administering DIAL',
      items: [
        {
          type: 'doc',
          id: 'platform/admin-panel',
          label: 'Admin Panel Overview',
        },
        {
          type: 'category',
          label: 'Admin Panel User Guide',
          items: [
            {
              type: 'doc',
              id: 'tutorials/admin/introduction',
              label: 'Introduction',
            },
            {
              type: 'doc',
              id: 'tutorials/admin/home',
              label: 'Home',
            },
            {
              type: 'category',
              label: 'Entities',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/admin/entities-models',
                  label: 'Models',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/entities-applications',
                  label: 'Applications',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/entities-toolsets',
                  label: 'Toolsets',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/entities-interceptors',
                  label: 'Interceptors',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/entities-routes',
                  label: 'Routes',
                },
              ],
            },
            {
              type: 'category',
              label: 'Builders',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/admin/builders-application-runners',
                  label: 'Application Runners',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/builders-interceptor-templates',
                  label: 'Interceptor Templates',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/builders-adapters',
                  label: 'Adapters',
                },
              ],
            },
            {
              type: 'category',
              label: 'Assets',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/admin/assets-applications',
                  label: 'Applications',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/assets-toolsets',
                  label: 'Toolsets',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/assets-prompts',
                  label: 'Prompts',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/assets-files',
                  label: 'Files',
                },
              ],
            },
            {
              type: 'category',
              label: 'Deployments',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/admin/deployments-models',
                  label: 'Model Servings',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/deployments-mcp',
                  label: 'MCP Containers',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/deployments-interceptors',
                  label: 'Interceptor Containers',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/deployments-adapters',
                  label: 'Adapter Containers',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/deployments-images',
                  label: 'Images',
                },
              ],
            },
            {
              type: 'category',
              label: 'Access Management',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/admin/access-management-roles',
                  label: 'Roles',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/access-management-keys',
                  label: 'Keys',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/access-management-folders-storage',
                  label: 'Folders Storage',
                },
              ],
            },
            {
              type: 'category',
              label: 'Approvals',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/admin/approvals-application-publications',
                  label: 'Application Publications',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/approvals-toolset-publications',
                  label: 'Toolset Publications',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/approvals-prompt-publications',
                  label: 'Prompt Publications',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/approvals-file-publications',
                  label: 'File Publications',
                },
              ],
            },
            {
              type: 'category',
              label: 'Audit',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/admin/telemetry-dashboard',
                  label: 'Dashboard',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/telemetry-activity-audit',
                  label: 'Activities',
                },
                {
                  type: 'doc',
                  id: 'tutorials/admin/telemetry-usage-log',
                  label: 'Usage Log',
                },
              ],
            },
          ],
        },
        {
          type: 'doc',
          id: 'legal-and-compliance',
          label: 'Compliance and legal FAQ',
        },
      ],
    },
    {
      type: 'doc',
      id: 'tutorials/user-guide',
      label: 'Chat User Guide',
    },
    {
      type: 'category',
      label: 'Demos',
      items: [
        {
          type: 'category',
          label: 'Platform Overview',
          items: [
            {
              type: 'doc',
              id: 'video demos/dial-product-overview',
              label: 'DIAL Overview',
            },
            {
              type: 'doc',
              id: 'video demos/Developers/dial-unified-api',
              label: 'Unified API',
            },
            {
              type: 'doc',
              id: 'video demos/Developers/interceptors',
              label: 'Interceptors',
            },
          ],
        },
        {
          type: 'category',
          label: 'Chat Capabilities',
          items: [
            {
              type: 'autogenerated',
              dirName: 'video demos/1.Chat',
            },
          ],
        },
        {
          type: 'category',
          label: 'Apps and Agents',
          items: [
            {
              type: 'autogenerated',
              dirName: 'video demos/2.Applications',
            },
            {
              type: 'autogenerated',
              dirName: 'video demos/3.Developers/Applications',
            },
          ],
        },
        {
          type: 'category',
          label: 'Deployment and Admin',
          items: [
            {
              type: 'doc',
              id: 'video demos/dial-admin-panel',
              label: 'DIAL Admin Panel',
            },
            {
              type: 'doc',
              id: 'video demos/Developers/dial-roles-and-rate-limits',
              label: 'Roles and Rate Limits',
            },
            {
              type: 'autogenerated',
              dirName: 'video demos/3.Developers/Deployment',
            },
            {
              type: 'autogenerated',
              dirName: 'video demos/3.Developers/Integrations',
            },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
