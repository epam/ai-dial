import { ReactNode } from 'react';

import '@/custom-app-ui/client/src/app/[lang]/global.scss';
import { themesApi } from '@/custom-app-ui/client/src/app/api/api';
import { AppContextProvider } from '@/custom-app-ui/common/src/context/AppContext';
import { I18nProvider } from '@/custom-app-ui/common/src/context/I18nProvider';
import { NotificationProvider } from '@/custom-app-ui/common/src/context/NotificationContext';
import { ThemeProvider } from '@/custom-app-ui/common/src/context/ThemeContext';
import { getServerSession } from 'next-auth';
import SessionProvider from '@/custom-app-ui/common/src/context/SessionProvider';

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const themes = await themesApi.getThemes();
  const session = await getServerSession();

  return (
    <SessionProvider refetchOnWindowFocus session={session} refetchWhenOffline={false}>
      <AppContextProvider applicationName={process.env.DIAL_APPLICATION_NAME} dialUrl={process.env.DIAL_URL}>
        <ThemeProvider themes={themes}>
          <I18nProvider locale={lang}>
            <NotificationProvider>
              <div className="flex flex-col h-full w-full">{children}</div>
            </NotificationProvider>
          </I18nProvider>
        </ThemeProvider>
      </AppContextProvider>
    </SessionProvider>
  );
}
