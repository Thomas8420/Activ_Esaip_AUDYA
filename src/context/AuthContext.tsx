import React, {createContext, useContext, useState, useMemo} from 'react';
import {loginStep1, logout as apiLogout, DEV_SKIP_2FA} from '../services/authService';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** true si l'utilisateur a terminé le flux 2FA et est connecté */
  isAuthenticated: boolean;
  /** Email saisi au login — transmis à l'écran VerifyCode */
  pendingEmail: string;
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
  const [pendingEmail, setPendingEmail] = useState('');

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
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    await apiLogout();
    setIsAuthenticated(false);
    setPendingEmail('');
  };

  const value = useMemo(
    () => ({isAuthenticated, pendingEmail, loginFirstFactor, loginSuccess, logout}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAuthenticated, pendingEmail],
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
