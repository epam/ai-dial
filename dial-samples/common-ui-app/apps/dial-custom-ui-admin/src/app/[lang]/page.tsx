'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AttachmentData, ChatVisualizerConnector } from '@epam/ai-dial-chat-visualizer-connector';

import Loader from '@/custom-app-ui/common/src/components/Loader/Loader';
import Login from '@/custom-app-ui/common/src/components/Login/Login';
import { useAppContext } from '@/custom-app-ui/common/src/context/AppContext';
import { useAuth } from '@/custom-app-ui/common/src/hooks/use-auth';
import { getServerConfig } from '@/custom-app-ui/common/src/server/server-config';
import { isClientSessionValid } from '@/custom-app-ui/common/src/utils/auth/session';
import { ApplicationRoute } from '@/custom-app-ui/admin/src/types/routes';

export default function Page() {
  const [isAuthEnabled, setIsAuthEnabled] = useState<boolean | null>(null);
  const chatVisualizerConnector = useRef<ChatVisualizerConnector | null>(null);
  const { session, setShouldLogin, shouldLogin, update } = useAuth();
  const updateRef = useRef(update);
  const { dialUrl, applicationName, setAuthProvider, setApplicationId } = useAppContext();
  const searchParams = useSearchParams();
  const [__, setData] = useState<AttachmentData | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!chatVisualizerConnector.current && dialUrl && applicationName) {
      chatVisualizerConnector.current = new ChatVisualizerConnector(dialUrl, applicationName, setData);

      chatVisualizerConnector.current?.sendReady();
      chatVisualizerConnector.current?.sendReadyToInteract();

      return () => {
        chatVisualizerConnector.current?.destroy();
        chatVisualizerConnector.current = null;
      };
    }
  }, [applicationName, dialUrl]);

  useEffect(() => {
    const provider = searchParams.get('authProvider');
    const applicationId = searchParams.get('id');

    if (applicationId) {
      setApplicationId?.(applicationId);
    }

    if (provider) {
      setAuthProvider?.(provider);
    }
  }, [searchParams, setAuthProvider]);

  useEffect(() => {
    if (isAuthEnabled) {
      if (isClientSessionValid(session)) {
        setShowLogin(false);
        redirect(ApplicationRoute.Settings);
      } else {
        setShowLogin(true);
      }
    }
  }, [isAuthEnabled, session]);

  useEffect(() => {
    getServerConfig().then((data) => {
      setIsAuthEnabled(data.isAuthEnabled);
      updateRef.current();
    });
  }, []);

  return (
    <>
      {isAuthEnabled === null ? (
        <Loader size={50} />
      ) : showLogin ? (
        <Login
          onClick={() => {
            setShouldLogin(true);
          }}
          shouldLogin={shouldLogin}
        />
      ) : (
        <div></div>
      )}
    </>
  );
}
