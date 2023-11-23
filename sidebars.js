/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  CustomSideBar: [
    {
      type: 'doc',
      id: 'README', // document ID
      label: 'Home', // sidebar label
    },
    'quick-start',
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
      ],
    },
    'user-guide',
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'Deployment/Azure Model Deployment',
        'Deployment/configuration',
      ],
    },
  ],  
};

export default sidebars;
