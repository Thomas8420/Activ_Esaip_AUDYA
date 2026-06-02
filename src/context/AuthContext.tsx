import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {loginStep1, logout as apiLogout, DEV_SKIP_2FA} from '../services/authService';
import {setAuthToken} from '../services/api';
import {
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
  /** Appelé après succès du 2FA — ouvre l'app principale */
  loginSuccess: () => void;
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

  const loginSuccess = () => {
    // À ce stade authService a déjà stocké token + user ; on hydrate le state.
    (async () => {
      const stored = await getStoredUser();
      setUser(stored);
      setIsAuthenticated(true);
    })();
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
