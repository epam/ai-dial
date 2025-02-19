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
          type: 'doc',
          id: 'architecture',
          label: 'Architecture',
        },
        {
          type: 'doc',
          id: 'deployment-intro',
          label: 'Deployment',
        },
        {
          type: 'doc',
          id: 'supported-models',
          label: 'AI Model Providers',
        },
        {
          type: 'category',
          label: 'Core',
          items: [
            {
              type: 'doc',
              id: 'about-core',
              label: 'About',
            },
            {
              type: 'doc',
              id: 'Auth/intro',
              label: 'Authentication',
            },
            {
              type: 'doc',
              id: 'Roles and Access Control/intro',
              label: 'Roles and Access Control',
            },
            {
              type: 'doc',
              id: 'Roles and Access Control/Per Request Keys',
              label: 'Per Request Keys',
            },
            {
              type: 'doc',
              id: 'privacy',
              label: 'PII Compliance & Privacy',
            },
            {
              type: 'doc',
              id: 'tutorials/load-balancer',
              label: 'Load Balancer',
            },
            {
              type: 'doc',
              id: 'tutorials/interceptors',
              label: 'Interceptors',
            },
          ],
        },
        {
          type: 'category',
          label: 'Chat',
          items: [
            {
              type: 'doc',
              id: 'about-chat',
              label: 'About',
            },
            {
              type: 'doc',
              id: 'marketplace',
              label: 'Marketplace',
            },
            {
              type: 'doc',
              id: 'chat-design',
              label: 'Design Structure',
            },
            {
              type: 'doc',
              id: 'tutorials/data-visualization-intro',
              label: 'Data Visualization',
            },
          ],
        },
        {
          type: 'doc',
          id: 'tutorials/multimodality',
          label: 'Multimodality',
        },
        {
          type: 'doc',
          id: 'tutorials/realtime-analytics-intro',
          label: 'Analytics',
        },
        {
          type: 'doc',
          id: 'tutorials/collaboration/intro',
          label: 'Collaboration',
        },
        {
          type: 'doc',
          id: 'Observability/Observability-intro',
          label: 'Observability',
        },
        {
          type: 'doc',
          id: 'tutorials/high-load-performance',
          label: 'Handling High Loads',
        },
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        {
          type: 'doc',
          id: 'user-guide',
          label: 'Chat User Guide',
        },
        {
          type: 'category',
          label: 'Developers',
          items: [
            {
              type: 'category',
              label: 'Launching Chat',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/quick-start-with-application',
                  label: 'Chat with Application',
                },
                {
                  type: 'doc',
                  id: 'tutorials/quick-start-model',
                  label: 'Chat with OpenAI Model',
                },
                {
                  type: 'doc',
                  id: 'tutorials/quick-start-with-self-hosted-model',
                  label: 'Chat with a Self-Hosted Model',
                },
                {
                  type: 'doc',
                  id: 'tutorials/quick-start-with-addon',
                  label: 'Chat with Addon',
                },
              ],
            },
            {
              type: 'category',
              label: 'Working with Resources',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/collaboration/work-with-publications',
                  label: 'Publications',
                },
                {
                  type: 'doc',
                  id: 'tutorials/collaboration/sharing',
                  label: 'Sharing',
                },
                {
                  type: 'doc',
                  id: 'tutorials/collaboration/notifications',
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
                  id: 'tutorials/chat-objects',
                  label: 'Custom Content in Chat',
                },
                {
                  type: 'doc',
                  id: 'tutorials/localization',
                  label: 'Chat Localization',
                },
                {
                  type: 'doc',
                  id: 'tutorials/create-custom-visualizer',
                  label: 'Create Visualizer',
                },
              ],
            },
            {
              type: 'category',
              label: 'Apps Development',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/adapter-dial',
                  label: 'Local Development',
                },
                {
                  type: 'doc',
                  id: 'tutorials/custom-buttons',
                  label: 'Custom Buttons in Apps',
                },
                {
                  type: 'category',
                  label: 'Cookbook',
                  items: [
                    'Cookbook/dial-cookbook/examples/how_to_call_text_to_text_applications',
                    'Cookbook/dial-cookbook/examples/how_to_call_text_to_image_applications',
                    'Cookbook/dial-cookbook/examples/how_to_call_image_to_text_applications',
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Integrations',
              items: [
                {
                  type: 'doc',
                  id: 'tutorials/copilot-to-dial',
                  label: 'Integration with MS Copilot',
                },
              ],
            },
            {
              type: 'link',
              label: 'API Reference',
              href: 'https://epam-rail.com/dial_api',
            },
          ],
        },
        {
          type: 'category',
          label: 'DevOps',
          items: [
            {
              type: 'category',
              label: 'Configuration',
              items: [
                {
                  type: 'doc',
                  id: 'Deployment/configuration',
                  label: 'Configuration Guide',
                },
                {
                  type: 'doc',
                  id: 'tutorials/realtime-analytics-config',
                  label: 'Analytics Realtime Configuration',
                },
                {
                  type: 'doc',
                  id: 'tutorials/collaboration/enable-publications-chat',
                  label: 'Enable Publications',
                },
              ],
            },
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
                  id: 'Deployment/custom_apps_deployment',
                  label: 'Custom Apps Deployment',
                },
                {
                  type: 'doc',
                  id: 'Deployment/azure-secrets',
                  label: 'Azure Secrets Deployment',
                },
                {
                  type: 'category',
                  label: 'Deployment of Models',
                  items: [
                    'Deployment/OpenAI Model Deployment',
                    'Deployment/Vertex Model Deployment',
                    'Deployment/Bedrock Model Deployment',
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Auth & Access Control',
              items: [
                {
                  type: 'doc',
                  id: 'Auth/programmatic-auth',
                  label: 'Create API Keys',
                },
                {
                  type: 'doc',
                  id: 'Roles and Access Control/API Key Roles',
                  label: 'API Keys Roles & Limits',
                },
                {
                  type: 'doc',
                  id: 'Roles and Access Control/chat-users-roles',
                  label: 'JWT Roles & Limits',
                },
                {
                  type: 'category',
                  label: 'Configure IDPs',
                  items: [
                    {
                      type: 'doc',
                      id: 'Auth/Web/overview',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'Auth/Web/IDPs/auth0',
                      label: 'Auth0',
                    },
                    {
                      type: 'doc',
                      id: 'Auth/Web/IDPs/cognito',
                      label: 'AWS Cognito',
                    },
                    {
                      type: 'doc',
                      id: 'Auth/Web/IDPs/entraID',
                      label: 'Microsoft Entra',
                    },
                    {
                      type: 'doc',
                      id: 'Auth/Web/IDPs/google',
                      label: 'Google Identity',
                    },
                    {
                      type: 'doc',
                      id: 'Auth/Web/IDPs/keycloak',
                      label: 'Keycloak',
                    },
                    {
                      type: 'doc',
                      id: 'Auth/Web/IDPs/okta',
                      label: 'Okta',
                    },
                  ],
                },
              ],
            },
            {
              type: 'doc',
              id: 'Observability/Observability-config',
              label: 'Observability',
            },
          ],
        },
      ],
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
