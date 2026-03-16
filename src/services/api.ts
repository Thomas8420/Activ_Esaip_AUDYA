/**
 * Configuration de base pour les appels API AUDYA.
 * Auth : sessions HTTP + cookies (2FA).
 */

export const BASE_URL = __DEV__
  ? 'http://localhost:8000'
  : 'https://api.audya.com';

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Accept-Language': 'fr',
  'X-Requested-With': 'XMLHttpRequest',
};

const API_TIMEOUT_MS = 10_000;

/**
 * Wrapper fetch avec headers par défaut, timeout et gestion d'erreurs HTTP.
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: 'include', // Inclut les cookies de session
      headers: {
        ...DEFAULT_HEADERS,
        ...options?.headers,
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, typeof error.message === 'string' ? error.message : 'Une erreur est survenue. Veuillez réessayer.');
  }

  return response.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
