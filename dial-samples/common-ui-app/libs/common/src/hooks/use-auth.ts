import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { AUTH_WINDOW_CLOSE_KEY } from '@/custom-app-ui/common/src/constants/auth';
import { useAppContext } from '@/custom-app-ui/common/src/context/AppContext';
import { SessionStatus } from '@/custom-app-ui/common/src/types/auth';
import { isClientSessionValid } from '@/custom-app-ui/common/src/utils/auth/session';

export const useAuth = () => {
  const { authProvider, setAuthProvider } = useAppContext();
  const [shouldUpdateSession, setShouldUpdateSession] = useState(false);
  const [shouldLogin, setShouldLogin] = useState(false);
  const { data: session, status: sessionStatus, update } = useSession();
  const searchParams = useSearchParams();
  const authWindowRef = useRef<Window | null>(null);
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  useEffect(() => {
    if (shouldUpdateSession) {
      setShouldUpdateSession(false);
      window.location.reload();
    }
  }, [shouldUpdateSession, authProvider]);

  useEffect(() => {
    if (sessionStatus === SessionStatus.Loading || !shouldLogin) {
      return;
    }

    if ((sessionStatus === SessionStatus.Unauthenticated || !isClientSessionValid(session)) && !isWindowOpen) {
      setIsWindowOpen(true);

      authWindowRef.current = window.open(`/signin?authProvider=${authProvider}`, '_blank', `width=600,height=600`);
    }
  }, [sessionStatus, session, shouldLogin, searchParams, authProvider, isWindowOpen]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === AUTH_WINDOW_CLOSE_KEY) {
        setShouldUpdateSession(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return {
    session,
    sessionStatus,
    shouldLogin,
    setShouldLogin,
    update,
    shouldUpdateSession,
    setShouldUpdateSession,
    authProvider,
    setAuthProvider,
  };
};
