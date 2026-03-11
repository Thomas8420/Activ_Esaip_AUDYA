/**
 * Configuration de base pour les appels API AUDYA.
 * Auth : sessions HTTP + cookies (2FA).
 */

const BASE_URL = __DEV__
  ? 'http://localhost:8000'
  : 'https://api.audya.com';

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Accept-Language': 'fr',
  'X-Requested-With': 'XMLHttpRequest',
};

/**
 * Wrapper fetch avec headers par défaut et gestion d'erreurs HTTP.
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // Inclut les cookies de session
    headers: {
      ...DEFAULT_HEADERS,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, error.message ?? 'Erreur serveur');
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
