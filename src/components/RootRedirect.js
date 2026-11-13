import React from 'react';
import Head from '@docusaurus/Head';
import { Redirect } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';

// Redirects the earlier URLs of the home page ('/v2', '/v2/overview') to the
// Overview doc at the site root. Routes and target come from the inline
// `root-redirect` plugin in docusaurus.config.js (see docs.config.js
// ROOT_REDIRECT) via setGlobalData. A meta-refresh handles the redirect before
// hydration (and without JS); <Redirect> covers client navigation.
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
