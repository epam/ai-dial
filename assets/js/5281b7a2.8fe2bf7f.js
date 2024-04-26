"use strict";(self.webpackChunkdial=self.webpackChunkdial||[]).push([[927],{2589:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>r,toc:()=>c});var i=n(5893),s=n(1151);const a={},o="Architecture",r={id:"architecture",title:"Architecture",description:"Our Vision",source:"@site/docs/architecture.md",sourceDirName:".",slug:"/architecture",permalink:"/architecture",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"CustomSideBar",previous:{title:"Quick Start",permalink:"/quick-start"},next:{title:"Launch AI DIAL Chat with a Sample Application",permalink:"/tutorials/quick-start-with-application"}},l={},c=[{value:"Our Vision",id:"our-vision",level:2},{value:"AI DIAL Architecture",id:"ai-dial-architecture",level:2},{value:"Minimal Installation",id:"minimal-installation",level:3},{value:"Standard Installation",id:"standard-installation",level:3},{value:"Full Platform Landscape",id:"full-platform-landscape",level:3},{value:"AI DIAL Components",id:"ai-dial-components",level:2},{value:"AI DIAL Core",id:"ai-dial-core",level:3},{value:"Authentication and Authorization",id:"authentication-and-authorization",level:4},{value:"Load Balancer",id:"load-balancer",level:4},{value:"Rate Limits &amp; Cost Control",id:"rate-limits--cost-control",level:4},{value:"Extension Framework",id:"extension-framework",level:4},{value:"Logging",id:"logging",level:4},{value:"Entitlements",id:"entitlements",level:4},{value:"Auth Helper",id:"auth-helper",level:3},{value:"Chat",id:"chat",level:3},{value:"Overlay",id:"overlay",level:4},{value:"Themes",id:"themes",level:4},{value:"Analytics Realtime",id:"analytics-realtime",level:3},{value:"Extensions",id:"extensions",level:2},{value:"LLM Adapters",id:"llm-adapters",level:3},{value:"Telemetry",id:"telemetry",level:2},{value:"Key Vault",id:"key-vault",level:2}];function d(e){const t={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"architecture",children:"Architecture"}),"\n",(0,i.jsx)(t.h2,{id:"our-vision",children:"Our Vision"}),"\n",(0,i.jsx)(t.p,{children:"AI DIAL is a secure, enterprise-grade and open-source platform. It has an API-first, cloud and model-agnostic design that makes it suitable for a wide variety of use cases.\nOur primary focus is to avoid reliance on particular cloud or LLM vendors, support scalability and security, avoid increasing tech complexity or licensing risks.\nWe prioritize developing use case-agnostic generic features that facilitate developing of GenAI applications."}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["To contribute to AI DIAL development, refer to ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial/blob/main/CONTRIBUTING.md",children:"CONTRIBUTING"})," instruction on GitHub."]}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"ai-dial-architecture",children:"AI DIAL Architecture"}),"\n",(0,i.jsx)(t.h3,{id:"minimal-installation",children:"Minimal Installation"}),"\n",(0,i.jsxs)(t.p,{children:["AI DIAL has only one required component \u2013 ",(0,i.jsx)(t.a,{href:"#ai-dial-core",children:"AI DIAL Core"}),"."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(6816).Z+"",width:"1276",height:"654"})}),"\n",(0,i.jsxs)(t.p,{children:["AI DIAL Core is headless. It exposes a ",(0,i.jsx)(t.strong,{children:"Unified Protocol"})," that can be used by custom extensions, internal and external API clients to get full access to all AI DIAL Core features."]}),"\n",(0,i.jsx)(t.p,{children:"Unified Protocol streamlines communication and fosters interoperability by eliminating the need for multiple protocols for each integration. It is fully compatible with OpenAI API and supports streaming, tokens, seeds, tools, and multi-modality."}),"\n",(0,i.jsx)(t.h3,{id:"standard-installation",children:"Standard Installation"}),"\n",(0,i.jsxs)(t.p,{children:["A ",(0,i.jsx)(t.strong,{children:"Standard"})," installation of AI DIAL includes, Core (including API), Chat and Adapters to selected LLMs. It can also include custom extension such as Applications, Addons or Assistants."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(583).Z+"",width:"1483",height:"911"})}),"\n",(0,i.jsx)(t.p,{children:"This configuration enables the utilization of Chat functionality, allowing users to engage with LLMs, as well as the integration of custom extensions with AI DIAL Core through the API."}),"\n",(0,i.jsx)(t.h3,{id:"full-platform-landscape",children:"Full Platform Landscape"}),"\n",(0,i.jsx)(t.p,{children:"The diagram below demonstrates the most complete landscape of AI DIAL ecosystem:"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"max-zoom",src:n(4740).Z+"",width:"2155",height:"2046"})}),"\n",(0,i.jsx)(t.h2,{id:"ai-dial-components",children:"AI DIAL Components"}),"\n",(0,i.jsx)(t.h3,{id:"ai-dial-core",children:"AI DIAL Core"}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-core",children:"DIAL Core"})," GitHub repository."]}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"AI DIAL Core"})," serves as the primary system component, acting as a ",(0,i.jsx)(t.strong,{children:"main integration center"}),", that employs a ",(0,i.jsx)(t.strong,{children:"Unified Protocol"})," (",(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/azure/ai-services/openai/reference",children:"OpenAI"})," compatible) for communication between internal and external clients, including LLM models, Applications, and other to access all its features in a governed and unified manner."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(6816).Z+"",width:"1276",height:"654"})}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"The Unified Protocol supports"}),":"]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Streaming"}),"\n",(0,i.jsx)(t.li,{children:"Token usage (even in the streaming mode)"}),"\n",(0,i.jsx)(t.li,{children:"Seeds: helps to achieve deterministic results for LLM responses."}),"\n",(0,i.jsx)(t.li,{children:"Tools: (formerly known as functions ) are specialized utilities that streamline development by implementing standardized methods for LLMs to access external APIs."}),"\n",(0,i.jsx)(t.li,{children:"Multi-modality: allows supporting non-textual communications such as image-to-text, text-to-image, file transfers and more."}),"\n",(0,i.jsx)(t.li,{children:"Compatibility with OpenAI"}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["This approach streamlines communication and fosters interoperability by eliminating the need for multiple protocols for each integration. In case of Addons, they are expected to provide own ",(0,i.jsx)(t.a,{href:"https://www.openapis.org/what-is-openapi",children:"OpenAPI specification"}),"."]}),"\n",(0,i.jsxs)(t.p,{children:["AI DIAL Core is headless and is the ",(0,i.jsx)(t.strong,{children:"only mandatory component"}),". It includes all the key platform features:"]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(8867).Z+"",width:"521",height:"527"})}),"\n",(0,i.jsx)(t.h4,{id:"authentication-and-authorization",children:"Authentication and Authorization"}),"\n",(0,i.jsxs)(t.p,{children:["AI DIAL provides native support for ",(0,i.jsx)(t.a,{href:"https://openid.net/developers/how-connect-works/",children:"OpenID Connect"})," and ",(0,i.jsx)(t.a,{href:"https://oauth.net/2/",children:"OAuth2"})," and offers integration with various Identity Providers (IDP) such as Azure AD, Auth0, and Cognito where you can define user roles and attributes to support your custom permissions model. Additionally, you can leverage Keycloak to work with even wider range of IDPs."]}),"\n",(0,i.jsx)(t.p,{children:"There are two methods of CORE API calls authorization supported: JWT token and key. Both options provide granular permission management, allowing you to control access to specific functionalities or resources. Additionally, these authorization methods also enable rate and cost control, giving you the ability to manage the frequently of API calls."}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"/tutorials/roles-management",children:"Roles Management"})," to learn how to create roles and add them to AI DIAL."]}),"\n"]}),"\n",(0,i.jsx)(t.h4,{id:"load-balancer",children:"Load Balancer"}),"\n",(0,i.jsx)(t.p,{children:"For self-hosted models, you can use the standard load balancer (LB) capabilities provided by the target cloud platform. As for cloud-deployed models like Azure OpenAI and others, we typically rely on our custom-developed load balancing solution."}),"\n",(0,i.jsx)(t.p,{children:"In this approach, a configuration file includes multiple upstream endpoints for a model. When a request is received, it is forwarded to one of the endpoints using the round-robin method. If an upstream returns an overload limit error such as a 429 (Too Many Requests) or a 504 (Gateway Timeout), the system attempts another upstream and temporarily excludes the one that generated the error. This strategy ensures efficient load distribution and fault tolerance for optimal performance and reliability."}),"\n",(0,i.jsx)(t.h4,{id:"rate-limits--cost-control",children:"Rate Limits & Cost Control"}),"\n",(0,i.jsx)(t.p,{children:"A well-distributed rate-limiting mechanism ensures the control over the total number of tokens that can be sent to a model (typically a one-minute or 24-hour window) by any Application, Addon, or Assistant."}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"/Deployment/configuration#some-of-the-dynamic-parameters",children:"AI DIAL Configuration"})," to learn more about roles and rate limits."]}),"\n"]}),"\n",(0,i.jsx)(t.h4,{id:"extension-framework",children:"Extension Framework"}),"\n",(0,i.jsx)(t.p,{children:"AI DIAL presents a robust Extension Framework and plug-in infrastructure, enabling seamless integration of your data and business workflows with Language Models (LLM) to enrich your enterprise applications."}),"\n",(0,i.jsxs)(t.p,{children:["You can use AI DIAL SDK to develop such extensions. Applications and model Adapters implemented using this framework will be compatible with ",(0,i.jsx)(t.a,{href:"https://epam-rail.com/dial_api",children:"AI DIAL API"})," that was designed based on ",(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/azure/ai-services/openai/reference",children:"Azure OpenAI API"}),"."]}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-sdk",children:"AI DIAL SDK"})," and ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-sdk/tree/development/examples",children:"Development Examples"})," to learn more."]}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Addon"}),": Addon is similar to a concept of tool or function in some other frameworks. Within the AI DIAL framework, an Addon is a service \u2014 or any component adhering to its own or provided ",(0,i.jsx)(t.a,{href:"https://www.openapis.org/what-is-openapi",children:"OpenAPI specification"})," \u2014 that empowers LLMs to access and utilize any desired data source or technology to produce their responses."]}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Application"}),": any custom logic with a conversation interface packaged as a ready-to-use solution. It can be any component conforming with Unified Protocol requirements."]}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"The Assistant Service"})," is used to enable communication between Addons and the AI DIAL Core. Assistants can range from simple implementations, like instructing the LLM to provide answers using a specific language tone or style, to more complex use cases, such as limiting the LLM's data scope to a particular geographical location."]}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Adapter"}),": unifies APIs of respective LLMs to align with the Unified Protocol of AI DIAL Core."]}),"\n",(0,i.jsx)(t.h4,{id:"logging",children:"Logging"}),"\n",(0,i.jsxs)(t.p,{children:["AI DIAL Core uses ",(0,i.jsx)(t.a,{href:"https://vector.dev/docs/reference/configuration/sinks/",children:"Vector"}),' (a lightweight, ultra-fast tool for building observability pipelines) to redirect users\u2019 messages to S3, Azure Blob Store, GCP Cloud Storage or any other "sink".']}),"\n",(0,i.jsx)(t.p,{children:"You can gather standard logs (which do not contain user messages) from components using the ELK stack (Elasticsearch, Logstash, Kibana) or other log collection system."}),"\n",(0,i.jsx)(t.h4,{id:"entitlements",children:"Entitlements"}),"\n",(0,i.jsx)(t.p,{children:"In AI DIAL Core, user roles are defined and configured in the application config file. This allows administrators to specify which users or user groups are authorized to access specific resources or features within the application. These user roles match the once created in your IDP."}),"\n",(0,i.jsx)(t.h3,{id:"auth-helper",children:"Auth Helper"}),"\n",(0,i.jsxs)(t.p,{children:["Auth Helper is used to resolve challenges (such as access control issues with the ",(0,i.jsx)(t.code,{children:"/userinfo"})," endpoint and retrieving user profile pictures) that may arise during integration with IDPs like Azure AD."]}),"\n",(0,i.jsx)(t.p,{children:"It is a proxy service that implements OpenID-compatible Web API endpoints to avoid direct interaction with such IDPs."}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-auth-helper",children:"AI DIAL Auth Helper"})," repository in GitHub to learn more."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"chat",children:"Chat"}),"\n",(0,i.jsx)(t.p,{children:"Chat is a default AI DIAL UI which provides access to the full set of its features."}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-chat",children:"Chat"})," repository in GitHub to learn more."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(682).Z+"",width:"1376",height:"1018"})}),"\n",(0,i.jsx)(t.h4,{id:"overlay",children:"Overlay"}),"\n",(0,i.jsx)(t.p,{children:"UI Overlay allows adding Chat to a web application with zero effort by simply inserting a short HTML block."}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-html",children:'<html>\n  <head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  </head>\n  <body>\n    <script type="module">\n      import CHATAIOverlay from "./script.js";\n\n      const chatAiOverlay = new CHATAIOverlay("http://localhost:3000");\n      chatAiOverlay.load();\n    <\/script>\n  </body>\n</html>\n'})}),"\n",(0,i.jsx)(t.h4,{id:"themes",children:"Themes"}),"\n",(0,i.jsx)(t.p,{children:"Chat Themes are used to customize the styles of Chat UI."}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-chat-themes",children:"AI DIAL Chat Themes"})," GitHub repository to learn more."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"analytics-realtime",children:"Analytics Realtime"}),"\n",(0,i.jsx)(t.p,{children:"The AI DIAL Analytics Realtime tool uses diverse techniques such as embedding algorithms, clustering algorithms, frameworks, light-weight self-hosted language models, to analyze the conversation data and extract the needed results, which can be presented in tools such as Grafana for visualization."}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-analytics-realtime",children:"Analytics Realtime"})," GitHub repository."]}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["Analytics Realtime tool is a sink of ",(0,i.jsx)(t.code,{children:"vector.dev"}),". It does not retain any private information, such as user prompts or conversations, beyond the system. Instead, only the computed artifacts are collected and stored in time-series databases like InfluxDB or any scalable database capable of handling voluminous, constantly changing information."]}),"\n",(0,i.jsx)(t.p,{children:"Examples of the computed artifacts:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Who has used the AI? \u2013 user hash, title, and never personal data such as names."}),"\n",(0,i.jsx)(t.li,{children:"What areas have people asked questions about?"}),"\n",(0,i.jsx)(t.li,{children:"Are there any recurring patterns?"}),"\n",(0,i.jsx)(t.li,{children:"Topics of conversations."}),"\n",(0,i.jsx)(t.li,{children:"Unique users."}),"\n",(0,i.jsx)(t.li,{children:"Sentiments."}),"\n",(0,i.jsx)(t.li,{children:"Cost analysis of the communication."}),"\n",(0,i.jsx)(t.li,{children:"Language of conversations."}),"\n",(0,i.jsx)(t.li,{children:"Any other calculated statistics based on conversations."}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"extensions",children:"Extensions"}),"\n",(0,i.jsx)(t.p,{children:"Extensions such as Applications, Addons, Assistants and Adapters can be additionally developed and deployed to communicate with the AI DIAL Core via the Unified Protocol."}),"\n",(0,i.jsxs)(t.p,{children:["You can use AI DIAL SDK to develop such extensions. Applications and model Adapters implemented using this framework will be compatible with ",(0,i.jsx)(t.a,{href:"https://epam-rail.com/dial_api",children:"AI DIAL API"})," that was designed based on the ",(0,i.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/azure/ai-services/openai/reference",children:"Azure OpenAI API"}),"."]}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-sdk",children:"AI DIAL SDK"})," and ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-sdk/tree/development/examples",children:"Development Examples"})," to learn more."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(6816).Z+"",width:"1276",height:"654"})}),"\n",(0,i.jsxs)(t.p,{children:["Extensions have freedom to employ a technology of their preference, be it any LLM framework, ",(0,i.jsx)(t.a,{href:"https://github.com/run-llama/llama_index/tree/main",children:"LlamaIndex"}),", ",(0,i.jsx)(t.a,{href:"https://github.com/langchain-ai/langchain",children:"LangChain"}),", ",(0,i.jsx)(t.a,{href:"https://github.com/microsoft/semantic-kernel?tab=readme-ov-file",children:"Semantic Kernel"}),", vector DBs or any other."]}),"\n",(0,i.jsx)(t.h3,{id:"llm-adapters",children:"LLM Adapters"}),"\n",(0,i.jsx)(t.p,{children:"LLM Adapters unify the APIs of respective LLMs to align with the Unified Protocol of AI DIAL Core. Each Adapter operates within a dedicated container. Multi-modality allows supporting non-textual communications such as image-to-text, text-to-image, file transfers and more."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:n(9979).Z+"",width:"1666",height:"728"})}),"\n",(0,i.jsxs)(t.blockquote,{children:["\n",(0,i.jsxs)(t.p,{children:["Refer to ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-adapter-openai",children:"Azure OpenAI"}),", ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-adapter-vertexai",children:"GCP Vertex AI"})," and ",(0,i.jsx)(t.a,{href:"https://github.com/epam/ai-dial-adapter-bedrock",children:"AWS Bedrock AI DIAL"})," repositories in GitHub."]}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"telemetry",children:"Telemetry"}),"\n",(0,i.jsxs)(t.p,{children:["AI DIAL uses ",(0,i.jsx)(t.a,{href:"https://opentelemetry.io/",children:"OpenTelemetry"}),", an open-source observability framework that provides a vendor-agnostic, unified approach to collecting, processing, and exporting telemetry data in cloud-native environments."]}),"\n",(0,i.jsx)(t.p,{children:"Metrics are gathered for the entire system and/or for individual system components, and subsequently stored in a time-series databases like Prometheus or any other database capable of handling substantial volumes of time-series data and integrating with visualization tools like Grafana."}),"\n",(0,i.jsx)(t.p,{children:"You can use any OTLE Collector such as Prometheus, Jaeger, Fluentd, Zipkin and other."}),"\n",(0,i.jsx)(t.h2,{id:"key-vault",children:"Key Vault"}),"\n",(0,i.jsx)(t.p,{children:"All sensitive information is stored according to the best practices of the selected cloud platform, utilizing systems like GCP Cloud Key Management Service, AWS Secrets Manager, Azure Key Vault, and Vault by Hashicorp."})]})}function h(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},9979:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/adapters-9008f452ec61ac69d054efda957a047b.svg"},682:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/chat-c4098e8d8248c876beb822ffe1d8c480.svg"},8867:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/core-5241d5af83677fc05b5d3b292dcf7fae.svg"},4740:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/full-landscape3-df6ad5d391a594e6faadbe7b355b333c.svg"},6816:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/minimal2-1e1a004efc5d4282f25dbb5a8d96d6e1.svg"},583:(e,t,n)=>{n.d(t,{Z:()=>i});const i=n.p+"assets/images/standard2-dc74099fb3201096e0b684e8cc427500.svg"},1151:(e,t,n)=>{n.d(t,{Z:()=>r,a:()=>o});var i=n(7294);const s={},a=i.createContext(s);function o(e){const t=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),i.createElement(a.Provider,{value:t},e.children)}}}]);