**ai-dial-core**

Add assistantAttachmentsInRequestSupported to application schema (allows to build application types which will be able to get file content from previous responses).
Support WebSocket protocol in custom routes
Support proxy while connecting to MCP server 
Add Support for Toolsets with Authentication in DIAL Config (not only for Toolsets created programatically or from UI)

**ai-dial-chat**

Add option to login into toolsets with personal creds for admin
Add support for several IdP providers with same type
Support checkboxes in message form schemas (you can create not only button from application but checkboxes too)

**adapters**

Add models Llama 4 Scout 17B and Llama 4 Maverick 17B
Introduce envrironment variables in vertex and bedrock adapter to control retries in http client (major retry functionality should be handled by load balancer logic in core)
Gemini 2.0 Flash Exp: support image generation
Gemini: support image generation configuration
Support Gemini 3 Pro Image and Gemini 2.5 Flash Image stable model id
Support Gemini 3 Pro model

**admin**

Add import/export functionality for application assets
Add import/export functionality for toolset assets
[Export page] Add topics filter
[Publications] Add readonly Json editor
Deployment Manager became part of main admin UI.

**dial-rag**

Use structured output in description retriever 

