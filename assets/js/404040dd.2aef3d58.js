"use strict";(self.webpackChunkdial=self.webpackChunkdial||[]).push([[2104],{4024:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>c,frontMatter:()=>i,metadata:()=>d,toc:()=>a});var n=s(5893),r=s(1151);const i={},l="Handling High Loads in AI DIAL",d={id:"tutorials/high-load-performance",title:"Handling High Loads in AI DIAL",description:"In this document, we provide the highlights of the results of testing we conducted to measure the errors count and the response speed in AI DIAL under various scenarios, especially under high loads, involving many completions and prompts.",source:"@site/docs/tutorials/high-load-performance.md",sourceDirName:"tutorials",slug:"/tutorials/high-load-performance",permalink:"/tutorials/high-load-performance",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"CustomSideBar",previous:{title:"Launch AI DIAL Chat with a Sample Addon",permalink:"/tutorials/quick-start-with-addon"},next:{title:"Publications",permalink:"/tutorials/enable-publications"}},o={},a=[{value:"Preconditions",id:"preconditions",level:2},{value:"Response Speed",id:"response-speed",level:2},{value:"Moderate Load",id:"moderate-load",level:3},{value:"High Load",id:"high-load",level:3},{value:"Errors Rate",id:"errors-rate",level:2},{value:"Moderate Load",id:"moderate-load-1",level:3},{value:"High Load",id:"high-load-1",level:3},{value:"Findings",id:"findings",level:2},{value:"Efficient Distribution of Quota",id:"efficient-distribution-of-quota",level:3},{value:"Load Balancing",id:"load-balancing",level:3},{value:"Fewer Errors and Retry Mechanism",id:"fewer-errors-and-retry-mechanism",level:3}];function h(e){const t={h1:"h1",h2:"h2",h3:"h3",img:"img",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"handling-high-loads-in-ai-dial",children:"Handling High Loads in AI DIAL"}),"\n",(0,n.jsx)(t.p,{children:"In this document, we provide the highlights of the results of testing we conducted to measure the errors count and the response speed in AI DIAL under various scenarios, especially under high loads, involving many completions and prompts."}),"\n",(0,n.jsx)(t.h2,{id:"preconditions",children:"Preconditions"}),"\n",(0,n.jsx)(t.p,{children:"We ran a series of tests involving various scenarios: small prompt to small completion, small prompt to large completion, large prompt to small completion, and large prompt to large completion.\nAlso, AI DIAL setup with multiple endpoints was compared to a single-endpoint OpenAI setup to demonstrate the advantages of the load balancing contrary to using single-endpoint setups."}),"\n",(0,n.jsx)(t.h2,{id:"response-speed",children:"Response Speed"}),"\n",(0,n.jsx)(t.p,{children:"When testing the average response time, AI DIAL has proven to deliver better results compared to single OpenAI instances."}),"\n",(0,n.jsx)(t.h3,{id:"moderate-load",children:"Moderate Load"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Number of tokens"}),": completion=1, prompt=30, total=31"]}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Model"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Endpoints count"}),(0,n.jsx)(t.th,{children:"Load"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Avg response time, ms"})]})}),(0,n.jsx)(t.tbody,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Dial Core"}),(0,n.jsx)(t.td,{children:"gpt-35-turbo-16k"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"9"}),(0,n.jsx)(t.td,{children:"10 requests per sec"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"542"})]})})]}),"\n",(0,n.jsx)(t.p,{children:"The following chart illustrates, that DIAL Core shows a relatively stable and consistent response rate."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:s(1661).Z+"",width:"510",height:"199"})}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Model"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Endpoints count"}),(0,n.jsx)(t.th,{children:"Load"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Avg response time, ms"})]})}),(0,n.jsx)(t.tbody,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"OpenAI"}),(0,n.jsx)(t.td,{children:"gpt-35-turbo-16k"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"1"}),(0,n.jsx)(t.td,{children:"10 requests per sec"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"799"})]})})]}),"\n",(0,n.jsx)(t.p,{children:"The following chart illustrates, that OpenAI, contrary to the DIAL Core, shows relatively slower and less consistent response rate even with less active users."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:s(4598).Z+"",width:"563",height:"215"})}),"\n",(0,n.jsx)(t.h3,{id:"high-load",children:"High Load"}),"\n",(0,n.jsx)(t.p,{children:"When we conducted the same tests under higher loads (much more tokens), the results clearly demonstrated that AI DIAL performed better, further showcasing its effectiveness."}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Number of tokens"}),": completion=2189, prompt=2204, total=4393"]}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Model"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Endpoints count"}),(0,n.jsx)(t.th,{children:"Load"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Avg response time, ms"})]})}),(0,n.jsx)(t.tbody,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Dial Core"}),(0,n.jsx)(t.td,{children:"gpt-4-0613"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"6"}),(0,n.jsx)(t.td,{children:"0.5 requests per sec"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"121350"})]})})]}),"\n",(0,n.jsx)(t.p,{children:"The following chart illustrates the test case with a significantly higher number of tokens. DIAL Core shows a relatively stable and consistent response rate."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:s(9812).Z+"",width:"533",height:"207"})}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Model"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Endpoints count"}),(0,n.jsx)(t.th,{children:"Load"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Avg response time, ms"})]})}),(0,n.jsx)(t.tbody,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"OpenAI"}),(0,n.jsx)(t.td,{children:"gpt-4-0613"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"1"}),(0,n.jsx)(t.td,{children:"0.5 requests per sec"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"177370"})]})})]}),"\n",(0,n.jsx)(t.p,{children:"The following chart illustrates, that OpenAI, contrary to the DIAL Core, shows relatively slower and less consistent response rate."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:s(1564).Z+"",width:"519",height:"201"})}),"\n",(0,n.jsx)(t.h2,{id:"errors-rate",children:"Errors Rate"}),"\n",(0,n.jsx)(t.p,{children:"We also ran tests to measure the number of successful completions and the occurrence of errors, specifically HTTP 429 (Too Many Requests). These tests showed that users are far less likely to get an error in the response when using AI DIAL."}),"\n",(0,n.jsx)(t.h3,{id:"moderate-load-1",children:"Moderate Load"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Number of tokens"}),": completion=473, prompt=31, total=504"]}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Model"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Endpoints count"}),(0,n.jsx)(t.th,{children:"Load"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Errors"})]})}),(0,n.jsx)(t.tbody,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Dial Core"}),(0,n.jsx)(t.td,{children:"gpt-35-turbo-1106"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"5"}),(0,n.jsx)(t.td,{children:"3 requests per sec"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"0"})]})})]}),"\n",(0,n.jsx)(t.p,{children:"The following chart illustrates the test case with a moderate number of tokens. DIAL Core shows a stable and consistent response rate and 0% of failed requests."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:s(6056).Z+"",width:"517",height:"202"})}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Model"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Endpoints count"}),(0,n.jsx)(t.th,{children:"Load"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Errors"})]})}),(0,n.jsx)(t.tbody,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"OpenAI"}),(0,n.jsx)(t.td,{children:"gpt-35-turbo-1106"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"1"}),(0,n.jsx)(t.td,{children:"3 requests per sec"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"1%"})]})})]}),"\n",(0,n.jsx)(t.p,{children:"The following chart illustrates the test case with a moderate number of tokens. OpenAI shows a less stable and consistent response rate and 1% of failed requests."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:s(1539).Z+"",width:"516",height:"201"})}),"\n",(0,n.jsx)(t.h3,{id:"high-load-1",children:"High Load"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Number of tokens"}),": completion=2189, prompt=2204, total=4393"]}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Model"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Endpoints count"}),(0,n.jsx)(t.th,{children:"Load"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Errors"})]})}),(0,n.jsx)(t.tbody,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Dial Core"}),(0,n.jsx)(t.td,{children:"gpt-4-1106-preview"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"3"}),(0,n.jsx)(t.td,{children:"1 request per sec"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"0"})]})})]}),"\n",(0,n.jsx)(t.p,{children:"The following chart illustrates that even under high load, DIAL Core shows a stable and consistent response rate and 0% of failed requests."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:s(9074).Z+"",width:"512",height:"198"})}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Model"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Endpoints count"}),(0,n.jsx)(t.th,{children:"Load"}),(0,n.jsx)(t.th,{style:{textAlign:"center"},children:"Errors"})]})}),(0,n.jsx)(t.tbody,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"OpenAI"}),(0,n.jsx)(t.td,{children:"gpt-4-1106-preview"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"1"}),(0,n.jsx)(t.td,{children:"1 request per sec"}),(0,n.jsx)(t.td,{style:{textAlign:"center"},children:"57%"})]})})]}),"\n",(0,n.jsx)(t.p,{children:"The following chart illustrates that under high load, OpenAI shows a  significantly lower response rate and very high rate of failed requests."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{src:s(4822).Z+"",width:"513",height:"201"})}),"\n",(0,n.jsx)(t.h2,{id:"findings",children:"Findings"}),"\n",(0,n.jsx)(t.h3,{id:"efficient-distribution-of-quota",children:"Efficient Distribution of Quota"}),"\n",(0,n.jsx)(t.p,{children:"AI DIAL allows you to split Azure OpenAI service quotas, which can be allocated to a single deployment or divided among multiple deployments. This feature enables controlled RPM (Requests Per Minute) or TPM (Tokens Per Minute) for applications, optimizing resource allocation and maximizing quota usage."}),"\n",(0,n.jsx)(t.h3,{id:"load-balancing",children:"Load Balancing"}),"\n",(0,n.jsx)(t.p,{children:"AI DIAL's proprietary load balancer efficiently spreads requests across several deployments, ensuring that no single deployment becomes overwhelmed. This strategy guarantees consistent performance and avoids bottlenecks, especially during times of peak demand. In our tests, AI DIAL reliably delivers faster average response times and handles more requests per second. While single instances often suffer from rapidly declining requests and unpredictable response times under heavy loads, AI DIAL sustains a steady and reliable performance level."}),"\n",(0,n.jsx)(t.h3,{id:"fewer-errors-and-retry-mechanism",children:"Fewer Errors and Retry Mechanism"}),"\n",(0,n.jsx)(t.p,{children:"AI DIAL's multiple-deployment strategy significantly reduces the likelihood of encountering errors, a common issue with single OpenAI instances during periods of high demand. Additionally, AI DIAL's ability to automatically retry failed requests boosts overall reliability, ensuring the consistent performance and better user experience."})]})}function c(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},1661:(e,t,s)=>{s.d(t,{Z:()=>n});const n=s.p+"assets/images/perf1-649baab29f9055029fd7850534f29074.png"},4598:(e,t,s)=>{s.d(t,{Z:()=>n});const n=s.p+"assets/images/perf2-2ddadac272c84a78565af8c3dfb278f8.png"},9812:(e,t,s)=>{s.d(t,{Z:()=>n});const n=s.p+"assets/images/perf3-1dfe68e4fa3aea148bba72cd89429ac2.png"},1564:(e,t,s)=>{s.d(t,{Z:()=>n});const n=s.p+"assets/images/perf4-54bd8eb333a43d8909a602b4e7c4a478.png"},6056:(e,t,s)=>{s.d(t,{Z:()=>n});const n=s.p+"assets/images/perf5-2f08709d99134598ea5f63f0d0382840.png"},1539:(e,t,s)=>{s.d(t,{Z:()=>n});const n=s.p+"assets/images/perf6-2295f0116dbcce7afd65a4acae4c352a.png"},9074:(e,t,s)=>{s.d(t,{Z:()=>n});const n=s.p+"assets/images/perf7-b59b13017112335cf02cfe885ea754be.png"},4822:(e,t,s)=>{s.d(t,{Z:()=>n});const n=s.p+"assets/images/perf8-e06240398cb83a71d0d611e021626f7c.png"},1151:(e,t,s)=>{s.d(t,{Z:()=>d,a:()=>l});var n=s(7294);const r={},i=n.createContext(r);function l(e){const t=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function d(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);