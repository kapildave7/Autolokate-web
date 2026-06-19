import { endpoints } from './endpoints.js';

export type ApiClientConfig = {
  baseUrl: string;
  getAccessToken?: () => string | null;
  fetch?: typeof fetch;
};

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly details: unknown;

  constructor(message: string, status: number, code: string | null = null, details: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type ErrorBody = {
  message?: string;
  code?: string;
  details?: unknown;
};

/**
 * Typed HTTP client for Autolokate backend APIs.
 * Wire a real backend by configuring baseUrl and auth token resolution.
 */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly getAccessToken: () => string | null;
  private readonly fetchImpl: typeof fetch;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getAccessToken = config.getAccessToken ?? (() => null);
    this.fetchImpl = config.fetch ?? globalThis.fetch.bind(globalThis);
  }

  get endpoints() {
    return endpoints;
  }

  async get<T>(path: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(
    path: string,
    body?: unknown,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  async put<T>(
    path: string,
    body?: unknown,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  async patch<T>(
    path: string,
    body?: unknown,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  async delete<T>(path: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, signal } = options;
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const token = this.getAccessToken();
    const requestInit: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...(signal !== undefined ? { signal } : {}),
    };

    const response = await this.fetchImpl(url, requestInit);

    if (!response.ok) {
      throw await this.parseError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  private async parseError(response: Response): Promise<ApiError> {
    let body: ErrorBody | null = null;

    try {
      body = (await response.json()) as ErrorBody;
    } catch {
      body = null;
    }

    return new ApiError(
      body?.message ?? `Request failed with status ${String(response.status)}`,
      response.status,
      body?.code ?? null,
      body?.details ?? null,
    );
  }
}

/** Create a preconfigured API client instance. */
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
