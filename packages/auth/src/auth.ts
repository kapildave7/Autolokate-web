import type {
  AuthClientConfig,
  AuthEvent,
  AuthListener,
  AuthSession,
  AuthState,
  OtpRequestPayload,
  OtpVerifyPayload,
} from './types.js';

/**
 * Authentication client for mobile OTP login and session management.
 * Inject API adapters when connecting to the real backend.
 */
export class AuthClient {
  private readonly config: AuthClientConfig;
  private state: AuthState = { status: 'loading' };
  private readonly listeners = new Set<AuthListener>();

  constructor(config: AuthClientConfig) {
    this.config = config;
  }

  getState(): AuthState {
    return this.state;
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Restore a persisted session on app startup. */
  async initialize(): Promise<AuthState> {
    this.setState({ status: 'loading' });

    const session = await this.config.storage.getSession();
    if (!session) {
      this.setState({ status: 'anonymous' });
      return this.state;
    }

    if (this.isExpired(session)) {
      await this.config.storage.clearSession();
      this.setState({ status: 'anonymous' });
      this.emit({ type: 'session_expired' });
      return this.state;
    }

    this.setState({ status: 'authenticated', session });
    this.emit({ type: 'session_restored', session });
    return this.state;
  }

  /** Request an OTP for the given mobile number. */
  async requestOtp(payload: OtpRequestPayload) {
    return this.config.requestOtp(payload);
  }

  /** Verify an OTP and establish a session. */
  async verifyOtp(payload: OtpVerifyPayload): Promise<AuthSession> {
    const session = await this.config.verifyOtp(payload);
    await this.config.storage.setSession(session);
    this.setState({ status: 'authenticated', session });
    this.emit({ type: 'session_created', session });
    return session;
  }

  /** Refresh the current session using a refresh token. */
  async refresh(): Promise<AuthSession> {
    const current = await this.config.storage.getSession();
    if (!current) {
      throw new Error('No active session to refresh.');
    }

    const session = await this.config.refreshSession(current.refreshToken);
    await this.config.storage.setSession(session);
    this.setState({ status: 'authenticated', session });
    this.emit({ type: 'session_created', session });
    return session;
  }

  /** Clear the active session locally and on the backend. */
  async logout(): Promise<void> {
    const current = await this.config.storage.getSession();

    if (current) {
      await this.config.logout(current.accessToken);
    }

    await this.config.storage.clearSession();
    this.setState({ status: 'anonymous' });
    this.emit({ type: 'session_cleared' });
  }

  /** Return the current access token when authenticated. */
  getAccessToken(): string | null {
    if (this.state.status !== 'authenticated') {
      return null;
    }

    return this.state.session.accessToken;
  }

  private isExpired(session: AuthSession): boolean {
    return Date.parse(session.expiresAt) <= Date.now();
  }

  private setState(state: AuthState): void {
    this.state = state;
  }

  private emit(event: AuthEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

/** Create a configured auth client instance. */
export function createAuthClient(config: AuthClientConfig): AuthClient {
  return new AuthClient(config);
}

/** In-memory session storage for tests and SSR scaffolding. */
export function createMemoryAuthStorage(): AuthClientConfig['storage'] {
  let session: AuthSession | null = null;

  return {
    getSession() {
      return Promise.resolve(session);
    },
    setSession(next) {
      session = next;
      return Promise.resolve();
    },
    clearSession() {
      session = null;
      return Promise.resolve();
    },
  };
}
