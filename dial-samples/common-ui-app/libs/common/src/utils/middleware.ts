import { defaultLocale, locales } from '@/custom-app-ui/common/src/constants/i18n';
import { withAuth } from 'next-auth/middleware';
import { createI18nMiddleware } from 'next-international/middleware';

export const removeLocaleFromUrl = (url: string) => {
  const urlSegments = url.split('/').filter(Boolean);

  if (urlSegments.length === 0 || !locales.includes(urlSegments[0])) {
    return url;
  }

  return '/' + urlSegments.slice(1).join('/');
};

export const I18nMiddleware = createI18nMiddleware({
  defaultLocale,
  locales,
});

export const combinedMiddleware = withAuth((req) => {
  return I18nMiddleware(req);
}) as any;
