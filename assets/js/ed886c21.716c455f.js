"use strict";(self.webpackChunkdial=self.webpackChunkdial||[]).push([[941],{2551:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>r,metadata:()=>s,toc:()=>d});var t=i(5893),o=i(1151);const r={},c="Vertex Model Deployment",s={id:"Deployment/Vertex Model Deployment",title:"Vertex Model Deployment",description:"In this instruction, you will learn how to create VertexAI model in Google Cloud Platform and use it in AI DIAL config.",source:"@site/docs/Deployment/Vertex Model Deployment.md",sourceDirName:"Deployment",slug:"/Deployment/Vertex Model Deployment",permalink:"/Deployment/Vertex Model Deployment",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"CustomSideBar",previous:{title:"OpenAI Model Deployment",permalink:"/Deployment/OpenAI Model Deployment"},next:{title:"Bedrock Model Deployment",permalink:"/Deployment/Bedrock Model Deployment"}},l={},d=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Step 1: Configuring the AI Model",id:"step-1-configuring-the-ai-model",level:2},{value:"Request Access to Models",id:"request-access-to-models",level:3},{value:"Step 2: Get Access to AI Model",id:"step-2-get-access-to-ai-model",level:2},{value:"Create a Service Account",id:"create-a-service-account",level:3},{value:"Configure GCP Service Account and Get JSON Key",id:"configure-gcp-service-account-and-get-json-key",level:4},{value:"Configure Kubernetes Service Account",id:"configure-kubernetes-service-account",level:4},{value:"Step 3: Add Model to AI DIAL",id:"step-3-add-model-to-ai-dial",level:2},{value:"Add Model to AI DIAL Core Config",id:"add-model-to-ai-dial-core-config",level:3},{value:"Configure AI DIAL Adapter",id:"configure-ai-dial-adapter",level:3},{value:"Use GCP Service Account with JSON Key",id:"use-gcp-service-account-with-json-key",level:4},{value:"Use GCP Service Account with Workload Identity Federation for GKE",id:"use-gcp-service-account-with-workload-identity-federation-for-gke",level:4}];function a(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"vertex-model-deployment",children:"Vertex Model Deployment"}),"\n",(0,t.jsx)(n.p,{children:"In this instruction, you will learn how to create VertexAI model in Google Cloud Platform and use it in AI DIAL config."}),"\n",(0,t.jsxs)("div",{class:"docusaurus-ignore",children:[(0,t.jsx)(n.h1,{id:"table-of-contents",children:"Table of Contents"}),(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#prerequisites",children:"Prerequisites"})}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"#step-1-configuring-the-ai-model",children:"Step 1: Configuring the AI Model"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#request-access-to-models",children:"Request Access to Models"})}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"#step-2-get-access-to-ai-model",children:"Step 2: Get Access to AI Model"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"#create-a-service-account",children:"Create a Service Account"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#configure-gcp-service-account-and-get-json-key",children:"Configure GCP Service Account and Get JSON Key"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#configure-kubernetes-service-account",children:"Configure Kubernetes Service Account"})}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"#step-3-add-model-to-ai-dial",children:"Step 3: Add Model to AI DIAL"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#add-model-to-ai-dial-core-config",children:"Add Model to AI DIAL Core Config"})}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.a,{href:"#configure-ai-dial-adapter",children:"Configure AI DIAL Adapter"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#use-gcp-service-account-with-json-key",children:"Use GCP Service Account with JSON Key"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#use-gcp-service-account-with-workload-identity-federation-for-gke",children:"Use GCP Service Account with Workload Identity Federation for GKE"})}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]})]}),"\n",(0,t.jsx)(n.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Active Google Cloud project"}),"\n",(0,t.jsx)(n.li,{children:"Enabled billing for the project"}),"\n"]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["Refer to ",(0,t.jsx)(n.a,{href:"https://cloud.google.com/vertex-ai/docs/featurestore/setup",children:"Google Cloud Documentation"})," to learn how to create an account and enable billing."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"step-1-configuring-the-ai-model",children:"Step 1: Configuring the AI Model"}),"\n",(0,t.jsx)(n.h3,{id:"request-access-to-models",children:"Request Access to Models"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"Log into your Google Cloud account."}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["In the navigation panel on the left, in ",(0,t.jsx)(n.strong,{children:"APIs & Services"}),", select ",(0,t.jsx)(n.strong,{children:"Enable APIs and Services"}),"."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{src:i(3174).Z+"",width:"489",height:"417"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["In ",(0,t.jsx)(n.strong,{children:"APIs and Services"})," click ",(0,t.jsx)(n.strong,{children:"+ Enable APIs and Services"})," to access the API library."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["In the search bar, type ",(0,t.jsx)(n.strong,{children:"Vertex AI API"})," and select the ",(0,t.jsx)(n.strong,{children:"Vertex AI API"})," panel when it appears in search results."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Click ",(0,t.jsx)(n.strong,{children:"Enable"})," to turn on the Vertex AI API for your Google Cloud project.\n",(0,t.jsx)(n.img,{src:i(2405).Z+"",width:"704",height:"288"})]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"step-2-get-access-to-ai-model",children:"Step 2: Get Access to AI Model"}),"\n",(0,t.jsx)(n.h3,{id:"create-a-service-account",children:"Create a Service Account"}),"\n",(0,t.jsx)(n.h4,{id:"configure-gcp-service-account-and-get-json-key",children:"Configure GCP Service Account and Get JSON Key"}),"\n",(0,t.jsx)(n.p,{children:"To communicate with VertexAI models, it is necessary to have a service account."}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"To create a Service Account"}),":"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["In your Google Cloud account, in the main navigation menu find ",(0,t.jsx)(n.strong,{children:"IAM & Admin"})," and navigate to ",(0,t.jsx)(n.strong,{children:"Service Accounts"}),"."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{src:i(1323).Z+"",width:"473",height:"570"})}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["To create a new service account, click ",(0,t.jsx)(n.strong,{children:"+ Create Service Account"})," and fill in the details for your new service account:"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{src:i(3657).Z+"",width:"1137",height:"94"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Fill in the ",(0,t.jsx)(n.strong,{children:"Service account details"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["In the next step ",(0,t.jsx)(n.strong,{children:"Grant this service account access to project"}),", add ",(0,t.jsx)(n.strong,{children:"Vertex AI Custom Code Service Agent"})," role. Refer to ",(0,t.jsx)(n.a,{href:"https://cloud.google.com/vertex-ai/docs/general/access-control#grant_service_agents_access_to_other_resources",children:"GCP Documentation"})," to learn more."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{src:i(3606).Z+"",width:"644",height:"588"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Click ",(0,t.jsx)(n.strong,{children:"Done"})," to complete."]}),"\n"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"The new service account appears on the Service Account page. Click it to view the details:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"In KEYS"}),", create a key for this service account and download it in JSON format."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{src:i(9257).Z+"",width:"1033",height:"650"})}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"configure-kubernetes-service-account",children:"Configure Kubernetes Service Account"}),"\n",(0,t.jsx)(n.p,{children:"In case your cluster is located at GCP, the best practise for using VertexAI is to assign a GCP IAM service account to Kubernetes Service Account. You can do this via Workload Identity Federation for GKE."}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["Refer to ",(0,t.jsx)(n.a,{href:"https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity",children:"GCP Documentation"})," to learn how to configure a Workload Identity Federation for GKE."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"step-3-add-model-to-ai-dial",children:"Step 3: Add Model to AI DIAL"}),"\n",(0,t.jsx)(n.h3,{id:"add-model-to-ai-dial-core-config",children:"Add Model to AI DIAL Core Config"}),"\n",(0,t.jsx)(n.p,{children:"To deploy a model to AI DIAL, it is necessary to add it to config and configure an adapter for it."}),"\n",(0,t.jsxs)(n.p,{children:["Add your model with its parameters in the ",(0,t.jsx)(n.code,{children:"models"})," section."]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["Refer to ",(0,t.jsx)(n.a,{href:"https://github.com/epam/ai-dial-core/blob/development/sample/aidial.config.json#L30",children:"AI DIAL Core Configuration"})," to view an example."]}),"\n"]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["Refer to ",(0,t.jsx)(n.a,{href:"/Deployment/configuration#core-parameters",children:"Configure core config"})," to view the configuration of AI DIAL core parameters in the helm-based installation."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"configure-ai-dial-adapter",children:"Configure AI DIAL Adapter"}),"\n",(0,t.jsxs)(n.p,{children:["To work with models, we use applications called Adapters. You can configure VertexAI Adapter via ",(0,t.jsx)(n.a,{href:"https://github.com/epam/ai-dial-adapter-vertexai#environment-variables",children:"environment variables"}),"."]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["Refer to ",(0,t.jsx)(n.a,{href:"https://github.com/epam/ai-dial-adapter-vertexai",children:"Adapter for Vertex"})," to view documentation for a Vertex AI DIAL Adapter."]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"use-gcp-service-account-with-json-key",children:"Use GCP Service Account with JSON Key"}),"\n",(0,t.jsx)(n.p,{children:"The JSON file with your GCP key should be mounted to a pod as a file. Please, use the most suitable way to perform it."}),"\n",(0,t.jsx)(n.p,{children:"Example of mounting JSON key using secrets:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'vertexai:\n  enabled: true\n\n  env:\n    DEFAULT_REGION: "your-region"\n    GOOGLE_APPLICATION_CREDENTIALS: "/mnt/secrets-store/gcp-ai-key"\n    GCP_PROJECT_ID: "your-project-id"\n\n  secrets:\n    gcp-ai-key: |\n      {\n      "type": "service_account",\n      ...\n      "universe_domain": "googleapis.com"\n      }\n\n  extraVolumes:\n    - name: key-file\n      secret:\n        secretName: \'{{ template "dialExtension.names.fullname" . }}\'\n        items:\n          - key: gcp-ai-key\n            path: gcp-ai-key\n\n  extraVolumeMounts:\n    - name: key-file\n      mountPath: "/mnt/secrets-store"\n      readOnly: true\n\n'})}),"\n",(0,t.jsx)(n.h4,{id:"use-gcp-service-account-with-workload-identity-federation-for-gke",children:"Use GCP Service Account with Workload Identity Federation for GKE"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["Before taking this step, configure ",(0,t.jsx)(n.a,{href:"#configure-kubernetes-service-account",children:"Authenticate to Google Cloud APIs from GKE workloads"}),"."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"In this scenario, Kubernetes Service Account is linked to GCP IAM service account (your-sa-id)."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'vertexai:\n  enabled: true\n\n  serviceAccount:\n    create: true\n    annotations:\n      iam.gke.io/gcp-service-account: your-sa-id@your-project-id.iam.gserviceaccount.com\n\n  env:\n    DIAL_URL: "http://dial-core"\n    GCP_PROJECT_ID: "your-project-id"\n    DEFAULT_REGION: "your-region"\n\n'})})]})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},1323:(e,n,i)=>{i.d(n,{Z:()=>t});const t=i.p+"assets/images/gcp1-7aed2edb0016090050ca501faab5dcb1.png"},2405:(e,n,i)=>{i.d(n,{Z:()=>t});const t=i.p+"assets/images/gcp11-9c908f17becd893bdf14929d65d49a11.png"},3606:(e,n,i)=>{i.d(n,{Z:()=>t});const t=i.p+"assets/images/gcp12-202ba8ee08d6e2835a39bc758b681a7d.png"},3657:(e,n,i)=>{i.d(n,{Z:()=>t});const t=i.p+"assets/images/gcp2-1-650a17336573ce11a9d04468a79964cd.png"},9257:(e,n,i)=>{i.d(n,{Z:()=>t});const t=i.p+"assets/images/gcp6-b2a15d2b8f1ac67bc39fd2ab5d6ca7fc.png"},3174:(e,n,i)=>{i.d(n,{Z:()=>t});const t=i.p+"assets/images/gcp9-a2bde5d131ffffc6da4b0b9a9e678caa.png"},1151:(e,n,i)=>{i.d(n,{Z:()=>s,a:()=>c});var t=i(7294);const o={},r=t.createContext(o);function c(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);