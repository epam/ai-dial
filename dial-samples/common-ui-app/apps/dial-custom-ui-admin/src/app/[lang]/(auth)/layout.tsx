import SessionProvider from '@/custom-app-ui/common/src/context/SessionProvider';
import { getServerSession } from 'next-auth';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-inter',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html>
      <SessionProvider session={session}>
        <body className={`${inter.variable} font`}>{children}</body>
      </SessionProvider>
    </html>
  );
}
