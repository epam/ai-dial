import React from 'react';
import Head from '@docusaurus/Head';
import { Redirect } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';

// Redirects the site root and the NEW instance root to the first visible NEW
// section's landing page. The target is provided by the inline `root-redirect`
// plugin in docusaurus.config.js via setGlobalData. A meta-refresh handles the redirect
// before hydration (and without JS); <Redirect> covers client navigation.
export default function RootRedirect() {
  const { to } = usePluginData('root-redirect');
  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0; url=${to}`} />
      </Head>
      <Redirect to={to} />
    </>
  );
}
