'use client';

import { ChatVisualizerConnector } from '@epam/ai-dial-chat-visualizer-connector';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

interface AppContextType {
  dialUrl?: string;
  applicationName?: string;
  applicationId: string | null;
  setApplicationId: Dispatch<SetStateAction<string | null>>;
  visualizerConnector?: ChatVisualizerConnector | null;
  setVisualizerConnector?: Dispatch<SetStateAction<ChatVisualizerConnector | null>>;
  authProvider: string | null;
  setAuthProvider: Dispatch<SetStateAction<string | null>>;
}

interface Props extends Omit<AppContextType, 'authProvider' | 'setAuthProvider' | 'applicationId' | 'setApplicationId'> {
  children: ReactNode;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children, dialUrl, applicationName }: Props) => {
  const [visualizerConnector, setVisualizerConnector] = useState<ChatVisualizerConnector | null>(null);
  const [authProvider, setAuthProvider] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const value = {
    dialUrl,
    applicationName,
    applicationId,
    setApplicationId,
    visualizerConnector,
    setVisualizerConnector,
    authProvider,
    setAuthProvider,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('AppContext must be used within a <AppContextProvider />');
  }

  return context;
};
