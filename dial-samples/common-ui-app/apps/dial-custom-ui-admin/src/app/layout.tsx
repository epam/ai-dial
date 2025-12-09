import { Inter } from 'next/font/google';

import '@/custom-app-ui/admin/src/app/[lang]/global.scss';

export const metadata = {
  title: 'Dial Custom App UI Admin',
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
