/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  CustomSideBar: [
    {
      type: 'category',
      label: 'OLD',
      items: [
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
                  id: 'platform/architecture-and-concepts/architecture',
                  label: 'Architecture Highlights',
                },
                {
                  type: 'doc',
                  id: 'platform/core/auth-intro',
                  label: 'Authentication',
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
                  id: 'platform/core/access-control-intro',
                  label: 'Access Control',
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
              type: 'doc',
              id: 'tutorials/mind-map',
              label: 'Mind Map Studio',
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
                      id: 'tutorials/developers/local-run/quick-start-with-self-hosted-model-ollama',
                      label: 'Chat with a Self-Hosted Model (Ollama)',
                    },
                    {
                      type: 'doc',
                      id: 'tutorials/developers/local-run/quick-start-with-self-hosted-model-vllm',
                      label: 'Chat with a Self-Hosted Model (vLLM)',
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
                        'tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_gpt_image_1_with_configuration',
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
                      id: 'tutorials/developers/integrations/msteams-bot',
                      label: 'Integration with MS Teams',
                    },
                    {
                      type: 'doc',
                      id: 'tutorials/developers/integrations/n8n-integration',
                      label: 'Integration with n8n',
                    },
                  ]
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
                      type: 'doc',
                      id: 'tutorials/devops/deployment/aws-deployment-guide',
                      label: 'AWS Deployment Guide',
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
                      id: 'tutorials/devops/auth-and-access-control/api-keys',
                      label: 'API Keys',
                    },
                    {
                      type: 'doc',
                      id: 'tutorials/devops/auth-and-access-control/jwt',
                      label: 'JWT',
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
                          id: 'tutorials/admin/builders-interceptor-templates',
                          label: 'Interceptor Templates',
                        },
                        {
                          type: 'doc',
                          id: 'tutorials/admin/builders-adapters',
                          label: 'Adapters',
                        },
                      ]
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
                      ]
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
                      ]
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
    },
    {
      type: 'category',
      label: 'NEW',
      items: [
        {
          type: 'doc',
          id: 'docs/NEW/progress',
          label: 'Documentation Progress',
        },
        {
          type: 'category',
          label: 'Home',
          items: [
            { type: 'doc', id: 'docs/NEW/home/index', label: 'Overview' },
            { type: 'doc', id: 'docs/NEW/home/developer-quick-start', label: 'Developer quick start' },
            { type: 'doc', id: 'docs/NEW/home/devops-quick-start', label: 'DevOps quick start' },
            { type: 'doc', id: 'docs/NEW/home/admin-quick-start', label: 'Admin quick start' },
            { type: 'doc', id: 'docs/NEW/home/evaluator-quick-start', label: 'Evaluator quick start' },
            { type: 'doc', id: 'docs/NEW/home/architect-overview', label: 'Architect overview' },
            { type: 'doc', id: 'docs/NEW/home/end-user-guide', label: 'End user guide' },
          ],
        },
        {
          type: 'category',
          label: 'Understand DIAL',
          items: [
            {
              type: 'category',
              label: 'Positioning',
              items: [
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/positioning/what-is-dial',
                  label: 'What is DIAL',
                },
                {
                  type: 'category',
                  label: 'Comparisons',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/understand-dial/positioning/comparisons',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/understand-dial/positioning/comparisons/dial-vs-ai-gateways',
                      label: 'DIAL vs AI gateways',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/understand-dial/positioning/comparisons/dial-vs-app-builders',
                      label: 'DIAL vs app builders',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/understand-dial/positioning/comparisons/dial-vs-frameworks',
                      label: 'DIAL vs frameworks',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/understand-dial/positioning/comparisons/dial-vs-ai-studios',
                      label: 'DIAL vs AI studios',
                    },
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Architecture',
              items: [
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/architecture/architecture-highlights',
                  label: 'Architecture highlights',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/architecture/dial-stack',
                  label: 'DIAL Stack',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/architecture/application-server',
                  label: 'Application server',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/architecture/unified-api-overview',
                  label: 'Unified API overview',
                },
              ],
            },
            {
              type: 'category',
              label: 'Capabilities',
              items: [
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/capabilities/agentic-platform',
                  label: 'Agentic platform',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/capabilities/rag-in-dial',
                  label: 'RAG in DIAL',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/capabilities/multimodality',
                  label: 'Multimodality',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/capabilities/collaboration-and-sharing',
                  label: 'Collaboration and sharing',
                },
              ],
            },
            {
              type: 'category',
              label: 'Security and governance',
              items: [
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/security-and-governance/authentication-and-access-control',
                  label: 'Authentication and access control',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/security-and-governance/access-control-reference',
                  label: 'Access control reference',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/security-and-governance/usage-limits-and-cost-control',
                  label: 'Usage limits and cost control',
                },
              ],
            },
            {
              type: 'category',
              label: 'Foundations',
              items: [
                {
                  type: 'category',
                  label: 'Core concepts and glossary',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/understand-dial/foundations/core-concepts-and-glossary/concept-map',
                      label: 'Concept map',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/understand-dial/foundations/core-concepts-and-glossary/glossary',
                      label: 'Glossary',
                    },
                  ],
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/understand-dial/foundations/dial-evolution',
                  label: 'DIAL evolution',
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
              type: 'doc',
              id: 'docs/NEW/building-with-dial/index',
              label: 'Overview',
            },
            {
              type: 'category',
              label: 'Apps',
              items: [
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/apps/index',
                  label: 'DIAL Apps overview',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/apps/when-to-use-which',
                  label: 'When to use which',
                },
                {
                  type: 'category',
                  label: 'Quick Apps',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/quick-apps/index',
                      label: 'What are Quick Apps',
                    },
                    {
                      type: 'category',
                      label: 'Quick App 2.0',
                      items: [
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/create-via-ui',
                          label: 'Create in DIAL Chat',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/create-via-api',
                          label: 'Create via API',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/create-via-config',
                          label: 'Create via config.json',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/working-with-tools-and-agents',
                          label: 'Add tools and agents',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tutorial-agent-loop-ui',
                          label: 'Tutorial: agent loop (UI)',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tutorial-agent-loop-api',
                          label: 'Tutorial: agent loop (API)',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tutorial-agent-loop-config',
                          label: 'Tutorial: agent loop (config.json)',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/examples',
                          label: 'Quick App 2.0 examples',
                        },
                        {
                          type: 'category',
                          label: 'Tool Sets',
                          items: [
                            {
                              type: 'doc',
                              id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tool-sets/index',
                              label: 'What is a Tool Set',
                            },
                            {
                              type: 'doc',
                              id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tool-sets/define-and-register',
                              label: 'Define and register a Tool Set',
                            },
                            {
                              type: 'doc',
                              id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tool-sets/mcp-server-integration',
                              label: 'Integrate an MCP server',
                            },
                            {
                              type: 'doc',
                              id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tool-sets/sharing-and-permissions',
                              label: 'Share and manage permissions',
                            },
                            {
                              type: 'doc',
                              id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tool-sets/reference',
                              label: 'Configuration reference',
                            },
                            {
                              type: 'doc',
                              id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-2/tool-sets/examples',
                              label: 'Tool Set examples',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'category',
                      label: 'Quick App (original)',
                      items: [
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-original/create-and-configure',
                          label: 'Create and configure',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-original/reference',
                          label: 'Configuration reference',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/apps/quick-apps/quick-app-original/migrate-to-2',
                          label: 'Migrate to Quick App 2.0',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Code Apps',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/code-apps/index',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/code-apps/getting-started',
                      label: 'Getting started',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/code-apps/tutorial-build-deploy',
                      label: 'Tutorial: build a RAG Code App',
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Mind Map Studio',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/mind-map-studio/index',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/mind-map-studio/authoring-workflow',
                      label: 'Authoring workflow',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/mind-map-studio/export-and-publish',
                      label: 'Export and publish',
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Custom Apps',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/custom-apps/index',
                      label: 'Architecture and lifecycle',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/custom-apps/getting-started-sdk',
                      label: 'Getting started with DIAL SDK',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/custom-apps/tutorial-translator-app',
                      label: 'Tutorial: translator app',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/custom-apps/tutorial-rag-app',
                      label: 'Tutorial: build a RAG app',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/custom-apps/custom-buttons',
                      label: 'Tutorial: custom buttons app',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/custom-apps/register-app',
                      label: 'Register an app in DIAL Core',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/custom-apps/deployment',
                      label: 'Deploy a Custom App',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/apps/custom-apps/examples',
                      label: 'Examples',
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
                  type: 'category',
                  label: 'Interceptors',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/interceptors/index',
                      label: 'What are interceptors',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/interceptors/tutorial-pii-interceptor',
                      label: 'Tutorial: PII-redacting interceptor',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/interceptors/sdk-reference',
                      label: 'Interceptors SDK reference',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/interceptors/configuration-and-assignment',
                      label: 'Configure and assign',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/interceptors/examples',
                      label: 'Examples',
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Adapters',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/adapters/index',
                      label: 'What are adapters',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/adapters/tutorial-custom-adapter',
                      label: 'Tutorial: custom adapter',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/adapters/supported-providers',
                      label: 'Supported providers',
                    },
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Quality and testing',
              items: [
                {
                  type: 'category',
                  label: 'Evaluations',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/evaluations/index',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/evaluations/rag-eval-toolkit',
                      label: 'RAG Eval toolkit',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/evaluations/tutorial-eval-driven-dev',
                      label: 'Tutorial: eval-driven development',
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
                  label: 'SDK Reference',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/index',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/dial-app',
                      label: 'DIALApp',
                    },
                    {
                      type: 'category',
                      label: 'Chat completion',
                      items: [
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/chat-completion/index',
                          label: 'Overview',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/chat-completion/request',
                          label: 'Request',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/chat-completion/response',
                          label: 'Response',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/chat-completion/choice',
                          label: 'Choice',
                        },
                        {
                          type: 'doc',
                          id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/chat-completion/stage',
                          label: 'Stage',
                        },
                      ],
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/embeddings',
                      label: 'Embeddings',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/exceptions',
                      label: 'Exceptions',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/sdk-reference/telemetry',
                      label: 'Telemetry',
                    },
                  ],
                },
                {
                  type: 'category',
                  label: 'Chat customization',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/index',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/custom-content',
                      label: 'Custom content in Chat',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/data-visualization',
                      label: 'Data visualization',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/create-custom-visualizer',
                      label: 'Create a custom visualizer',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/chat-localization',
                      label: 'Chat localization',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/theming-and-design',
                      label: 'Theming and design',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/marketplace',
                      label: 'Marketplace',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/create-custom-theme',
                      label: 'Create a custom theme',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/dial-overlay',
                      label: 'DIAL Overlay',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/developer-tools/chat-customization/embed-chat-in-web-app',
                      label: 'Embed Chat with DIAL Overlay',
                    },
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
                  id: 'docs/NEW/building-with-dial/integrations/index',
                  label: 'Overview',
                },
                {
                  type: 'category',
                  label: 'Chatbot integrations',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/integrations/chatbot-integrations/index',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/integrations/chatbot-integrations/ms-teams',
                      label: 'Integration with MS Teams',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/integrations/chatbot-integrations/ms-copilot',
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
                      id: 'docs/NEW/building-with-dial/integrations/productivity-add-ins/index',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/integrations/productivity-add-ins/ms-excel',
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
                      id: 'docs/NEW/building-with-dial/integrations/workflow-automation/index',
                      label: 'Overview',
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/building-with-dial/integrations/workflow-automation/n8n',
                      label: 'Integration with n8n',
                    },
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Working with DIAL resources',
              items: [
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/working-with-dial-resources/index',
                  label: 'Overview',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/working-with-dial-resources/file-management',
                  label: 'File management',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/working-with-dial-resources/publications-api',
                  label: 'Publications API',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/working-with-dial-resources/sharing-api',
                  label: 'Sharing API',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/working-with-dial-resources/notifications',
                  label: 'Notifications',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/working-with-dial-resources/per-request-keys',
                  label: 'Per-request keys',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/working-with-dial-resources/auth-matrix-for-apps',
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
                  id: 'docs/NEW/building-with-dial/advanced-topics/index',
                  label: 'Overview',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/advanced-topics/prompt-caching',
                  label: 'How prompt caching works',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/building-with-dial/advanced-topics/tutorial-prompt-caching',
                  label: 'Tutorial: enable prompt caching',
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
                { type: 'doc', id: 'docs/NEW/operating-dial/local-setup/index', label: 'Overview' },
                { type: 'doc', id: 'docs/NEW/operating-dial/local-setup/docker-compose-with-application', label: 'Echo application' },
                { type: 'doc', id: 'docs/NEW/operating-dial/local-setup/docker-compose-with-ollama', label: 'Ollama model' },
                { type: 'doc', id: 'docs/NEW/operating-dial/local-setup/docker-compose-with-vllm', label: 'vLLM model' },
                { type: 'doc', id: 'docs/NEW/operating-dial/local-setup/docker-compose-with-azure-model', label: 'Azure OpenAI model' },
                { type: 'doc', id: 'docs/NEW/operating-dial/local-setup/dial-to-dial-adapter', label: 'DIAL-to-DIAL adapter' },
              ],
            },
            {
              type: 'category',
              label: 'Cloud deployment',
              items: [
                { type: 'doc', id: 'docs/NEW/operating-dial/cloud-deployment/index', label: 'Helm chart overview' },
                { type: 'doc', id: 'docs/NEW/operating-dial/cloud-deployment/aws-deployment', label: 'AWS' },
                { type: 'doc', id: 'docs/NEW/operating-dial/cloud-deployment/azure-deployment', label: 'Azure' },
                { type: 'doc', id: 'docs/NEW/operating-dial/cloud-deployment/gcp-deployment', label: 'GCP' },
                { type: 'doc', id: 'docs/NEW/operating-dial/cloud-deployment/generic-kubernetes', label: 'Generic Kubernetes' },
                { type: 'doc', id: 'docs/NEW/operating-dial/cloud-deployment/azure-secrets-deployment', label: 'Azure Secrets' },
                { type: 'doc', id: 'docs/NEW/operating-dial/cloud-deployment/custom-apps-deployment', label: 'Custom Apps' },
                { type: 'doc', id: 'docs/NEW/operating-dial/cloud-deployment/quick-apps-installation', label: 'Quick Apps' },
              ],
            },
            {
              type: 'category',
              label: 'Model deployment',
              items: [
                { type: 'doc', id: 'docs/NEW/operating-dial/model-deployment/bedrock-model-deployment', label: 'Bedrock models' },
                { type: 'doc', id: 'docs/NEW/operating-dial/model-deployment/openai-model-deployment', label: 'Azure OpenAI models' },
                { type: 'doc', id: 'docs/NEW/operating-dial/model-deployment/vertex-model-deployment', label: 'Vertex AI models' },
                { type: 'doc', id: 'docs/NEW/operating-dial/model-deployment/databricks-model-deployment', label: 'Databricks models' },
              ],
            },
            {
              type: 'category',
              label: 'Configuration Reference',
              items: [
                {
                  type: 'doc',
                  id: 'docs/NEW/operating-dial/configuration/index',
                  label: 'Overview',
                },
                {
                  type: 'category',
                  label: 'DIAL Core',
                  items: [
                    {
                      type: 'doc',
                      id: 'docs/NEW/operating-dial/configuration/core/index',
                      label: 'Overview',
                    },
                    {
                      type: 'category',
                      label: 'settings.json',
                      items: [
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/index', label: 'Overview' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/server', label: 'Server & Client' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/storage', label: 'Storage' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/redis', label: 'Redis' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/identity-providers', label: 'Identity Providers' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/encryption', label: 'Encryption' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/resources', label: 'Resources' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/access', label: 'Access Control' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/config-reload', label: 'Config Reload' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/settings-json/toolsets-security', label: 'Toolsets & Misc' },
                      ],
                    },
                    {
                      type: 'category',
                      label: 'config.json',
                      items: [
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/config-json/index', label: 'Overview' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/config-json/models', label: 'Models' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/config-json/applications', label: 'Applications' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/config-json/interceptors', label: 'Interceptors' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/config-json/roles', label: 'Roles' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/config-json/keys', label: 'Keys' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/config-json/routes', label: 'Routes' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/core/config-json/toolsets', label: 'Toolsets' },
                      ],
                    },
                    {
                      type: 'doc',
                      id: 'docs/NEW/operating-dial/configuration/core/gflog-xml',
                      label: 'gflog.xml',
                    },
                  ],
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/operating-dial/configuration/chat-configuration',
                  label: 'DIAL Chat',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/operating-dial/configuration/adapter-configuration',
                  label: 'Adapters',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/operating-dial/configuration/auth-helper-configuration',
                  label: 'Auth Helper',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/operating-dial/configuration/admin-configuration',
                  label: 'Admin Panel',
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/operating-dial/configuration/realm-config-json',
                  label: 'Keycloak (realm-config.json)',
                },
                {
                  type: 'category',
                  label: 'Docker Compose',
                  items: [
                    { type: 'doc', id: 'docs/NEW/operating-dial/configuration/docker-compose/index', label: 'Overview' },
                    { type: 'doc', id: 'docs/NEW/operating-dial/configuration/docker-compose/quick-start', label: 'Quick Start' },
                    {
                      type: 'category',
                      label: 'Advanced Setup',
                      items: [
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/docker-compose/advanced/index', label: 'Overview' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/docker-compose/advanced/core-services', label: 'Core, Redis & Themes' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/docker-compose/advanced/auth', label: 'Authentication' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/docker-compose/advanced/admin', label: 'Admin Panel' },
                        { type: 'doc', id: 'docs/NEW/operating-dial/configuration/docker-compose/advanced/adapters-and-rag', label: 'Adapters & RAG' },
                      ],
                    },
                    { type: 'doc', id: 'docs/NEW/operating-dial/configuration/docker-compose/env-reference', label: '.env Reference' },
                  ],
                },
                {
                  type: 'doc',
                  id: 'docs/NEW/operating-dial/configuration/coverage-status',
                  label: 'Coverage Status',
                },
              ],
            },
            {
              type: 'category',
              label: 'Auth and access control',
              items: [
                { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/index', label: 'Overview' },
                { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/api-keys', label: 'API keys' },
                { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/jwt', label: 'JWT authentication' },
                { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/roles-and-rate-limits', label: 'Roles and rate limits' },
                {
                  type: 'category',
                  label: 'SSO / IdP setup',
                  items: [
                    { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/sso-idp/index', label: 'Overview' },
                    { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/sso-idp/aws-cognito', label: 'AWS Cognito' },
                    { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/sso-idp/auth0', label: 'Auth0' },
                    { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/sso-idp/google-identity', label: 'Google Identity' },
                    { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/sso-idp/microsoft-entra-id', label: 'Microsoft Entra ID' },
                    { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/sso-idp/okta', label: 'Okta' },
                    { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/sso-idp/keycloak', label: 'Keycloak' },
                    { type: 'doc', id: 'docs/NEW/operating-dial/auth-and-access-control/sso-idp/azure-b2c', label: 'Azure AD B2C' },
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: 'Observability',
              items: [
                { type: 'doc', id: 'docs/NEW/operating-dial/observability/index', label: 'Overview' },
                { type: 'doc', id: 'docs/NEW/operating-dial/observability/tracing', label: 'Tracing (OpenTelemetry)' },
                { type: 'doc', id: 'docs/NEW/operating-dial/observability/metrics-and-monitoring', label: 'Metrics and monitoring' },
                { type: 'doc', id: 'docs/NEW/operating-dial/observability/logging', label: 'Logging' },
                { type: 'doc', id: 'docs/NEW/operating-dial/observability/alerting', label: 'Alerting' },
                { type: 'doc', id: 'docs/NEW/operating-dial/observability/analytics-realtime-setup', label: 'Analytics Realtime setup' },
                {
                  type: 'category',
                  label: 'Provider-specific guides',
                  items: [
                    { type: 'doc', id: 'docs/NEW/operating-dial/observability/providers/grafana-prometheus', label: 'Grafana + Prometheus' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
