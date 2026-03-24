import React, { createContext, useState, useMemo, useCallback, ReactNode, useContext } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Données collectées à l'étape 1 (identité + mot de passe + CGV) */
interface Step1Data {
  email: string;
  nom: string;
  prenom: string;
  /** Mot de passe — jamais loggé ni persisté en clair */
  password: string;
  cgvAccepted: boolean;
}

/** Données collectées à l'étape 2 (informations personnelles) */
interface Step2Data {
  genre: 'homme' | 'femme';
  dateNaissance: string;
  numeroSecu: string;
  adresse: string;
  complement: string;
  codePostal: string;
  ville: string;
  pays: string;
  telephoneFixe: string;
  telephoneMobile: string;
  profession: string;
  /** URI locale de la photo (non encore uploadée) */
  photoUri: string | null;
}

/** Données collectées à l'étape 3 (questionnaire auditif) */
interface Step3Data {
  /** Q1 — durée de la gêne */
  dureeGene: string;
  /** Q2–Q9 — réponses Oui/Non indexées par position */
  ouiNon: string[];
  /** Q3 — évolution de la surdité */
  evolutionSurdite: string;
  /** Q10 — situations difficiles (case verte) */
  situationsDifficiles: string[];
  /** Q10 bis — situations difficiles complémentaires */
  situationsDifficilesBis: string[];
}

/** Données collectées à l'étape 4 (informations médicales) */
interface Step4Data {
  taille: string;
  poids: string;
  groupeSanguin: string;
  antecedents: string;
  traitements: string;
  allergies: string;
}

/** Données collectées à l'étape 5 (professionnel de santé) */
interface Step5Data {
  specialite: string;
  professionnelNom: string;
  professionnelPrenom: string;
  professionnelCodePostal: string;
  professionnelVille: string;
}

export interface RegisterData extends Step1Data, Step2Data, Step3Data, Step4Data, Step5Data {}

// ─── Valeurs par défaut ───────────────────────────────────────────────────────

const DEFAULT_REGISTER_DATA: RegisterData = {
  // Step 1
  email: '',
  nom: '',
  prenom: '',
  password: '',
  cgvAccepted: false,
  // Step 2
  genre: 'homme',
  dateNaissance: '',
  numeroSecu: '',
  adresse: '',
  complement: '',
  codePostal: '',
  ville: '',
  pays: '',
  telephoneFixe: '',
  telephoneMobile: '',
  profession: '',
  photoUri: null,
  // Step 3
  dureeGene: '',
  ouiNon: new Array(7).fill(''),
  evolutionSurdite: '',
  situationsDifficiles: [],
  situationsDifficilesBis: [],
  // Step 4
  taille: '',
  poids: '',
  groupeSanguin: '',
  antecedents: '',
  traitements: '',
  allergies: '',
  // Step 5
  specialite: '',
  professionnelNom: '',
  professionnelPrenom: '',
  professionnelCodePostal: '',
  professionnelVille: '',
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface RegisterContextType {
  registerData: RegisterData;
  setRegisterData: (data: Partial<RegisterData>) => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registerData, setRegisterData] = useState<RegisterData>(DEFAULT_REGISTER_DATA);

  const updateRegisterData = useCallback((data: Partial<RegisterData>) => {
    setRegisterData(prev => ({ ...prev, ...data }));
  }, []);

  const contextValue = useMemo(
    () => ({ registerData, setRegisterData: updateRegisterData }),
    [registerData, updateRegisterData],
  );

  return (
    <RegisterContext.Provider value={contextValue}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegister doit être utilisé à l'intérieur de RegisterProvider");
  }
  return context;
};
