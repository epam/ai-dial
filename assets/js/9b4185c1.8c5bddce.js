"use strict";(self.webpackChunkdial=self.webpackChunkdial||[]).push([[2775],{3094:(e,i,t)=>{t.r(i),t.d(i,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>l});var a=t(5893),n=t(1151);const s={},o="PII Compliance & Privacy",r={id:"privacy",title:"PII Compliance & Privacy",description:"Introduction",source:"@site/docs/privacy.md",sourceDirName:".",slug:"/privacy",permalink:"/privacy",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"CustomSideBar",previous:{title:"Quick Start",permalink:"/quick-start"},next:{title:"Architecture",permalink:"/architecture"}},c={},l=[{value:"Introduction",id:"introduction",level:2},{value:"Applications Audit Logs",id:"applications-audit-logs",level:2},{value:"BLOB Storage",id:"blob-storage",level:2},{value:"File Storage Policies",id:"file-storage-policies",level:2}];function d(e){const i={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,n.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.h1,{id:"pii-compliance--privacy",children:"PII Compliance & Privacy"}),"\n",(0,a.jsx)(i.h2,{id:"introduction",children:"Introduction"}),"\n",(0,a.jsx)(i.p,{children:"There are two scenarios in which personal information can be exposed when working with DIAL."}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"The first scenario takes place when an application uploads sensitive data, such as conversations or files, to DIAL via API. In this case, DIAL can capture and save conversation data in application audit logs."}),"\n",(0,a.jsx)(i.li,{children:"The second scenario occurs when users interact with DIAL Chat, specifically when engaging with language models or applications. In this case, DIAL can capture and save conversation data in both audit logs and the user\u2019s BLOB storage."}),"\n"]}),"\n",(0,a.jsx)(i.p,{children:"To ensure compliance with necessary Personally Identifiable Information (PII) regulations, our system offers flexibility that allows you to customize your data management strategy and ensure that your data handling practices adhere to required standards."}),"\n",(0,a.jsx)(i.p,{children:"DIAL allows you to choose which logs to store (if at all), determine which data to retain, and assists in implementing necessary policies in your file storage to effectively manage sensitive resources."}),"\n",(0,a.jsx)(i.h2,{id:"applications-audit-logs",children:"Applications Audit Logs"}),"\n",(0,a.jsx)(i.p,{children:"When a user interacts with DIAL applications programmatically using API keys, DIAL captures and records all conversation data in a designated audit log."}),"\n",(0,a.jsxs)(i.p,{children:["To prevent DIAL from storing such logs for a particular API key, you can enable a special flag in the API key specification in the ",(0,a.jsx)(i.a,{href:"https://github.com/epam/ai-dial-core/?tab=readme-ov-file#dynamic-settings",children:"DIAL Core dynamic settings"}),":"]}),"\n",(0,a.jsx)(i.pre,{children:(0,a.jsx)(i.code,{className:"language-json",children:'//Example of DIAL Core dynamic settings configuration\n"keys": \n{\n        "yourApiKey": {\n            "secured": true\n        }        \n}\n'})}),"\n",(0,a.jsxs)(i.p,{children:[(0,a.jsx)(i.strong,{children:"Important!"}),": It's important to be aware that custom applications can upload resources, like conversations or files, to DIAL. If this is the case, the logic within the custom application that carries out such actions is responsible for handling these resources. To manage them, you can additionally implement Time To Live (TTL) or other policies in your file storage. For more details on this topic, please refer to the ",(0,a.jsx)(i.a,{href:"#file-storage-policies",children:"File Storage Policies"})," section."]}),"\n",(0,a.jsx)(i.h2,{id:"blob-storage",children:"BLOB Storage"}),"\n",(0,a.jsxs)(i.p,{children:["When a user interacts with DIAL Chat using a JSON Web Token (JWT), DIAL captures and records all conversation data in a designated audit log and ",(0,a.jsx)(i.strong,{children:"also"})," stores it as JSON files in the user's BLOB storage."]}),"\n",(0,a.jsxs)(i.p,{children:[(0,a.jsx)(i.strong,{children:"Important!"}),": It's important to be aware that even if a user deletes all conversation data from the BLOB storage the data will still be retained in the audit logs. Because DIAL Chat uses JWT for user authentication, rather than API keys, the information will inevitably be saved in BLOB storage."]}),"\n",(0,a.jsx)(i.h2,{id:"file-storage-policies",children:"File Storage Policies"}),"\n",(0,a.jsx)(i.p,{children:"To manage your resource uploaded to the BLOB storage, you can configure policies, which operate independently from DIAL. BLOB storage policies can utilize functionalities such as cloud lambdas to establish TTLs for specific file types."}),"\n",(0,a.jsx)(i.p,{children:"To facilitate the enforcement of such policies, DIAL can add metadata to files stored in the BLOB storage. This metadata assists in the application of storage policies, ensuring effective management of your resources."})]})}function h(e={}){const{wrapper:i}={...(0,n.a)(),...e.components};return i?(0,a.jsx)(i,{...e,children:(0,a.jsx)(d,{...e})}):d(e)}},1151:(e,i,t)=>{t.d(i,{Z:()=>r,a:()=>o});var a=t(7294);const n={},s=a.createContext(n);function o(e){const i=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function r(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),a.createElement(s.Provider,{value:i},e.children)}}}]);