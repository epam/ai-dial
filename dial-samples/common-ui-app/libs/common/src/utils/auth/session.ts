import { Session } from 'next-auth';

const isValidSession = (session: Session | null): boolean => {
  return !!session && session.error !== 'RefreshAccessTokenError' && session.error !== 'NoClientForProvider';
};

export function isClientSessionValid(session: Session | null) {
  return isValidSession(session);
}

export function isServerSessionValid(session: Session | null) {
  return isValidSession(session);
}

export function validateServerSession(session: Session | null) {
  return isServerSessionValid(session);
}
