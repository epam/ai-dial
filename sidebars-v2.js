/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  v2Sidebar: [
    {
      "type": "doc",
      "id": "progress",
      "label": "Documentation Progress"
    },
    {
      "type": "category",
      "label": "Home",
      "items": [
        {
          "type": "doc",
          "id": "home/index",
          "label": "Overview"
        },
        {
          "type": "doc",
          "id": "home/developer-quick-start",
          "label": "Developer quick start"
        },
        {
          "type": "doc",
          "id": "home/devops-quick-start",
          "label": "DevOps quick start"
        },
        {
          "type": "doc",
          "id": "home/admin-quick-start",
          "label": "Admin quick start"
        },
        {
          "type": "doc",
          "id": "home/evaluator-quick-start",
          "label": "Evaluator quick start"
        },
        {
          "type": "doc",
          "id": "home/architect-overview",
          "label": "Architect overview"
        },
        {
          "type": "doc",
          "id": "home/end-user-guide",
          "label": "End user guide"
        }
      ]
    },
    {
      "type": "category",
      "label": "Understand DIAL",
      "items": [
        {
          "type": "category",
          "label": "Positioning",
          "items": [
            {
              "type": "doc",
              "id": "understand-dial/positioning/what-is-dial",
              "label": "What is DIAL"
            },
            {
              "type": "category",
              "label": "Comparisons",
              "items": [
                {
                  "type": "doc",
                  "id": "understand-dial/positioning/comparisons",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "understand-dial/positioning/comparisons/dial-vs-ai-gateways",
                  "label": "DIAL vs AI gateways"
                },
                {
                  "type": "doc",
                  "id": "understand-dial/positioning/comparisons/dial-vs-app-builders",
                  "label": "DIAL vs app builders"
                },
                {
                  "type": "doc",
                  "id": "understand-dial/positioning/comparisons/dial-vs-frameworks",
                  "label": "DIAL vs frameworks"
                },
                {
                  "type": "doc",
                  "id": "understand-dial/positioning/comparisons/dial-vs-ai-studios",
                  "label": "DIAL vs AI studios"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Architecture",
          "items": [
            {
              "type": "doc",
              "id": "understand-dial/architecture/architecture-highlights",
              "label": "Architecture highlights"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/dial-stack",
              "label": "DIAL Stack"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/application-server",
              "label": "Application server"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/unified-api-overview",
              "label": "Unified API overview"
            }
          ]
        },
        {
          "type": "category",
          "label": "Capabilities",
          "items": [
            {
              "type": "doc",
              "id": "understand-dial/capabilities/agentic-platform",
              "label": "Agentic platform"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/rag-in-dial",
              "label": "RAG in DIAL"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/multimodality",
              "label": "Multimodality"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/collaboration-and-sharing",
              "label": "Collaboration and sharing"
            }
          ]
        },
        {
          "type": "category",
          "label": "Security and governance",
          "items": [
            {
              "type": "doc",
              "id": "understand-dial/security-and-governance/authentication-and-access-control",
              "label": "Authentication and access control"
            },
            {
              "type": "doc",
              "id": "understand-dial/security-and-governance/access-control-reference",
              "label": "Access control reference"
            },
            {
              "type": "doc",
              "id": "understand-dial/security-and-governance/usage-limits-and-cost-control",
              "label": "Usage limits and cost control"
            }
          ]
        },
        {
          "type": "category",
          "label": "Foundations",
          "items": [
            {
              "type": "category",
              "label": "Core concepts and glossary",
              "items": [
                {
                  "type": "doc",
                  "id": "understand-dial/foundations/core-concepts-and-glossary/concept-map",
                  "label": "Concept map"
                },
                {
                  "type": "doc",
                  "id": "understand-dial/foundations/core-concepts-and-glossary/glossary",
                  "label": "Glossary"
                }
              ]
            },
            {
              "type": "doc",
              "id": "understand-dial/foundations/dial-evolution",
              "label": "DIAL evolution"
            }
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Building with DIAL",
      "items": [
        {
          "type": "doc",
          "id": "building-with-dial/index",
          "label": "Overview"
        },
        {
          "type": "category",
          "label": "Apps",
          "items": [
            {
              "type": "doc",
              "id": "building-with-dial/apps/index",
              "label": "DIAL Apps overview"
            },
            {
              "type": "doc",
              "id": "building-with-dial/apps/when-to-use-which",
              "label": "When to use which"
            },
            {
              "type": "category",
              "label": "Quick Apps",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/quick-apps/index",
                  "label": "What are Quick Apps"
                },
                {
                  "type": "category",
                  "label": "Quick App 2.0",
                  "items": [
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-2/create-via-ui",
                      "label": "Create in DIAL Chat"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-2/create-via-api",
                      "label": "Create via API"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-2/create-via-config",
                      "label": "Create via config.json"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-2/working-with-tools-and-agents",
                      "label": "Add tools and agents"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-2/tutorial-agent-loop-ui",
                      "label": "Tutorial: agent loop (UI)"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-2/tutorial-agent-loop-api",
                      "label": "Tutorial: agent loop (API)"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-2/tutorial-agent-loop-config",
                      "label": "Tutorial: agent loop (config.json)"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-2/examples",
                      "label": "Quick App 2.0 examples"
                    },
                    {
                      "type": "category",
                      "label": "Tool Sets",
                      "items": [
                        {
                          "type": "doc",
                          "id": "building-with-dial/apps/quick-apps/quick-app-2/tool-sets/index",
                          "label": "What is a Tool Set"
                        },
                        {
                          "type": "doc",
                          "id": "building-with-dial/apps/quick-apps/quick-app-2/tool-sets/define-and-register",
                          "label": "Define and register a Tool Set"
                        },
                        {
                          "type": "doc",
                          "id": "building-with-dial/apps/quick-apps/quick-app-2/tool-sets/mcp-server-integration",
                          "label": "Integrate an MCP server"
                        },
                        {
                          "type": "doc",
                          "id": "building-with-dial/apps/quick-apps/quick-app-2/tool-sets/sharing-and-permissions",
                          "label": "Share and manage permissions"
                        },
                        {
                          "type": "doc",
                          "id": "building-with-dial/apps/quick-apps/quick-app-2/tool-sets/reference",
                          "label": "Configuration reference"
                        },
                        {
                          "type": "doc",
                          "id": "building-with-dial/apps/quick-apps/quick-app-2/tool-sets/examples",
                          "label": "Tool Set examples"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "category",
                  "label": "Quick App (original)",
                  "items": [
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-original/create-and-configure",
                      "label": "Create and configure"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-original/reference",
                      "label": "Configuration reference"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/apps/quick-apps/quick-app-original/migrate-to-2",
                      "label": "Migrate to Quick App 2.0"
                    }
                  ]
                }
              ]
            },
            {
              "type": "category",
              "label": "Code Apps",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/code-apps/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/code-apps/getting-started",
                  "label": "Getting started"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/code-apps/tutorial-build-deploy",
                  "label": "Tutorial: build a RAG Code App"
                }
              ]
            },
            {
              "type": "category",
              "label": "Mind Map Studio",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/mind-map-studio/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/mind-map-studio/authoring-workflow",
                  "label": "Authoring workflow"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/mind-map-studio/export-and-publish",
                  "label": "Export and publish"
                }
              ]
            },
            {
              "type": "category",
              "label": "Custom Apps",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/custom-apps/index",
                  "label": "Architecture and lifecycle"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/custom-apps/getting-started-sdk",
                  "label": "Getting started with DIAL SDK"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/custom-apps/tutorial-translator-app",
                  "label": "Tutorial: translator app"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/custom-apps/tutorial-rag-app",
                  "label": "Tutorial: build a RAG app"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/custom-apps/custom-buttons",
                  "label": "Tutorial: custom buttons app"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/custom-apps/register-app",
                  "label": "Register an app in DIAL Core"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/custom-apps/deployment",
                  "label": "Deploy a Custom App"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/custom-apps/examples",
                  "label": "Examples"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Extension points",
          "items": [
            {
              "type": "category",
              "label": "Interceptors",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/interceptors/index",
                  "label": "What are interceptors"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/interceptors/tutorial-pii-interceptor",
                  "label": "Tutorial: PII-redacting interceptor"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/interceptors/sdk-reference",
                  "label": "Interceptors SDK reference"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/interceptors/configuration-and-assignment",
                  "label": "Configure and assign"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/interceptors/examples",
                  "label": "Examples"
                }
              ]
            },
            {
              "type": "category",
              "label": "Adapters",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/adapters/index",
                  "label": "What are adapters"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/adapters/tutorial-custom-adapter",
                  "label": "Tutorial: custom adapter"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/adapters/supported-providers",
                  "label": "Supported providers"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Quality and testing",
          "items": [
            {
              "type": "category",
              "label": "Evaluations",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/evaluations/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/evaluations/rag-eval-toolkit",
                  "label": "RAG Eval toolkit"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/evaluations/tutorial-eval-driven-dev",
                  "label": "Tutorial: eval-driven development"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Developer tools",
          "items": [
            {
              "type": "category",
              "label": "SDK Reference",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/sdk-reference/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/sdk-reference/dial-app",
                  "label": "DIALApp"
                },
                {
                  "type": "category",
                  "label": "Chat completion",
                  "items": [
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/sdk-reference/chat-completion/index",
                      "label": "Overview"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/sdk-reference/chat-completion/request",
                      "label": "Request"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/sdk-reference/chat-completion/response",
                      "label": "Response"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/sdk-reference/chat-completion/choice",
                      "label": "Choice"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/sdk-reference/chat-completion/stage",
                      "label": "Stage"
                    }
                  ]
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/sdk-reference/embeddings",
                  "label": "Embeddings"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/sdk-reference/exceptions",
                  "label": "Exceptions"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/sdk-reference/telemetry",
                  "label": "Telemetry"
                }
              ]
            },
            {
              "type": "category",
              "label": "Chat customization",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/custom-content",
                  "label": "Custom content in Chat"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/data-visualization",
                  "label": "Data visualization"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/create-custom-visualizer",
                  "label": "Create a custom visualizer"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/chat-localization",
                  "label": "Chat localization"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/theming-and-design",
                  "label": "Theming and design"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/marketplace",
                  "label": "Marketplace"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/create-custom-theme",
                  "label": "Create a custom theme"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/dial-overlay",
                  "label": "DIAL Overlay"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/chat-customization/embed-chat-in-web-app",
                  "label": "Embed Chat with DIAL Overlay"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Integrations",
          "items": [
            {
              "type": "doc",
              "id": "building-with-dial/integrations/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "Chatbot integrations",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/chatbot-integrations/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/chatbot-integrations/ms-teams",
                  "label": "Integration with MS Teams"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/chatbot-integrations/ms-copilot",
                  "label": "Integration with MS Copilot"
                }
              ]
            },
            {
              "type": "category",
              "label": "Productivity add-ins",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/productivity-add-ins/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/productivity-add-ins/ms-excel",
                  "label": "Integration with MS Excel"
                }
              ]
            },
            {
              "type": "category",
              "label": "Workflow automation",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/workflow-automation/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/workflow-automation/n8n",
                  "label": "Integration with n8n"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Working with DIAL resources",
          "items": [
            {
              "type": "doc",
              "id": "building-with-dial/working-with-dial-resources/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "building-with-dial/working-with-dial-resources/file-management",
              "label": "File management"
            },
            {
              "type": "doc",
              "id": "building-with-dial/working-with-dial-resources/publications-api",
              "label": "Publications API"
            },
            {
              "type": "doc",
              "id": "building-with-dial/working-with-dial-resources/sharing-api",
              "label": "Sharing API"
            },
            {
              "type": "doc",
              "id": "building-with-dial/working-with-dial-resources/notifications",
              "label": "Notifications"
            },
            {
              "type": "doc",
              "id": "building-with-dial/working-with-dial-resources/per-request-keys",
              "label": "Per-request keys"
            },
            {
              "type": "doc",
              "id": "building-with-dial/working-with-dial-resources/auth-matrix-for-apps",
              "label": "Auth matrix for apps"
            }
          ]
        },
        {
          "type": "category",
          "label": "Advanced topics",
          "items": [
            {
              "type": "doc",
              "id": "building-with-dial/advanced-topics/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "building-with-dial/advanced-topics/prompt-caching",
              "label": "How prompt caching works"
            },
            {
              "type": "doc",
              "id": "building-with-dial/advanced-topics/tutorial-prompt-caching",
              "label": "Tutorial: enable prompt caching"
            }
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Operating DIAL",
      "items": [
        {
          "type": "category",
          "label": "Local setup",
          "items": [
            {
              "type": "doc",
              "id": "operating-dial/local-setup/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "operating-dial/local-setup/docker-compose-with-application",
              "label": "Echo application"
            },
            {
              "type": "doc",
              "id": "operating-dial/local-setup/docker-compose-with-ollama",
              "label": "Ollama model"
            },
            {
              "type": "doc",
              "id": "operating-dial/local-setup/docker-compose-with-vllm",
              "label": "vLLM model"
            },
            {
              "type": "doc",
              "id": "operating-dial/local-setup/docker-compose-with-azure-model",
              "label": "Azure OpenAI model"
            },
            {
              "type": "doc",
              "id": "operating-dial/local-setup/dial-to-dial-adapter",
              "label": "DIAL-to-DIAL adapter"
            }
          ]
        },
        {
          "type": "category",
          "label": "Cloud deployment",
          "items": [
            {
              "type": "doc",
              "id": "operating-dial/cloud-deployment/index",
              "label": "Helm chart overview"
            },
            {
              "type": "doc",
              "id": "operating-dial/cloud-deployment/aws-deployment",
              "label": "AWS"
            },
            {
              "type": "doc",
              "id": "operating-dial/cloud-deployment/azure-deployment",
              "label": "Azure"
            },
            {
              "type": "doc",
              "id": "operating-dial/cloud-deployment/gcp-deployment",
              "label": "GCP"
            },
            {
              "type": "doc",
              "id": "operating-dial/cloud-deployment/generic-kubernetes",
              "label": "Generic Kubernetes"
            },
            {
              "type": "doc",
              "id": "operating-dial/cloud-deployment/azure-secrets-deployment",
              "label": "Azure Secrets"
            },
            {
              "type": "doc",
              "id": "operating-dial/cloud-deployment/custom-apps-deployment",
              "label": "Custom Apps"
            },
            {
              "type": "doc",
              "id": "operating-dial/cloud-deployment/quick-apps-installation",
              "label": "Quick Apps"
            }
          ]
        },
        {
          "type": "category",
          "label": "Model deployment",
          "items": [
            {
              "type": "doc",
              "id": "operating-dial/model-deployment/bedrock-model-deployment",
              "label": "Bedrock models"
            },
            {
              "type": "doc",
              "id": "operating-dial/model-deployment/openai-model-deployment",
              "label": "Azure OpenAI models"
            },
            {
              "type": "doc",
              "id": "operating-dial/model-deployment/vertex-model-deployment",
              "label": "Vertex AI models"
            },
            {
              "type": "doc",
              "id": "operating-dial/model-deployment/databricks-model-deployment",
              "label": "Databricks models"
            }
          ]
        },
        {
          "type": "category",
          "label": "Configuration Reference",
          "items": [
            {
              "type": "doc",
              "id": "operating-dial/configuration/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "DIAL Core",
              "items": [
                {
                  "type": "doc",
                  "id": "operating-dial/configuration/core/index",
                  "label": "Overview"
                },
                {
                  "type": "category",
                  "label": "settings.json",
                  "items": [
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/index",
                      "label": "Overview"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/server",
                      "label": "Server & Client"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/storage",
                      "label": "Storage"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/redis",
                      "label": "Redis"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/identity-providers",
                      "label": "Identity Providers"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/encryption",
                      "label": "Encryption"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/resources",
                      "label": "Resources"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/access",
                      "label": "Access Control"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/config-reload",
                      "label": "Config Reload"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/settings-json/toolsets-security",
                      "label": "Toolsets & Misc"
                    }
                  ]
                },
                {
                  "type": "category",
                  "label": "config.json",
                  "items": [
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/config-json/index",
                      "label": "Overview"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/config-json/models",
                      "label": "Models"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/config-json/applications",
                      "label": "Applications"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/config-json/interceptors",
                      "label": "Interceptors"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/config-json/roles",
                      "label": "Roles"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/config-json/keys",
                      "label": "Keys"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/config-json/routes",
                      "label": "Routes"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/core/config-json/toolsets",
                      "label": "Toolsets"
                    }
                  ]
                },
                {
                  "type": "doc",
                  "id": "operating-dial/configuration/core/gflog-xml",
                  "label": "gflog.xml"
                }
              ]
            },
            {
              "type": "doc",
              "id": "operating-dial/configuration/chat-configuration",
              "label": "DIAL Chat"
            },
            {
              "type": "doc",
              "id": "operating-dial/configuration/adapter-configuration",
              "label": "Adapters"
            },
            {
              "type": "doc",
              "id": "operating-dial/configuration/auth-helper-configuration",
              "label": "Auth Helper"
            },
            {
              "type": "doc",
              "id": "operating-dial/configuration/admin-configuration",
              "label": "Admin Panel"
            },
            {
              "type": "doc",
              "id": "operating-dial/configuration/realm-config-json",
              "label": "Keycloak (realm-config.json)"
            },
            {
              "type": "doc",
              "id": "operating-dial/configuration/load-balancer",
              "label": "Load Balancer"
            },
            {
              "type": "doc",
              "id": "operating-dial/configuration/enable-publications",
              "label": "Enable Publications"
            },
            {
              "type": "category",
              "label": "Docker Compose",
              "items": [
                {
                  "type": "doc",
                  "id": "operating-dial/configuration/docker-compose/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "operating-dial/configuration/docker-compose/quick-start",
                  "label": "Quick Start"
                },
                {
                  "type": "category",
                  "label": "Advanced Setup",
                  "items": [
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/docker-compose/advanced/index",
                      "label": "Overview"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/docker-compose/advanced/core-services",
                      "label": "Core, Redis & Themes"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/docker-compose/advanced/auth",
                      "label": "Authentication"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/docker-compose/advanced/admin",
                      "label": "Admin Panel"
                    },
                    {
                      "type": "doc",
                      "id": "operating-dial/configuration/docker-compose/advanced/adapters-and-rag",
                      "label": "Adapters & RAG"
                    }
                  ]
                },
                {
                  "type": "doc",
                  "id": "operating-dial/configuration/docker-compose/env-reference",
                  "label": ".env Reference"
                }
              ]
            },
            {
              "type": "doc",
              "id": "operating-dial/configuration/coverage-status",
              "label": "Coverage Status"
            }
          ]
        },
        {
          "type": "category",
          "label": "Auth and access control",
          "items": [
            {
              "type": "doc",
              "id": "operating-dial/auth-and-access-control/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "operating-dial/auth-and-access-control/api-keys",
              "label": "API keys"
            },
            {
              "type": "doc",
              "id": "operating-dial/auth-and-access-control/jwt",
              "label": "JWT authentication"
            },
            {
              "type": "doc",
              "id": "operating-dial/auth-and-access-control/roles-and-rate-limits",
              "label": "Roles and rate limits"
            },
            {
              "type": "category",
              "label": "SSO / IdP setup",
              "items": [
                {
                  "type": "doc",
                  "id": "operating-dial/auth-and-access-control/sso-idp/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "operating-dial/auth-and-access-control/sso-idp/aws-cognito",
                  "label": "AWS Cognito"
                },
                {
                  "type": "doc",
                  "id": "operating-dial/auth-and-access-control/sso-idp/auth0",
                  "label": "Auth0"
                },
                {
                  "type": "doc",
                  "id": "operating-dial/auth-and-access-control/sso-idp/google-identity",
                  "label": "Google Identity"
                },
                {
                  "type": "doc",
                  "id": "operating-dial/auth-and-access-control/sso-idp/microsoft-entra-id",
                  "label": "Microsoft Entra ID"
                },
                {
                  "type": "doc",
                  "id": "operating-dial/auth-and-access-control/sso-idp/okta",
                  "label": "Okta"
                },
                {
                  "type": "doc",
                  "id": "operating-dial/auth-and-access-control/sso-idp/keycloak",
                  "label": "Keycloak"
                },
                {
                  "type": "doc",
                  "id": "operating-dial/auth-and-access-control/sso-idp/azure-b2c",
                  "label": "Azure AD B2C"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Observability",
          "items": [
            {
              "type": "doc",
              "id": "operating-dial/observability/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "operating-dial/observability/tracing",
              "label": "Tracing (OpenTelemetry)"
            },
            {
              "type": "doc",
              "id": "operating-dial/observability/metrics-and-monitoring",
              "label": "Metrics and monitoring"
            },
            {
              "type": "doc",
              "id": "operating-dial/observability/logging",
              "label": "Logging"
            },
            {
              "type": "doc",
              "id": "operating-dial/observability/alerting",
              "label": "Alerting"
            },
            {
              "type": "doc",
              "id": "operating-dial/observability/analytics-realtime-setup",
              "label": "Analytics Realtime setup"
            },
            {
              "type": "category",
              "label": "Provider-specific guides",
              "items": [
                {
                  "type": "doc",
                  "id": "operating-dial/observability/providers/grafana-prometheus",
                  "label": "Grafana + Prometheus"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "Production readiness",
          "items": [
            {
              "type": "doc",
              "id": "operating-dial/production-readiness/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "operating-dial/production-readiness/high-availability",
              "label": "High availability"
            },
            {
              "type": "doc",
              "id": "operating-dial/production-readiness/scaling",
              "label": "Scaling"
            },
            {
              "type": "doc",
              "id": "operating-dial/production-readiness/secrets-management",
              "label": "Secrets management"
            },
            {
              "type": "doc",
              "id": "operating-dial/production-readiness/backup-and-restore",
              "label": "Backup and restore"
            },
            {
              "type": "doc",
              "id": "operating-dial/production-readiness/upgrade-procedure",
              "label": "Upgrade procedure"
            },
            {
              "type": "doc",
              "id": "operating-dial/production-readiness/cost-control",
              "label": "Cost control"
            },
            {
              "type": "doc",
              "id": "operating-dial/production-readiness/security-hardening",
              "label": "Security hardening"
            }
          ]
        },
        {
          "type": "doc",
          "id": "operating-dial/troubleshooting",
          "label": "Troubleshooting"
        }
      ]
    },
    {
      "type": "category",
      "label": "Administering DIAL",
      "items": [
        {
          "type": "doc",
          "id": "administering-dial/index",
          "label": "Overview"
        },
        {
          "type": "doc",
          "id": "administering-dial/config-backup-and-global-settings",
          "label": "Backup, restore & global settings"
        },
        {
          "type": "category",
          "label": "Entities",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial/entities/models",
              "label": "Models"
            },
            {
              "type": "doc",
              "id": "administering-dial/entities/applications",
              "label": "Applications"
            },
            {
              "type": "doc",
              "id": "administering-dial/entities/toolsets",
              "label": "Tool sets"
            },
            {
              "type": "doc",
              "id": "administering-dial/entities/interceptors",
              "label": "Interceptors"
            },
            {
              "type": "doc",
              "id": "administering-dial/entities/routes",
              "label": "Routes"
            }
          ]
        },
        {
          "type": "doc",
          "id": "administering-dial/builders",
          "label": "Builders"
        },
        {
          "type": "doc",
          "id": "administering-dial/assets",
          "label": "Assets"
        },
        {
          "type": "category",
          "label": "Deployments",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial/deployments/images",
              "label": "Images"
            },
            {
              "type": "doc",
              "id": "administering-dial/deployments/container-management",
              "label": "Containers"
            },
            {
              "type": "doc",
              "id": "administering-dial/deployments/mcp-containers",
              "label": "MCP containers"
            }
          ]
        },
        {
          "type": "category",
          "label": "Access management",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial/access-management/roles",
              "label": "Roles"
            },
            {
              "type": "doc",
              "id": "administering-dial/access-management/keys",
              "label": "Keys"
            }
          ]
        },
        {
          "type": "doc",
          "id": "administering-dial/publications-and-review",
          "label": "Publications and review"
        },
        {
          "type": "category",
          "label": "Audit",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial/audit/activity-and-rollback",
              "label": "Activity and rollback"
            },
            {
              "type": "doc",
              "id": "administering-dial/audit/monitoring-dashboards",
              "label": "Monitoring and dashboards"
            }
          ]
        },
        {
          "type": "doc",
          "id": "administering-dial/user-management",
          "label": "User management"
        },
        {
          "type": "doc",
          "id": "administering-dial/usage-limits-and-cost-control",
          "label": "Usage limits and cost control"
        },
        {
          "type": "doc",
          "id": "administering-dial/compliance-and-legal-faq",
          "label": "Compliance and legal FAQ"
        }
      ]
    },
    {
      "type": "category",
      "label": "Chat User Guide",
      "items": [
        {
          "type": "doc",
          "id": "chat-user-guide/index",
          "label": "Overview and interface"
        },
        {
          "type": "doc",
          "id": "chat-user-guide/conversations",
          "label": "Conversations"
        },
        {
          "type": "doc",
          "id": "chat-user-guide/prompts",
          "label": "Prompts"
        },
        {
          "type": "doc",
          "id": "chat-user-guide/marketplace-and-apps",
          "label": "Marketplace and apps"
        },
        {
          "type": "doc",
          "id": "chat-user-guide/tool-sets",
          "label": "Tool sets"
        },
        {
          "type": "doc",
          "id": "chat-user-guide/files",
          "label": "Files"
        },
        {
          "type": "doc",
          "id": "chat-user-guide/sharing-and-publishing",
          "label": "Sharing and publishing"
        },
        {
          "type": "doc",
          "id": "chat-user-guide/settings",
          "label": "Settings"
        }
      ]
    },
    {
      "type": "category",
      "label": "Reference",
      "link": {
        "type": "doc",
        "id": "reference/index"
      },
      "items": [
        {
          "type": "doc",
          "id": "reference/unified-api",
          "label": "Unified API"
        },
        {
          "type": "ref",
          "id": "building-with-dial/developer-tools/sdk-reference/index",
          "label": "SDK reference"
        },
        {
          "type": "ref",
          "id": "operating-dial/configuration/index",
          "label": "Configuration reference"
        },
        {
          "type": "ref",
          "id": "understand-dial/foundations/core-concepts-and-glossary/glossary",
          "label": "Glossary"
        },
        {
          "type": "ref",
          "id": "building-with-dial/adapters/supported-providers",
          "label": "Supported models and providers"
        },
        {
          "type": "category",
          "label": "Changelog",
          "items": [
            {
              "type": "autogenerated",
              "dirName": "reference/changelog"
            }
          ]
        },
        {
          "type": "doc",
          "id": "reference/compatibility-matrix",
          "label": "Component compatibility matrix"
        }
      ]
    },
    {
      "type": "category",
      "label": "Use Cases",
      "link": {
        "type": "doc",
        "id": "use-cases/index"
      },
      "items": [
        {
          "type": "doc",
          "id": "use-cases/org-wide-ai-assistant",
          "label": "Org-wide AI assistant"
        },
        {
          "type": "doc",
          "id": "use-cases/chat-with-your-knowledge-base",
          "label": "Chat with your knowledge base"
        },
        {
          "type": "doc",
          "id": "use-cases/no-code-ai-tools",
          "label": "No-code AI tools for business teams"
        },
        {
          "type": "doc",
          "id": "use-cases/one-api-every-provider",
          "label": "One API for every model provider"
        },
        {
          "type": "doc",
          "id": "use-cases/cost-and-usage-governance",
          "label": "Centralized cost and usage governance"
        },
        {
          "type": "doc",
          "id": "use-cases/custom-production-agents",
          "label": "Custom production AI agents"
        },
        {
          "type": "doc",
          "id": "use-cases/embed-ai-in-existing-tools",
          "label": "Embed AI in existing tools"
        },
        {
          "type": "doc",
          "id": "use-cases/measure-and-improve-quality",
          "label": "Measure and improve AI quality"
        },
        {
          "type": "doc",
          "id": "use-cases/compliance-and-pii-safe-ai",
          "label": "Compliance and PII-safe AI"
        }
      ]
    },
    {
      "type": "category",
      "label": "Demos",
      "link": {
        "type": "doc",
        "id": "demos/index"
      },
      "items": [
        {
          "type": "doc",
          "id": "demos/platform-overview",
          "label": "Platform overview"
        },
        {
          "type": "doc",
          "id": "demos/chat-capabilities",
          "label": "Chat capabilities"
        },
        {
          "type": "doc",
          "id": "demos/apps-and-agents",
          "label": "Apps and agents showcase"
        },
        {
          "type": "doc",
          "id": "demos/deployment-and-admin",
          "label": "Deployment and admin walkthrough"
        },
        {
          "type": "doc",
          "id": "demos/developer-features",
          "label": "Developer features"
        },
        {
          "type": "doc",
          "id": "demos/integrations",
          "label": "Integrations"
        }
      ]
    }
  ],
};

export default sidebars;
