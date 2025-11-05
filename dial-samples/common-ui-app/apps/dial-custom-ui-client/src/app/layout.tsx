import { Inter } from 'next/font/google';

import '@/custom-app-ui/client/src/app/[lang]/global.scss';

export const metadata = {
  title: 'Custom Application Client',
};

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-inter',
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <head>
        <link rel="icon" href="/images/favicon.svg" sizes="any" />
      </head>
      <body className={`${inter.variable} font`}>{children}</body>
    </html>
  );
}
