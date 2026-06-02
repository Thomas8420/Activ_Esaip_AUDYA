/**
 * Configuration de base pour les appels API AUDYA.
 *
 * Auth token-based (Laravel Sanctum) :
 *   1. authService.loginStep2 récupère le token et appelle setAuthToken().
 *   2. apiFetch injecte automatiquement `Authorization: Bearer <token>` quand
 *      un token est en cache mémoire.
 *   3. authService.logout / hydratation au boot peuvent (re)définir le token.
 *
 * Le cache mémoire évite un round-trip Keychain à chaque requête. Il doit être
 * hydraté au démarrage via bootstrapAuthToken() (cf. AuthContext).
 */

// En dev on pointe sur preprod (HTTPS, valide) ; en release sur l'API prod.
export const BASE_URL = __DEV__
  ? 'https://preprod.audya.fr'
  : 'https://api.audya.com';

// Garde-fou : seul HTTPS est accepté, même en dev — l'API porte des données de santé (HDS).
if (!BASE_URL.startsWith('https://')) {
  throw new Error('SECURITY: API base URL must use HTTPS.');
}

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Accept-Language': 'fr',
  'X-Requested-With': 'XMLHttpRequest',
};

const API_TIMEOUT_MS = 10_000;

// ─── Token en mémoire ───────────────────────────────────────────────────────
// Source de vérité pour le Bearer pendant la session. Le storage chiffré est
// la source de persistance ; ce cache mémoire évite un await à chaque requête.

let inMemoryAuthToken: string | null = null;

/** Met à jour le token utilisé pour `Authorization: Bearer`. null = anonyme. */
export function setAuthToken(token: string | null): void {
  inMemoryAuthToken = token;
}

/** Lecture pour les tests / debug — préférer setAuthToken pour muter. */
export function getAuthToken(): string | null {
  return inMemoryAuthToken;
}

// ─── Handler 401 (session expirée) ──────────────────────────────────────────
// Permet à AuthContext d'enregistrer un callback déclenché dès qu'un 401 tombe
// sur un endpoint authentifié. Empêche la "session zombie" (token expiré côté
// backend mais isAuthenticated=true côté mobile). Le handler ne doit PAS faire
// d'appel réseau — uniquement nettoyer le state local + storage.

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler;
}

// ─── apiFetch ───────────────────────────────────────────────────────────────

export interface ApiFetchOptions extends RequestInit {
  /** Si true, n'injecte pas Authorization (login, register, public endpoints). */
  skipAuth?: boolean;
}

/**
 * Wrapper fetch avec headers par défaut, timeout, Bearer auto, gestion d'erreurs.
 */
export async function apiFetch<T>(
  path: string,
  options?: ApiFetchOptions,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (!options?.skipAuth && inMemoryAuthToken) {
    headers.Authorization = `Bearer ${inMemoryAuthToken}`;
  }

  if (__DEV__) {
    console.log('[api]', options?.method ?? 'GET', `${BASE_URL}${path}`, options?.skipAuth ? '(skipAuth)' : (inMemoryAuthToken ? '(Bearer)' : '(anon)'));
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      if (__DEV__) {console.warn('[api] TIMEOUT', `${BASE_URL}${path}`);}
      throw new ApiError(408, 'Délai de connexion dépassé. Vérifiez votre connexion.');
    }
    if (__DEV__) {console.warn('[api] NETWORK ERROR', `${BASE_URL}${path}`, (err as Error).message);}
    throw new ApiError(0, 'Impossible de joindre le serveur. Vérifiez votre connexion.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (__DEV__) {console.log('[api]', response.status, `${BASE_URL}${path}`);}

  if (!response.ok) {
    // 401 sur endpoint authentifié = session invalide côté backend → on
    // déclenche le handler de logout local avant de propager l'erreur.
    // skipAuth=true exclut le cas login (401 = identifiants invalides, pas
    // expiration de session).
    if (response.status === 401 && !options?.skipAuth && onUnauthorized) {
      try {
        onUnauthorized();
      } catch (handlerErr) {
        if (__DEV__) {console.warn('[api] unauthorized handler threw:', (handlerErr as Error).message);}
      }
    }

    const error = await response.json().catch(() => ({} as {message?: string}));
    throw new ApiError(
      response.status,
      typeof (error as {message?: string}).message === 'string'
        ? (error as {message: string}).message
        : 'Une erreur est survenue. Veuillez réessayer.',
    );
  }

  // 204 No Content (logout typique) → renvoie undefined cast en T.
  if (response.status === 204) {
    return undefined as T;
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
