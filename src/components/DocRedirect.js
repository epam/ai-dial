import React from 'react';
import Head from '@docusaurus/Head';
import { Redirect } from '@docusaurus/router';

// The static HTML redirects before hydration; Redirect handles client navigation.
export default function DocRedirect({ redirect }) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="refresh" content={`0; url=${redirect.to}`} />
      </Head>
      <Redirect to={redirect.to} />
    </>
  );
}
