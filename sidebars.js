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
    'user-guide',
    'quick-start-with-addon',
    'quick-start-with-application',
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
