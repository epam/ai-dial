import SessionProvider from '@/custom-app-ui/common/src/context/SessionProvider';
import { getServerSession } from 'next-auth';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className="h-full">{children}</body>
      </SessionProvider>
    </html>
  );
}
