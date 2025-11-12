import { FC, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { AppContextProvider } from '@/custom-app-ui/common/src/context/AppContext';
import { NotificationProvider } from '@/custom-app-ui/common/src/context/NotificationContext';
import { MockI18nProvider } from '@/custom-app-ui/common/src/utils/tests/mock/MockI18nProvider';

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AppContextProvider>
      <MockI18nProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </MockI18nProvider>
    </AppContextProvider>
  );
};

export const renderWithContext = (ui: ReactNode) => {
  return render(ui, { wrapper: Providers });
};
