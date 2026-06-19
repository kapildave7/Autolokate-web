import type { User } from '@autolokate/types';

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
};

export type OtpRequestPayload = {
  mobile: string;
};

export type OtpRequestResponse = {
  requestId: string;
  expiresInSeconds: number;
};

export type OtpVerifyPayload = {
  mobile: string;
  otp: string;
  requestId: string;
};

export type OtpVerifyResponse = AuthSession;

export type AuthState =
  | { status: 'anonymous' }
  | { status: 'authenticated'; session: AuthSession }
  | { status: 'loading' };

export type AuthStorage = {
  getSession: () => Promise<AuthSession | null>;
  setSession: (session: AuthSession) => Promise<void>;
  clearSession: () => Promise<void>;
};

export type AuthClientConfig = {
  requestOtp: (payload: OtpRequestPayload) => Promise<OtpRequestResponse>;
  verifyOtp: (payload: OtpVerifyPayload) => Promise<OtpVerifyResponse>;
  refreshSession: (refreshToken: string) => Promise<AuthSession>;
  logout: (accessToken: string) => Promise<void>;
  storage: AuthStorage;
};

export type AuthEvent =
  | { type: 'session_restored'; session: AuthSession }
  | { type: 'session_created'; session: AuthSession }
  | { type: 'session_cleared' }
  | { type: 'session_expired' };

export type AuthListener = (event: AuthEvent) => void;
