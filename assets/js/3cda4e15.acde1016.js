"use strict";(self.webpackChunkdial=self.webpackChunkdial||[]).push([[6122],{7577:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var i=t(5893),s=t(1151);const r={},a="Configuration",o={id:"Deployment/configuration",title:"configuration",description:"Important: it is assumed that you have a working knowledge of standard Helm chart parameters in order to define them within the configuration file.",source:"@site/docs/Deployment/configuration.md",sourceDirName:"Deployment",slug:"/Deployment/configuration",permalink:"/Deployment/configuration",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"CustomSideBar",previous:{title:"AI DIAL Chat Design Structure Guidelines",permalink:"/chat-design"},next:{title:"auth0",permalink:"/Deployment/idp-configuration/auth0"}},l={},c=[{value:"General method of configuration",id:"general-method-of-configuration",level:2},{value:"Core Parameters",id:"core-parameters",level:2},{value:"Static settings",id:"static-settings",level:3},{value:"Dynamic settings",id:"dynamic-settings",level:3},{value:"Chat Parameters",id:"chat-parameters",level:2},{value:"Themes Parameters",id:"themes-parameters",level:2},{value:"Adapters Parameters",id:"adapters-parameters",level:2},{value:"Assistant Parameters",id:"assistant-parameters",level:2},{value:"Auth Helper Parameters",id:"auth-helper-parameters",level:2}];function h(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"configuration",children:"Configuration"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Important"}),": it is assumed that you have a working knowledge of standard Helm chart parameters in order to define them within the configuration file."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["This instruction assumes that you are installing and configuring applications using the latest official ",(0,i.jsx)(n.a,{href:"https://charts.epam-rail.com/",children:"dial"})," helm chart."]}),"\n",(0,i.jsxs)("div",{class:"docusaurus-ignore",children:[(0,i.jsx)(n.h1,{id:"table-of-contents",children:"Table of Contents"}),(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"#general-method-of-configuration",children:"General method of configuration"})}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"#core-parameters",children:"Core Parameters"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"#static-settings",children:"Static settings"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"#dynamic-settings",children:"Dynamic settings"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"#chat-parameters",children:"Chat Parameters"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"#themes-parameters",children:"Themes Parameters"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"#adapters-parameters",children:"Adapters Parameters"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"#assistant-parameters",children:"Assistant Parameters"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"#auth-helper-parameters",children:"Auth Helper Parameters"})}),"\n"]})]}),"\n",(0,i.jsx)(n.h2,{id:"general-method-of-configuration",children:"General method of configuration"}),"\n",(0,i.jsxs)(n.p,{children:["AI DIAL helm chart contains various applications, and, to configure them, it is necessary to make corresponding changes to different sections of the ",(0,i.jsx)(n.strong,{children:"values"})," file."]}),"\n",(0,i.jsxs)(n.p,{children:["To add environment variables to AI DIAL application, you can use either ",(0,i.jsx)(n.code,{children:"env"})," or ",(0,i.jsx)(n.code,{children:"secrets"})," section in specific components, e.g ",(0,i.jsx)(n.code,{children:"core.env"}),", ",(0,i.jsx)(n.code,{children:"openai.secrets"})]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples",children:"helm chart repository"})," to view selected configuration examples."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"core-parameters",children:"Core Parameters"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-core",children:"AI DIAL Core"})," to view a complete documentation."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Configure AI DIAL Core parameters in the ",(0,i.jsx)(n.code,{children:"core"})," section of the values file."]}),"\n",(0,i.jsxs)(n.p,{children:["You can provide ",(0,i.jsx)(n.strong,{children:"dynamic"})," and ",(0,i.jsx)(n.strong,{children:"static"})," settings for the AI DIAL Core:"]}),"\n",(0,i.jsx)(n.h3,{id:"static-settings",children:"Static settings"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Refer to ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-core#static-settings",children:"static settings"})," in the AI DIAL Core repository to learn more."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Static settings are used on startup and ",(0,i.jsx)(n.strong,{children:"cannot"})," be changed while application is running. You can modify static settings in two ways:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["via environment variables","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["add a parameter to an environment variable with the prefix ",(0,i.jsx)(n.strong,{children:"aidial."}),", e.g.  ",(0,i.jsx)(n.code,{children:"aidial.server.port"})]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["by overriding the default configuration file","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["set the environment variable ",(0,i.jsx)(n.strong,{children:"AIDIAL_SETTINGS"})," with a full path to the config file"]}),"\n",(0,i.jsx)(n.li,{children:"mount the configuration file at the above path"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"dynamic-settings",children:"Dynamic settings"}),"\n",(0,i.jsxs)(n.p,{children:["Dynamic settings are stored in JSON files, specified via ",(0,i.jsx)(n.code,{children:"config.files"})," static setting, and reloaded at interval, specified via ",(0,i.jsx)(n.code,{children:"config.reload"})," static setting."]}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Refer to ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-core#dynamic-settings",children:"dynamic settings"})," in the AI DIAL Core repository to learn more."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"To modify dynamic settings:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["add the environment variable ",(0,i.jsx)(n.strong,{children:"aidial.config.files"}),", e.g. ",(0,i.jsx)(n.code,{children:"aidial.config.files: '[\"/mnt/secrets-store/aidial.config.json\"]'"})]}),"\n",(0,i.jsx)(n.li,{children:"mount the configuration file at the provided path"}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"chat-parameters",children:"Chat Parameters"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-chat",children:"AI DIAL Chat"})," to view a complete documentation."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Configure ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-chat/tree/development/apps/chat#environment-variables",children:"chat parameters"})," in the ",(0,i.jsx)(n.code,{children:"chat"})," section of the values file."]}),"\n",(0,i.jsx)(n.p,{children:"You can modify chat settings using environment variables."}),"\n",(0,i.jsx)(n.h2,{id:"themes-parameters",children:"Themes Parameters"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-chat-themes",children:"AI DIAL Chat Themes"})," to view a complete documentation."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Configure Themes parameters in the ",(0,i.jsx)(n.code,{children:"themes"})," section of the values file."]}),"\n",(0,i.jsx)(n.p,{children:"This component is designed for customizing AI DIAL Chat themes and images, as well as hosting the necessary static files for other AI DIAL applications. To apply any changes, we recommend building your own Docker image based on this component."}),"\n",(0,i.jsx)(n.h2,{id:"adapters-parameters",children:"Adapters Parameters"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-adapter-bedrock",children:"Adapter for Bedrock"})," to view a complete documentation."]}),"\n",(0,i.jsxs)(n.li,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-adapter-vertexai",children:"Adapter for Vertex"})," to view a complete documentation."]}),"\n",(0,i.jsxs)(n.li,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-adapter-openai",children:"Adapter for OpenAI"})," to view a complete documentation."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["To work with Azure, AWS or GCP models, AI DIAL uses applications called Adapters. You can configure Adapters in the ",(0,i.jsx)(n.code,{children:"openai"}),",",(0,i.jsx)(n.code,{children:"bedrock"})," and ",(0,i.jsx)(n.code,{children:"vertexai"})," sections."]}),"\n",(0,i.jsx)(n.p,{children:"You can modify adapters settings using environment variables."}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"Refer to these repositories to learn how to configure adapters:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/Deployment/Bedrock%20Model%20Deployment#configure-adapter",children:"Bedrock Model Deployment"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/Deployment/OpenAI%20Model%20Deployment#configure-adapter",children:"OpenAI Model Deployment"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"/Deployment/Vertex%20Model%20Deployment#configure-adapter",children:"Vertex Model Deployment"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"assistant-parameters",children:"Assistant Parameters"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-assistant",children:"AI DIAL Assistant"})," to view a complete documentation."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["You can add AI DIAL ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-assistant#environment-variables",children:"Assistant settings"})," in the ",(0,i.jsx)(n.code,{children:"assistant"})," section of the AI DIAL values file."]}),"\n",(0,i.jsx)(n.p,{children:"You can modify Assistant settings using environment variables."}),"\n",(0,i.jsx)(n.h2,{id:"auth-helper-parameters",children:"Auth Helper Parameters"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:["Refer to the ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-auth-helper",children:"Auth Helper"})," to view a complete documentation."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["You can add ",(0,i.jsx)(n.a,{href:"https://github.com/epam/ai-dial-auth-helper#configure",children:"Auth Helper settings"})," in the ",(0,i.jsx)(n.code,{children:"authhelper"})," section of the AI DIAL values file."]}),"\n",(0,i.jsxs)(n.p,{children:["You can modify Assistant settings using environment variables with ",(0,i.jsx)(n.a,{href:"https://docs.spring.io/spring-boot/docs/2.1.8.RELEASE/reference/html/boot-features-external-config.html",children:"Spring style"}),"."]})]})}function d(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>o,a:()=>a});var i=t(7294);const s={},r=i.createContext(s);function a(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);