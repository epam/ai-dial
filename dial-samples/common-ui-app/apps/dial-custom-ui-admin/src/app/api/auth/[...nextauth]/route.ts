import { nextauthOptions } from '@/custom-app-ui/common/src/utils/auth/auth-callbacks';
import NextAuth from 'next-auth';

const handler = NextAuth(nextauthOptions);

export { handler as GET, handler as POST };
