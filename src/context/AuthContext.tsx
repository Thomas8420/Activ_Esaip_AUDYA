import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {loginStep1, logout as apiLogout, DEV_SKIP_2FA} from '../services/authService';
import {setAuthToken, setUnauthorizedHandler} from '../services/api';
import {
  clearAuthStorage,
  getStoredAuthToken,
  getStoredUser,
  type StoredUser,
} from '../services/secureStorage';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** true si l'utilisateur a terminé le flux 2FA et est connecté */
  isAuthenticated: boolean;
  /** true tant que l'hydratation du token depuis le Keychain n'est pas finie */
  isHydrating: boolean;
  /** Email saisi au login — transmis à l'écran VerifyCode */
  pendingEmail: string;
  /** Utilisateur connecté (null tant que pas authentifié) */
  user: StoredUser | null;
  /** Appel du premier facteur (email + password) */
  loginFirstFactor: (email: string, password: string) => Promise<void>;
  /**
   * Appelé après succès du 2FA — ouvre l'app principale.
   * Throw si aucun token n'est présent en storage (défense en profondeur :
   * empêche tout appelant de passer isAuthenticated=true sans avoir réussi
   * loginStep2, qui est le seul à écrire un token dans le Keystore).
   */
  loginSuccess: () => Promise<void>;
  /** Déconnexion */
  logout: () => Promise<void>;
}

// ─── Contexte ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const [pendingEmail, setPendingEmail] = useState('');
  const [user, setUser] = useState<StoredUser | null>(null);

  // Handler 401 : si le backend rejette le token (expiration / révocation),
  // on coupe immédiatement la session locale pour éviter une "session zombie".
  // Pas d'appel réseau ici (le token est déjà invalide) — uniquement clear local.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAuthToken(null);
      setIsAuthenticated(false);
      setUser(null);
      setPendingEmail('');
      void clearAuthStorage();
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  // Hydratation au démarrage : si un token est persisté dans le Keychain,
  // on restaure la session sans repasser par login.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [token, storedUser] = await Promise.all([
        getStoredAuthToken(),
        getStoredUser(),
      ]);
      if (cancelled) {return;}
      if (token && storedUser) {
        setAuthToken(token);
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setIsHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loginFirstFactor = async (
    email: string,
    password: string,
  ): Promise<void> => {
    await loginStep1(email, password);
    setPendingEmail(email);
    // En mode dev (DEV_SKIP_2FA = true) : connexion directe sans 2FA
    if (DEV_SKIP_2FA) {
      setIsAuthenticated(true);
    }
  };

  const loginSuccess = async (): Promise<void> => {
    // Seul authService.loginStep2 écrit un token dans le Keystore. Sa présence
    // est donc la preuve qu'un 2FA valide vient d'être validé par le backend.
    // Si un appelant tente loginSuccess() sans avoir passé le 2FA, on refuse
    // et on nettoie tout résidu éventuel.
    const [token, stored] = await Promise.all([
      getStoredAuthToken(),
      getStoredUser(),
    ]);
    if (!token || !stored) {
      await clearAuthStorage();
      throw new Error('SECURITY: loginSuccess called without a valid auth token.');
    }
    setUser(stored);
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    // Le state local est toujours réinitialisé, même si l'appel backend échoue
    try {
      await apiLogout();
    } finally {
      setIsAuthenticated(false);
      setPendingEmail('');
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isHydrating,
      pendingEmail,
      user,
      loginFirstFactor,
      loginSuccess,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, isHydrating, pendingEmail, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
