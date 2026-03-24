// src/context/LanguageContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';

export type { Language };

// ─── Persistence module-level ─────────────────────────────────────────────────
// TODO: remplacer par @react-native-async-storage/async-storage pour persistance inter-sessions
let _persistedLanguage: Language = 'FR';

// ─── Context type ─────────────────────────────────────────────────────────────

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Traduit une clé. Fallback FR si la clé n'existe pas dans la langue courante. */
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(_persistedLanguage);

  const setLanguage = useCallback((lang: Language) => {
    _persistedLanguage = lang;
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string): string =>
      TRANSLATIONS[language][key] ?? TRANSLATIONS.FR[key] ?? key,
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage doit être utilisé à l\'intérieur de LanguageProvider');
  }
  return ctx;
};
