/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  CustomSideBar: [
    {
      type: 'doc',
      id: 'README', // document ID
      label: 'Home', // sidebar label
    },
    {
      type: 'doc',
      id: 'quick-start',
      label: 'Quick Start',
    },
    {
      type: 'category',
      label: 'Platform',
      items: [
        {
          type: 'category',
          label: 'Architecture & Concepts',
          items: [
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/vision',
              label: 'What is DIAL',
            },
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/concepts',
              label: 'Main Concepts',
            },
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/architecture',
              label: 'Architecture Highlights',
            },
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/components',
              label: 'Platform Components',
            },
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/agentic-platform',
              label: 'Agentic Platform',
            },
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/app-server',
              label: 'Application Server',
            },
            {
              type: 'doc',
              id: 'platform/architecture-and-concepts/stack',
              label: 'DIAL Stack',
            },
          ],
        },
        {
          type: 'doc',
          id: 'platform/deployment-intro',
          label: 'Deployment',
        },
        {
          type: 'doc',
          id: 'platform/supported-models',
          label: 'AI Model Providers',
        },
        {
          type: 'category',
          label: 'Core',
          items: [
            {
              type: 'doc',
              id: 'platform/core/about-core',
              label: 'About',
            },
            {
              type: 'doc',
              id: 'platform/core/auth-intro',
              label: 'Authentication',
            },
            {
              type: 'doc',
              id: 'platform/core/access-control-intro',
              label: 'Access & Cost Control',
            },
            {
              type: 'doc',
              id: 'platform/core/per-request-keys',
              label: 'Per-Request Keys',
            },
            {
              type: 'doc',
              id: 'platform/core/privacy',
              label: 'PII Compliance & Privacy',
            },
            {
              type: 'doc',
              id: 'platform/core/load-balancer',
              label: 'Load Balancer',
            },
            {
              type: 'doc',
              id: 'platform/core/interceptors',
              label: 'Interceptors',
            },
            {
              type: 'doc',
              id: 'platform/core/apps',
              label: 'DIAL-Native Apps',
            },
          ],
        },
        {
          type: 'category',
          label: 'Chat',
          items: [
            {
              type: 'doc',
              id: 'platform/chat/about-chat',
              label: 'About',
            },
            {
              type: 'doc',
              id: 'platform/chat/marketplace',
              label: 'Marketplace',
            },
            {
              type: 'doc',
              id: 'platform/chat/data-visualization-intro',
              label: 'Data Visualization',
            },
          ],
        },
        {
          type: 'doc',
          id: 'platform/admin-panel',
          label: 'Admin Panel',
        },
        {
          type: 'doc',
          id: 'platform/multimodality',
          label: 'Multimodality',
        },
        {
          type: 'doc',
          id: 'platform/realtime-analytics-intro',
          label: 'Analytics',
        },
        {
          type: 'doc',
          id: 'platform/collaboration-intro',
          label: 'Collaboration',
        },
        {
          type: 'doc',
          id: 'platform/observability-intro',
          label: 'Observability',
        },
        {
          type: 'doc',
          id: 'platform/high-load-performance',
          label: 'Handling High Loads',
        },
        {
          type: 'doc',
          id: 'legal-and-compliance',
          label: 'Compliance and Legal Q&A',
        },
        {
          type: 'doc',
          id: 'platform/history',
          label: 'DIAL Evolution',
        },
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        {
          type: 'doc',
          id: 'tutorials/user-guide',
          label: 'Chat User Guide',
        },
        {
          type: 'category',
          label: 'Developers',
          items: [
            {
              type: 'category',
              label: 'Run DIAL Locally',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/developers/local-run/quick-start-with-application',
                  label: 'Chat with Application',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/local-run/quick-start-model',
                  label: 'Chat with OpenAI Model',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/local-run/quick-start-with-self-hosted-model',
                  label: 'Chat with a Self-Hosted Model',
                },
              ],
            },
            {
              type: 'category',
              label: 'Working with Resources',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/developers/work-with-resources/work-with-publications',
                  label: 'Publications',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/work-with-resources/sharing',
                  label: 'Sharing',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/work-with-resources/notifications',
                  label: 'Notifications',
                },
              ],
            },
            {
              type: 'category',
              label: 'Chat',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/developers/chat/chat-objects',
                  label: 'Custom Content in Chat',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/chat/localization',
                  label: 'Chat Localization',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/chat/create-custom-visualizer',
                  label: 'Create Visualizer',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/chat/chat-design',
                  label: 'Design Structure',
                },
              ],
            },
            {
              type: 'category',
              label: 'Apps Development',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/developers/apps-development/adapter-dial',
                  label: 'Local Development',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/apps-development/enable-app',
                  label: 'Enable Apps',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/apps-development/quick-app-configuration',
                  label: 'How to Configure Quick App',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/apps-development/custom-buttons',
                  label: 'Custom Buttons in Apps',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/apps-development/auth-matrix',
                  label: 'Auth Matrix',
                },
                {
                  type: 'category',
                  label: 'Examples',
                  items: [
                    'tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_text_applications',
                    'tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_image_applications',
                    'tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_image_to_text_applications',
                    'tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_dalle_3_with_configuration',
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Examples of Integrations',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/developers/integrations/copilot-to-dial',
                  label: 'Integration with MS Copilot',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/integrations/ms-excel-addin',
                  label: 'Integration with MS Excel',
                },
                {
                  type: 'doc',
                  id: 'tutorials/developers/integrations/vscode-extension',
                  label: 'Integration with Continue',
                },
              ],
            },
            {
              type: 'doc',
              id: 'tutorials/developers/prompt-caching',
              label: 'Prompt Caching',
            },
          ],
        },
        {
          type: 'category',
          label: 'DevOps',
          items: [
            {
              type: 'category',
              label: 'Deployment',
              items: [
                {
                  type: 'link',
                  label: 'Helm Deployment',
                  href: 'https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/deployment/custom_apps_deployment',
                  label: 'Custom Apps Deployment',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/deployment/quick_apps_deployment',
                  label: 'Quick Apps Installation',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/deployment/azure-secrets',
                  label: 'Azure Secrets Deployment',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/deployment/azure-deployment-guide',
                  label: 'Azure Deployment Guide',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/deployment/gcp-deployment-guide',
                  label: 'GCP Deployment Guide',
                },
                {
                  type: 'category',
                  label: 'Deployment of Models',
                  items: [
                    {
                      type: 'doc',
                      id: 'tutorials/devops/deployment/deployment-of-models/openai-model-deployment',
                      label: 'OpenAI Model Deployment',
                    },
                    {
                      type: 'doc',
                      id: 'tutorials/devops/deployment/deployment-of-models/vertex-model-deployment',
                      label: 'Vertex Model Deployment',
                    },
                    {
                      type: 'doc',
                      id: 'tutorials/devops/deployment/deployment-of-models/bedrock-model-deployment',
                      label: 'Bedrock Model Deployment',
                    },
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Configuration',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/devops/configuration/configuration-guide',
                  label: 'Configuration Guide',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/configuration/realtime-analytics-config',
                  label: 'Analytics Realtime Configuration',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/configuration/enable-publications-chat',
                  label: 'Enable Publications',
                },
              ],
            },
            {
              type: 'category',
              label: 'Auth & Access Control',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/programmatic-auth',
                  label: 'Create API Keys',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/api-key-roles',
                  label: 'API Keys Roles & Limits',
                },
                {
                  type: 'doc',
                  id: 'tutorials/devops/auth-and-access-control/chat-users-roles',
                  label: 'JWT Roles & Limits',
                },
                {
                  type: 'category',
                  label: 'Configure IDPs',
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
                      id: 'tutorials/devops/auth-and-access-control/configure-idps/entraID',
                      label: 'Microsoft Entra',
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
              type: 'doc',
              id: 'tutorials/devops/observability-config',
              label: 'Observability',
            },
            {
              type: 'doc',
              id: 'tutorials/devops/use-databricks-model',
              label: 'Use Databricks Models',
            },
          ],
        },
        {
          type: 'category',
          label: 'Admins',
          items: [
            {
              type: 'category',
              label: 'Admin Panel User Guide',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/admin/home',
                  label: 'Introduction',
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
                      id: 'tutorials/admin/entities-routes',
                      label: 'Routes',
                    },
                  ]
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
                      id: 'tutorials/admin/builders-interceptors',
                      label: 'Interceptors',
                    },
                  ]
                },
                {
                  type: 'category',
                  label: 'Assets',
                  items: [
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
                  ]
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
                  ]
                },
                {
                  type: 'category',
                  label: 'Approvals',
                  items: [
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
                  ]
                },
                {
                  type: 'category',
                  label: 'Telemetry',
                  items: [
                    {
                      type: 'doc',
                      id: 'tutorials/admin/telemetry-dashboard',
                      label: 'Dashboard',
                    },
                    {
                      type: 'doc',
                      id: 'tutorials/admin/telemetry-activity-audit',
                      label: 'Activity Audit',
                    },
                  ]
                }
              ],
            }
          ]
        }
      ],
    },
    {
      type: 'link',
      label: 'API Reference',
      href: 'https://dialx.ai/dial_api',
    },
    {
      type: 'category',
      label: 'Demos',
      items: [
        {
          type: 'autogenerated',
          dirName: 'video demos',
        },
      ],
    },
  ],
};

export default sidebars;
