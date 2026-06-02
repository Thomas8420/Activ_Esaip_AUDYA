/**
 * secureStorage — accès Keychain (iOS) / Keystore (Android) via
 * react-native-encrypted-storage. Conçu pour le token Sanctum et l'objet `user`
 * de la session courante. Ne JAMAIS y stocker un mot de passe.
 *
 * Toutes les fonctions échouent silencieusement (warn + null) si le stockage
 * natif est indisponible — l'app ne doit pas crasher si le Keychain est verrouillé.
 */

import EncryptedStorage from 'react-native-encrypted-storage';

const KEY_AUTH_TOKEN = 'audya.authToken';
const KEY_AUTH_USER = 'audya.authUser';

export interface StoredUser {
  id: number | string;
  email: string;
  firstName?: string;
  lastName?: string;
  // Le mapper d'authService applique snake_case → camelCase ; on garde un type
  // ouvert (champs additionnels conservés) pour limiter les ruptures backend.
  [key: string]: unknown;
}

// ─── Token ───────────────────────────────────────────────────────────────────

export async function getStoredAuthToken(): Promise<string | null> {
  try {
    return (await EncryptedStorage.getItem(KEY_AUTH_TOKEN)) ?? null;
  } catch (err) {
    console.warn('[secureStorage] getStoredAuthToken failed:', (err as Error).message);
    return null;
  }
}

export async function setStoredAuthToken(token: string): Promise<void> {
  try {
    await EncryptedStorage.setItem(KEY_AUTH_TOKEN, token);
  } catch (err) {
    console.warn('[secureStorage] setStoredAuthToken failed:', (err as Error).message);
  }
}

export async function clearStoredAuthToken(): Promise<void> {
  try {
    await EncryptedStorage.removeItem(KEY_AUTH_TOKEN);
  } catch {
    // best-effort
  }
}

// ─── User ────────────────────────────────────────────────────────────────────

export async function getStoredUser(): Promise<StoredUser | null> {
  try {
    const raw = await EncryptedStorage.getItem(KEY_AUTH_USER);
    if (!raw) {return null;}
    return JSON.parse(raw) as StoredUser;
  } catch (err) {
    console.warn('[secureStorage] getStoredUser failed:', (err as Error).message);
    return null;
  }
}

export async function setStoredUser(user: StoredUser): Promise<void> {
  try {
    await EncryptedStorage.setItem(KEY_AUTH_USER, JSON.stringify(user));
  } catch (err) {
    console.warn('[secureStorage] setStoredUser failed:', (err as Error).message);
  }
}

export async function clearStoredUser(): Promise<void> {
  try {
    await EncryptedStorage.removeItem(KEY_AUTH_USER);
  } catch {
    // best-effort
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Efface tout l'état d'auth — appelé par logout() et après une 401 inattendue.
 */
export async function clearAuthStorage(): Promise<void> {
  await Promise.all([clearStoredAuthToken(), clearStoredUser()]);
}
