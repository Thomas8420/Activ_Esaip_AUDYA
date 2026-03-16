// Domaines email autorisés dans l'application
export const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'outlook.com', 'outlook.fr', 'hotmail.com', 'hotmail.fr', 'live.com', 'live.fr', 'msn.com',
  'orange.fr', 'orange.com',
  'yahoo.com', 'yahoo.fr',
  'icloud.com', 'me.com',
  'protonmail.com', 'pm.me',
  'laposte.net', 'sfr.fr', 'free.fr', 'wanadoo.fr', 'bbox.fr',
];

// Vérifie que l'email est valide ET appartient à un domaine autorisé
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
};

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "L'email est requis",
  EMAIL_INVALID: 'Veuillez utiliser une adresse Gmail, Outlook, Orange, Yahoo ou similaire',
  PASSWORD_REQUIRED: 'Le mot de passe est requis',
  PASSWORD_TOO_SHORT: 'Minimum 8 caractères',
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
};
