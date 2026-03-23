import {useState} from 'react';
import {validatePassword} from '../../utils/validators';

export type NewPasswordErrors = {
  password?: string;
  confirmPassword?: string;
  cgv?: string;
  contact?: string;
};

/** Hook de gestion du formulaire "Nouveau mot de passe". */
export const useNewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptCGV, setAcceptCGV] = useState(false);
  const [contact, setContact] = useState<string | null>(null);
  const [errors, setErrors] = useState<NewPasswordErrors>({});

  const clearError = (key: keyof NewPasswordErrors) =>
    setErrors(prev => ({...prev, [key]: undefined}));

  const validate = (): boolean => {
    const e: NewPasswordErrors = {};
    const pwdError = validatePassword(password);
    if (pwdError) e.password = pwdError;
    if (!confirmPassword) e.confirmPassword = 'Veuillez confirmer votre mot de passe';
    else if (password !== confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (!acceptCGV) e.cgv = 'Vous devez accepter les CGV - CGU';
    if (contact === null) e.contact = 'Veuillez choisir OUI ou NON';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return {
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    acceptCGV, setAcceptCGV,
    contact, setContact,
    errors, clearError, validate,
  };
};
