import React, { createContext, useState, ReactNode, useContext } from 'react';

interface RegisterData {
  email: string;
  nom: string;
  prenom: string;
}

interface RegisterContextType {
  registerData: RegisterData;
  setRegisterData: (data: Partial<RegisterData>) => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registerData, setRegisterDataState] = useState<RegisterData>({
    email: '',
    nom: '',
    prenom: '',
  });

  const setRegisterData = (data: Partial<RegisterData>) => {
    setRegisterDataState(prev => ({ ...prev, ...data }));
  };

  return (
    <RegisterContext.Provider value={{ registerData, setRegisterData }}>
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
