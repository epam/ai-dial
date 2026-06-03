/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  CustomSideBar: [
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
  ],
};

export default sidebars;
