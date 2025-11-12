/**
 * This mock implements override i18n context due to issues with testing next-international with new
 * Next.js and React features.
 * See:
 * https://github.com/QuiiBz/next-international/issues/348
 * https://github.com/QuiiBz/next-international/issues/178
 * */

import { ReactNode, createContext } from 'react';

const I18nContext = createContext({});

export const MockI18nProvider = ({ children }: { children: ReactNode }) => {
  return <I18nContext.Provider value={{}}>{children}</I18nContext.Provider>;
};
