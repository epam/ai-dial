/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  CustomSideBar: [
    {
      type: 'doc',
      id: 'README', // document ID
      label: 'Home', // sidebar label
    },
    'quick-start',
    'architecture',
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        {
          type: 'doc',
          id: 'tutorials/quick-start-with-application',
          label: 'Chat with Application',
        },
        {
          type: 'doc',
          id: 'tutorials/quick-start-model',
          label: 'Chat with OpenAI Model',
        },
        {
          type: 'doc',
          id: 'tutorials/quick-start-with-addon',
          label: 'Chat with Addon',
        },
        {
          type: 'doc',
          id: 'tutorials/roles-management',
          label: 'Roles Management',
        },
      ],
    },
    'user-guide',
    {
      type: 'category',
      label: 'Deployment',
      items: [
        {
          type: 'link',
          label: 'Helm Deployment',
          href: 'https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple',
        },
        'Deployment/configuration',
        'Deployment/OpenAI Model Deployment',
        'Deployment/Vertex Model Deployment',
        'Deployment/Bedrock Model Deployment'
      ],
    },
  ],  
};

export default sidebars;
