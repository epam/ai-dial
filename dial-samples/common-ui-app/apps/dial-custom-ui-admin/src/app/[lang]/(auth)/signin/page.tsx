'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { AUTH_WINDOW_CLOSE_KEY } from '@/custom-app-ui/common/src/constants/auth';
import { SessionStatus } from '@/custom-app-ui/common/src/types/auth';

const SignInPage = () => {
  const session = useSession();
  const searchParams = useSearchParams();

  const updateSession = useCallback(async () => {
    const updatedSession = await session.update();
    if (updatedSession && !updatedSession.error) {
      closePage();
    }
  }, [session]);

  const closePage = () => {
    window.opener?.postMessage({ type: AUTH_WINDOW_CLOSE_KEY }, '*');
    window.close();
  };

  useEffect(() => {
    if (!window.opener) {
      // if user try to redirect to sign in page from directly reaching protected route.
      return redirect('/');
    }

    if (session.status !== SessionStatus.Loading && (session.data?.error || !session.data)) {
      const authProvider = searchParams.get('authProvider');
      signIn(authProvider ?? undefined, {
        callbackUrl: `${window.location.href}&redirect=true`,
      });
      return;
    }
    if (session.status === SessionStatus.Authenticated) {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        closePage();
      } else {
        updateSession();
      }
    }
  }, [session, searchParams, updateSession]);

  return null;
};

export default SignInPage;
