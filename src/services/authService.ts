/**
 * Service d'authentification — Laravel Sanctum, token-based.
 *
 * Routes backend (cf. RAPPORT_BLOCAGE_AUTH_API.md, livrées sur la branche
 * feature/api-auth-mobile) :
 *   POST /api/auth/login        { email, password }       → { pending_token }
 *   POST /api/auth/verify-2fa   { pending_token, code }   → { token, user }
 *   POST /api/auth/resend-code  { pending_token }
 *   POST /api/auth/logout       Authorization: Bearer ... → 204
 *
 * Le `pending_token` ne vit qu'entre les étapes 1 et 2 ; on le garde en mémoire
 * uniquement (pas de persistance — ttl 5 min côté backend). Le token Sanctum
 * final est persisté via secureStorage (Keychain/Keystore) et propagé à api.ts.
 */

import {ApiError, apiFetch, setAuthToken} from './api';
import {
  clearAuthStorage,
  setStoredAuthToken,
  setStoredUser,
  type StoredUser,
} from './secureStorage';

// ─── Toggle API ─────────────────────────────────────────────────────────────
// true = appelle l'API preprod ; false = mode mock dev (code 2FA "123456").
const USE_API = true;

/**
 * ⚠️ SÉCURITÉ — Bypass 2FA pour les tests locaux uniquement.
 * Laisser à false. En mock (USE_API=false), le code 2FA valide est "123456".
 */
export const DEV_SKIP_2FA = false;
if (!__DEV__ && (DEV_SKIP_2FA as boolean)) {
  throw new Error('SECURITY: DEV_SKIP_2FA must never be true in a release build.');
}

function ensureMockOnlyInDev(): void {
  if (!__DEV__) {
    throw new ApiError(503, 'Service d\'authentification indisponible.');
  }
}

// ─── Types backend (snake_case — ne pas exposer hors du service) ─────────────

interface LoginApiResponse {
  pending_token: string;
}

interface UserApiResponse {
  id: number | string;
  email: string;
  // Le backend renvoie `firstname` / `lastname` en single word (cf. shape réel
  // capturé sur /api/auth/verify-2fa), pas en snake_case.
  firstname?: string;
  lastname?: string;
  [key: string]: unknown;
}

interface Verify2FAApiResponse {
  token: string;
  /** ISO 8601 — expiration du token Sanctum. Stocké pour permettre un refresh proactif. */
  expires_at?: string;
  user: UserApiResponse;
}

// ─── Mapping ─────────────────────────────────────────────────────────────────

function mapUser(raw: UserApiResponse): StoredUser {
  const {firstname, lastname, ...rest} = raw;
  return {
    ...rest,
    id: raw.id,
    email: raw.email,
    ...(firstname !== undefined ? {firstName: firstname} : {}),
    ...(lastname !== undefined ? {lastName: lastname} : {}),
  };
}

// ─── État inter-étapes (mémoire seule, ttl backend 5 min) ───────────────────

let pendingToken: string | null = null;

// ─── Login - Premier facteur ────────────────────────────────────────────────

export async function loginStep1(
  email: string,
  password: string,
): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    pendingToken = 'mock-pending-token';
    return;
  }

  pendingToken = null;
  const data = await apiFetch<LoginApiResponse>('/api/auth/login', {
    method: 'POST',
    skipAuth: true,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password}),
  });

  if (!data?.pending_token) {
    throw new ApiError(500, 'Réponse serveur invalide.');
  }
  pendingToken = data.pending_token;
}

// ─── Login - Second facteur ─────────────────────────────────────────────────

export async function loginStep2(code: string): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    if (code !== '123456') {
      throw new ApiError(422, 'Le code n\'est pas valide');
    }
    return;
  }

  if (!pendingToken) {
    throw new ApiError(409, 'Session invalide. Veuillez vous reconnecter.');
  }

  const data = await apiFetch<Verify2FAApiResponse>('/api/auth/verify-2fa', {
    method: 'POST',
    skipAuth: true,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({pending_token: pendingToken, code}),
  });

  if (!data?.token || !data?.user) {
    throw new ApiError(500, 'Réponse serveur invalide.');
  }

  const user = mapUser(data.user);
  setAuthToken(data.token);
  await Promise.all([setStoredAuthToken(data.token), setStoredUser(user)]);
  pendingToken = null;
}

// ─── Renvoi du code 2FA ──────────────────────────────────────────────────────

export async function resend2FACode(): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    return;
  }
  if (!pendingToken) {
    throw new ApiError(409, 'Session invalide. Veuillez vous reconnecter.');
  }
  await apiFetch<void>('/api/auth/resend-code', {
    method: 'POST',
    skipAuth: true,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({pending_token: pendingToken}),
  });
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  if (!USE_API) {
    pendingToken = null;
    setAuthToken(null);
    await clearAuthStorage();
    return;
  }

  // Best-effort : on tente d'invalider le token côté serveur, mais on nettoie
  // toujours le state local même si l'appel échoue (token expiré, offline...).
  try {
    await apiFetch<void>('/api/auth/logout', {method: 'POST'});
  } catch {
    // best-effort
  } finally {
    pendingToken = null;
    setAuthToken(null);
    await clearAuthStorage();
  }
}

// ─── Forgot / Reset password (à brancher quand routes API dispo) ─────────────

export async function forgotPassword(email: string): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    return;
  }
  // TODO: brancher /api/auth/forgot-password quand le backend l'aura exposée.
  await apiFetch<void>('/api/auth/forgot-password', {
    method: 'POST',
    skipAuth: true,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email}),
  });
}

export async function resetPassword(
  token: string,
  password: string,
  passwordConfirmation: string,
): Promise<void> {
  if (!USE_API) {
    ensureMockOnlyInDev();
    return;
  }
  // TODO: brancher /api/auth/reset-password quand le backend l'aura exposée.
  await apiFetch<void>('/api/auth/reset-password', {
    method: 'POST',
    skipAuth: true,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token, password, password_confirmation: passwordConfirmation}),
  });
}
