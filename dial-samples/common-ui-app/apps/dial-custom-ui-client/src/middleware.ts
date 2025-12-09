import { getIsEnableAuthToggle } from '@/custom-app-ui/common/src/utils/env/get-auth-toggle';
import { NextRequest } from 'next/server';
import { combinedMiddleware, I18nMiddleware, removeLocaleFromUrl } from '@/custom-app-ui/common/src/utils/middleware';

export const NON_PROTECTED_ROUTES = ['/', '/signin'];

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};

export default function middleware(req: NextRequest) {
  const currentRoute = req.nextUrl.pathname;
  const routeWithoutLocale = removeLocaleFromUrl(currentRoute);
  const isProtectedRoute = !NON_PROTECTED_ROUTES.includes(routeWithoutLocale);

  if (getIsEnableAuthToggle()) {
    return isProtectedRoute ? combinedMiddleware(req) : I18nMiddleware(req);
  } else {
    return I18nMiddleware(req);
  }
}
