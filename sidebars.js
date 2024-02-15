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
        {
          type: 'doc',
          id: 'tutorials/azure-ad-configuration',
          label: 'Azure AD Configuration',
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
        {
          type:'doc',
          id: 'Deployment/configuration',
          label: 'Configuration'
        },
        'Deployment/OpenAI Model Deployment',
        'Deployment/Vertex Model Deployment',
        'Deployment/Bedrock Model Deployment'
      ],
    },
    {
      type: 'category',
      label: 'Cookbook',
      items: [
        "Cookbook/dial-cookbook/examples/how_to_call_text_to_text_applications",
        "Cookbook/dial-cookbook/examples/how_to_call_text_to_image_applications",
        "Cookbook/dial-cookbook/examples/how_to_call_image_to_text_applications",
      ],
    }
  ],
};

export default sidebars;
