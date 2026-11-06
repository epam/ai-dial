import { V2_SECTIONS, V2_SECTION_KEYS } from './docs.config.js';

/** Full NEW sidebar — every top-level section, unfiltered. */
const allSections = [
    {
      "type": "category",
      "label": "Home",
      "items": [
        {
          "type": "doc",
          "id": "home/index",
          "label": "Overview"
        }
      ]
    },
    {
      "type": "category",
      "label": "Understand DIAL",
      "items": [
        {
          "type": "doc",
          "id": "understand-dial/index",
          "label": "Overview"
        },
        {
          "type": "doc",
          "id": "understand-dial/what-is-dial",
          "label": "What is DIAL"
        },
        {
          "type": "category",
          "label": "Foundations",
          "items": [
            {
              "type": "doc",
              "id": "understand-dial/foundations/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "understand-dial/foundations/concept-map",
              "label": "Concept map"
            },
            {
              "type": "doc",
              "id": "understand-dial/foundations/glossary",
              "label": "Glossary"
            },
            {
              "type": "doc",
              "id": "understand-dial/foundations/dial-evolution",
              "label": "DIAL evolution"
            }
          ]
        },
        {
          "type": "category",
          "label": "Capabilities",
          "items": [
            {
              "type": "doc",
              "id": "understand-dial/capabilities/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/model-access-and-ai-apis",
              "label": "Model access and AI APIs"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/multimodality",
              "label": "Multimodality"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/load-balancing-and-failover",
              "label": "Load balancing and failover"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/guardrails",
              "label": "Guardrails"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/analytics-and-observability",
              "label": "Analytics and observability"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/tools-and-enterprise-data",
              "label": "Tools and enterprise data"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/agentic-platform",
              "label": "Agentic platform"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/coding-agents-and-harnesses",
              "label": "Coding agents and harnesses"
            },
            {
              "type": "doc",
              "id": "understand-dial/capabilities/evaluations",
              "label": "Evaluations"
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
          "label": "Architecture",
          "items": [
            {
              "type": "doc",
              "id": "understand-dial/architecture/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/architecture-highlights",
              "label": "Architecture highlights"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/request-flow",
              "label": "Request flow"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/deployment-profiles",
              "label": "Deployment profiles"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/state-and-data-lifecycle",
              "label": "State and data lifecycle"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/reliability-and-performance",
              "label": "Reliability and performance"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/application-server",
              "label": "Application hosting and lifecycle"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/ai-api-overview",
              "label": "AI API overview"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/trade-offs-and-limitations",
              "label": "Trade-offs and limitations"
            },
            {
              "type": "doc",
              "id": "understand-dial/architecture/dial-stack",
              "label": "DIAL Stack"
            }
          ]
        },
        {
          "type": "category",
          "label": "Security and governance",
          "items": [
            {
              "type": "doc",
              "id": "understand-dial/security-and-governance/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "understand-dial/security-and-governance/authentication-and-access-control",
              "label": "Authentication and access control"
            },
            {
              "type": "doc",
              "id": "understand-dial/security-and-governance/authorization-rules-and-spaces",
              "label": "Authorization rules and spaces"
            },
            {
              "type": "doc",
              "id": "understand-dial/security-and-governance/public-and-private-access",
              "label": "Public and private access"
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
            },
            {
              "type": "doc",
              "id": "understand-dial/security-and-governance/data-protection-and-isolation",
              "label": "Data protection and isolation"
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
                  "type": "doc",
                  "id": "building-with-dial/apps/quick-apps/tutorial-build-an-agent",
                  "label": "Tutorial: build an agent"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/apps/quick-apps/create-via-api",
                  "label": "Create through the API"
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
            },
            {
              "type": "doc",
              "id": "building-with-dial/apps/generic-rag-document-qa",
              "label": "Build a document Q&A app with Generic RAG"
            }
          ]
        },
        {
          "type": "category",
          "label": "Toolsets",
          "items": [
            {
              "type": "doc",
              "id": "building-with-dial/toolsets/index",
              "label": "What is a Toolset"
            },
            {
              "type": "doc",
              "id": "building-with-dial/toolsets/mcp-server-integration",
              "label": "Integrate an MCP server"
            },
            {
              "type": "doc",
              "id": "building-with-dial/toolsets/rest-api-as-mcp-tools",
              "label": "Expose a REST API as MCP tools"
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
                  "id": "building-with-dial/interceptors/sdk-integration-reference",
                  "label": "SDK integration reference"
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
                  "id": "building-with-dial/developer-tools/chat-customization/catalog",
                  "label": "Catalog"
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
            },
            {
              "type": "category",
              "label": "UI libraries",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/ui-libraries/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/ui-libraries/ui-kit",
                  "label": "UI Kit"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/ui-libraries/file-manager",
                  "label": "File Manager"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/developer-tools/ui-libraries/pdf-highlighter",
                  "label": "PDF Highlighter"
                },
                {
                  "type": "category",
                  "label": "Releases",
                  "items": [
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/ui-libraries/releases/ui-kit-v0.16.0",
                      "label": "UI Kit 0.16.0"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/ui-libraries/releases/ui-kit-v0.15.0",
                      "label": "UI Kit 0.15.0"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/ui-libraries/releases/file-manager-v0.4.0",
                      "label": "File Manager 0.4.0"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/ui-libraries/releases/file-manager-v0.3.0",
                      "label": "File Manager 0.3.0"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/ui-libraries/releases/pdf-highlighter-v0.3.0",
                      "label": "PDF Highlighter 0.3.0"
                    },
                    {
                      "type": "doc",
                      "id": "building-with-dial/developer-tools/ui-libraries/releases/pdf-highlighter-v0.2.0",
                      "label": "PDF Highlighter 0.2.0"
                    }
                  ]
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
            },
            {
              "type": "category",
              "label": "Agentic tools",
              "items": [
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/agentic-tools/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/agentic-tools/codex",
                  "label": "Connect Codex to DIAL"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/agentic-tools/github-copilot",
                  "label": "Connect GitHub Copilot to DIAL"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/agentic-tools/open-claw",
                  "label": "Connect Open Claw to DIAL"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/agentic-tools/opencode",
                  "label": "Connect OpenCode to DIAL"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/agentic-tools/claude-code",
                  "label": "Connect Claude Code to DIAL"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/agentic-tools/claude-cowork",
                  "label": "Connect Claude Cowork to DIAL"
                },
                {
                  "type": "doc",
                  "id": "building-with-dial/integrations/agentic-tools/claude-m365-plugin",
                  "label": "Connect the Claude M365 plugin to DIAL"
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
          "type": "doc",
          "id": "operating-dial/index",
          "label": "Overview"
        },
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
            },
            {
              "type": "doc",
              "id": "operating-dial/cloud-deployment/admin-installation",
              "label": "DIAL Admin"
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
              "type": "doc",
              "id": "operating-dial/configuration/auth-helper-configuration",
              "label": "Auth Helper"
            },
            {
              "type": "doc",
              "id": "operating-dial/configuration/realm-config-json",
              "label": "Keycloak (realm-config.json)"
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
              "id": "operating-dial/observability/configure-metrics",
              "label": "Configure metrics"
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
          "id": "administering-dial-new/index",
          "label": "Overview"
        },
        {
          "type": "doc",
          "id": "administering-dial-new/config-backup-and-global-settings",
          "label": "Backup, restore & global settings"
        },
        {
          "type": "category",
          "label": "AI Gateway",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial-new/ai-gateway/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/ai-gateway/models",
              "label": "Models"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/ai-gateway/toolsets",
              "label": "Toolsets"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/ai-gateway/translators",
              "label": "Translators"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/ai-gateway/routes",
              "label": "Routes"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/ai-gateway/applications",
              "label": "Applications"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/ai-gateway/application-runners",
              "label": "App Runners"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/ai-gateway/catalog-schemas",
              "label": "Catalog Schemas"
            },
          ]
        },
        {
          "type": "category",
          "label": "Artifacts",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial-new/artifacts/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/artifacts/skills",
              "label": "Skills"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/artifacts/files",
              "label": "Files"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/artifacts/conversations",
              "label": "Conversations"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/artifacts/prompts",
              "label": "Prompts"
            }
          ]
        },
        {
          "type": "category",
          "label": "Deployments",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial-new/deployments/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/deployments/model-servings",
              "label": "Model Servings"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/deployments/container-management",
              "label": "Containers"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/deployments/images",
              "label": "Images"
            }
          ]
        },

        {
          "type": "category",
          "label": "Evaluation",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial-new/evaluation/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/evaluation/test-suites",
              "label": "Test suites"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/evaluation/runs",
              "label": "Runs"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/evaluation/datasets",
              "label": "Datasets"
            }
          ]
        },

        {
          "type": "category",
          "label": "Analytics",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial-new/analytics/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/analytics/dashboards",
              "label": "Dashboards"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/analytics/queries",
              "label": "Queries"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/analytics/sessions",
              "label": "Sessions"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/analytics/tables",
              "label": "Tables"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/analytics/pipelines",
              "label": "Pipelines"
            },
          ]
        },
        {
          "type": "category",
          "label": "Governance",
          "items": [
            {
              "type": "doc",
              "id": "administering-dial-new/governance/roles",
              "label": "Roles"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/governance/keys",
              "label": "Keys"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/governance/folders-storage",
              "label": "Folder Permissions"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/governance/interceptors",
              "label": "Interceptors"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/governance/publications-and-review",
              "label": "Approvals"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/governance/user-management",
              "label": "User management"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/governance/usage-limits-and-cost-control",
              "label": "Usage limits and cost control"
            },
            {
              "type": "doc",
              "id": "administering-dial-new/governance/compliance-and-legal-faq",
              "label": "Compliance and legal FAQ"
            },
          ]
        },
      ]
    },
    {
      "type": "category",
      "label": "Services",
      "items": [
        {
          "type": "doc",
          "id": "services/index",
          "label": "Overview"
        },
        {
          "type": "category",
          "label": "DIAL Core",
          "items": [
            {
              "type": "doc",
              "id": "services/core/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/core/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/configuration-api",
                  "label": "Configuration API"
                },
                {
                  "type": "category",
                  "label": "Static settings",
                  "items": [
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/index",
                      "label": "Overview"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/server-and-client",
                      "label": "Server and client"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/storage",
                      "label": "Storage"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/redis",
                      "label": "Redis"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/identity-providers",
                      "label": "Identity providers"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/encryption",
                      "label": "Encryption"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/resources",
                      "label": "Resources"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/access",
                      "label": "Access"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/applications-and-code-interpreter",
                      "label": "Applications and Code Interpreter"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/config-loading",
                      "label": "Config loading"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/toolsets-security",
                      "label": "Toolsets security"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/analytics-and-tracing",
                      "label": "Analytics and tracing"
                    },
                    {
                      "type": "doc",
                      "id": "services/core/configuration/settings/background-jobs",
                      "label": "Background jobs"
                    }
                  ]
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/gflog-xml",
                  "label": "gflog.xml"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/models",
                  "label": "Models"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/load-balancing",
                  "label": "Load balancing and upstreams"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/translators",
                  "label": "Translators"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/applications",
                  "label": "Applications"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/application-type-schemas",
                  "label": "Application type schemas"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/interceptors",
                  "label": "Interceptors"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/routes",
                  "label": "Routes"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/toolsets",
                  "label": "Toolsets"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/roles",
                  "label": "Roles"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/keys",
                  "label": "Keys"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/global-settings",
                  "label": "Global settings"
                },
                {
                  "type": "doc",
                  "id": "services/core/configuration/catalog-schemas",
                  "label": "Catalog schemas"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Chat",
          "items": [
            {
              "type": "doc",
              "id": "services/chat/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/chat/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/chat/configuration/server-and-dial-core",
                  "label": "Server and DIAL Core"
                },
                {
                  "type": "doc",
                  "id": "services/chat/configuration/authentication",
                  "label": "Authentication"
                },
                {
                  "type": "doc",
                  "id": "services/chat/configuration/features-and-ui",
                  "label": "Features and UI"
                },
                {
                  "type": "doc",
                  "id": "services/chat/configuration/models-and-generation",
                  "label": "Models and generation"
                },
                {
                  "type": "doc",
                  "id": "services/chat/configuration/files-and-limits",
                  "label": "Files and limits"
                },
                {
                  "type": "doc",
                  "id": "services/chat/configuration/security-and-embedding",
                  "label": "Security and embedding"
                },
                {
                  "type": "doc",
                  "id": "services/chat/configuration/observability",
                  "label": "Observability"
                }
              ]
            },
            {
              "type": "category",
              "label": "Chat Overlay",
              "items": [
                {
                  "type": "doc",
                  "id": "services/chat/chat-overlay/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/chat/chat-overlay/embed-dial-chat",
                  "label": "Embed DIAL Chat in a web page"
                },
                {
                  "type": "doc",
                  "id": "services/chat/chat-overlay/overlay-api",
                  "label": "Chat Overlay API"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Chat Themes",
          "items": [
            {
              "type": "doc",
              "id": "services/chat-themes/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "services/chat-themes/configuration",
              "label": "Themes configuration"
            },
            {
              "type": "doc",
              "id": "services/chat-themes/create-a-custom-theme",
              "label": "Create a custom theme"
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL OpenAI Adapter",
          "items": [
            {
              "type": "doc",
              "id": "services/openai-adapter/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "services/openai-adapter/supported-upstreams",
              "label": "Supported upstreams"
            },
            {
              "type": "doc",
              "id": "services/openai-adapter/capabilities",
              "label": "Capabilities"
            },
            {
              "type": "doc",
              "id": "services/openai-adapter/configuration",
              "label": "Configuration"
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Bedrock Adapter",
          "items": [
            {
              "type": "doc",
              "id": "services/bedrock-adapter/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "services/bedrock-adapter/supported-models",
              "label": "Supported models"
            },
            {
              "type": "doc",
              "id": "services/bedrock-adapter/capabilities",
              "label": "Capabilities"
            },
            {
              "type": "doc",
              "id": "services/bedrock-adapter/configuration",
              "label": "Configuration"
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Vertex AI Adapter",
          "items": [
            {
              "type": "doc",
              "id": "services/vertex-ai-adapter/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "services/vertex-ai-adapter/supported-models",
              "label": "Supported models"
            },
            {
              "type": "doc",
              "id": "services/vertex-ai-adapter/capabilities",
              "label": "Capabilities"
            },
            {
              "type": "doc",
              "id": "services/vertex-ai-adapter/configuration",
              "label": "Configuration"
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Quick Apps",
          "items": [
            {
              "type": "doc",
              "id": "services/quick-apps/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "Capabilities",
              "items": [
                {
                  "type": "doc",
                  "id": "services/quick-apps/capabilities/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/capabilities/orchestration",
                  "label": "Orchestration"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/capabilities/tools",
                  "label": "Tools"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/capabilities/contexts-and-files",
                  "label": "Contexts and files"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/capabilities/skills",
                  "label": "Skills"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/capabilities/hooks",
                  "label": "Hooks"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/capabilities/time-awareness",
                  "label": "Time awareness"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/capabilities/errors",
                  "label": "Errors"
                }
              ]
            },
            {
              "type": "category",
              "label": "Manifest",
              "items": [
                {
                  "type": "doc",
                  "id": "services/quick-apps/manifest/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/manifest/orchestrator",
                  "label": "Orchestrator"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/manifest/tool-sets",
                  "label": "Tool sets"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/manifest/tools",
                  "label": "Tools"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/manifest/examples",
                  "label": "Examples"
                }
              ]
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/quick-apps/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/configuration/backend",
                  "label": "Backend"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/configuration/frontend",
                  "label": "Frontend"
                },
                {
                  "type": "doc",
                  "id": "services/quick-apps/configuration/dial-core-and-chat",
                  "label": "DIAL Core and DIAL Chat"
                }
              ]
            },
            {
              "type": "doc",
              "id": "services/quick-apps/chathub",
              "label": "ChatHub"
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Admin",
          "items": [
            {
              "type": "doc",
              "id": "services/admin/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "services/admin/capabilities",
              "label": "Capabilities"
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/admin/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/admin/configuration/frontend",
                  "label": "Admin Frontend"
                },
                {
                  "type": "doc",
                  "id": "services/admin/configuration/backend",
                  "label": "Admin Backend (optional)"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Evaluations",
          "items": [
            {
              "type": "doc",
              "id": "services/evaluations/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/evaluations/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/evaluations/configuration/framework-backend",
                  "label": "Framework Backend"
                },
                {
                  "type": "doc",
                  "id": "services/evaluations/configuration/metrics",
                  "label": "Metrics"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Deployment Manager",
          "items": [
            {
              "type": "doc",
              "id": "services/deployment-manager/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/deployment-manager/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/deployment-manager/configuration/backend",
                  "label": "Backend"
                },
                {
                  "type": "doc",
                  "id": "services/deployment-manager/configuration/mcp-proxy",
                  "label": "MCP proxy"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Helm",
          "items": [
            {
              "type": "doc",
              "id": "services/helm/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/helm/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/helm/configuration/dial",
                  "label": "Platform chart"
                },
                {
                  "type": "doc",
                  "id": "services/helm/configuration/dial-core",
                  "label": "Core chart"
                },
                {
                  "type": "doc",
                  "id": "services/helm/configuration/dial-extension",
                  "label": "Extension chart"
                },
                {
                  "type": "doc",
                  "id": "services/helm/configuration/dial-admin",
                  "label": "Admin chart"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL OpenAPI to MCP",
          "items": [
            {
              "type": "doc",
              "id": "services/openapi-to-mcp/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/openapi-to-mcp/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/openapi-to-mcp/configuration/environment-variables",
                  "label": "Environment variables"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL RAG",
          "items": [
            {
              "type": "doc",
              "id": "services/rag/index",
              "label": "Overview"
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/rag/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/rag/configuration/environment-variables",
                  "label": "Environment variables"
                }
              ]
            },
            {
              "type": "doc",
              "id": "services/rag/api",
              "label": "API"
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Generic RAG",
          "items": [
            {
              "type": "doc",
              "id": "services/generic-rag/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "services/generic-rag/channel-configuration",
              "label": "Channel configuration"
            },
            {
              "type": "doc",
              "id": "services/generic-rag/channel-api",
              "label": "Channel API"
            },
            {
              "type": "doc",
              "id": "services/generic-rag/mcp-server",
              "label": "MCP server"
            },
            {
              "type": "category",
              "label": "Configuration",
              "items": [
                {
                  "type": "doc",
                  "id": "services/generic-rag/configuration/index",
                  "label": "Overview"
                },
                {
                  "type": "doc",
                  "id": "services/generic-rag/configuration/backend",
                  "label": "Backend"
                },
                {
                  "type": "doc",
                  "id": "services/generic-rag/configuration/frontend",
                  "label": "Frontend"
                }
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL App Controller",
          "items": [
            {
              "type": "doc",
              "id": "services/app-controller/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "services/app-controller/configuration",
              "label": "Configuration"
            },
            {
              "type": "doc",
              "id": "services/app-controller/api",
              "label": "API"
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL App Builder Python",
          "items": [
            {
              "type": "doc",
              "id": "services/app-builder-python/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "services/app-builder-python/configuration",
              "label": "Configuration"
            }
          ]
        },
        {
          "type": "category",
          "label": "DIAL Code Interpreter",
          "items": [
            {
              "type": "doc",
              "id": "services/code-interpreter/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "services/code-interpreter/configuration",
              "label": "Configuration"
            },
            {
              "type": "doc",
              "id": "services/code-interpreter/api",
              "label": "API"
            }
          ]
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
          "id": "chat-user-guide/scheduled-tasks",
          "label": "Scheduled tasks"
        },
        {
          "type": "category",
          "label": "Catalog",
          "items": [
            {
              "type": "doc",
              "id": "chat-user-guide/catalog/index",
              "label": "Overview"
            },
            {
              "type": "doc",
              "id": "chat-user-guide/catalog/models",
              "label": "Models"
            },
            {
              "type": "doc",
              "id": "chat-user-guide/catalog/agents",
              "label": "Agents"
            },
            {
              "type": "doc",
              "id": "chat-user-guide/catalog/toolsets",
              "label": "Toolsets"
            },
            {
              "type": "doc",
              "id": "chat-user-guide/catalog/skills",
              "label": "Skills"
            },
            {
              "type": "doc",
              "id": "chat-user-guide/catalog/prompts",
              "label": "Prompts"
            }
          ]
        },
        {
          "type": "doc",
          "id": "chat-user-guide/files",
          "label": "File Manager"
        },
        {
          "type": "doc",
          "id": "chat-user-guide/sharing-and-publishing",
          "label": "Sharing and publishing"
        },
        {
          "type": "doc",
          "id": "chat-user-guide/usage-and-settings",
          "label": "Usage and settings"
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
          "id": "services/core/configuration/index",
          "label": "DIAL Core configuration"
        },
        {
          "type": "ref",
          "id": "understand-dial/foundations/glossary",
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
              "dirName": "8.reference/changelog"
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
];

// Filter top-level sections by the configured visibility (default: all).
// A section whose label is registered in the V2_SECTIONS catalog shows only when
// its key is selected. A top-level item NOT in the catalog is kept (so nothing is
// hidden by accident) but warns — that usually means the catalog and this sidebar
// drifted apart (add the section to docs.config.js V2_SECTIONS).
const labelToKey = Object.fromEntries(V2_SECTIONS.map((s) => [s.label, s.key]));
const v2Sidebar = allSections.filter((item) => {
  const key = labelToKey[item.label];
  if (key === undefined) {
    console.warn(
      `[sidebars-v2] Top-level section "${item.label}" is not registered in ` +
        `docs.config.js V2_SECTIONS; showing it unconditionally. ` +
        `Add it to V2_SECTIONS so it can be toggled.`,
    );
    return true;
  }
  return V2_SECTION_KEYS.includes(key);
});

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = { v2Sidebar };

export default sidebars;
