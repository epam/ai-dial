/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

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
          id: 'quick-start-model',
          label: 'Chat with OpenAI Model',
          docsUrl: 'tutorials/quick-start-model'
         },
         {
          type: 'doc',
          id: 'quick-start-with-addon',
          label: 'Chat with Addon',
          docsUrl: 'tutorials/quick-start-with-addon'
         },
         {
          type: 'doc',
          id: 'tutorials/quick-start-with-application',
          label: 'Chat with Application',
          docsUrl: 'tutorials/quick-start-with-application'
         }
        ]
      },
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
  
