import { TokenSet } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export interface Token extends JWT {
  providerId?: string;
  userId: string;
  refreshToken: string | TokenSet;
}

export enum SessionStatus {
  Loading = 'loading',
  Unauthenticated = 'unauthenticated',
  Authenticated = 'authenticated',
}
