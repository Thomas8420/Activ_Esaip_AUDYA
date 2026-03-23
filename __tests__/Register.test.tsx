/**
 * @format
 * Tests du flux d'inscription : RegisterContext, pages Step1→5, Success, RegisterFlow.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationProvider } from '../src/context/NavigationContext';
import { RegisterProvider, useRegister } from '../src/context/RegisterContext';
import RegisterFlow from '../src/components/Register/RegisterFlow';
import RegisterStep1Page from '../src/components/Register/RegisterStep1Page';
import RegisterStep1BisPage from '../src/components/Register/RegisterStep1BisPage';
import RegisterStep2Page from '../src/components/Register/RegisterStep2Page';
import RegisterStep3Page from '../src/components/Register/RegisterStep3Page';
import RegisterStep4Page from '../src/components/Register/RegisterStep4Page';
import RegisterStep5Page from '../src/components/Register/RegisterStep5Page';
import RegisterSuccessPage from '../src/components/Register/RegisterSuccessPage';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Enveloppe les pages Register avec NavigationProvider (register-step1) + RegisterProvider.
 * Miroir du wrapper produit par RegisterFlow.
 */
const renderRegisterPage = (node: React.ReactElement) =>
  ReactTestRenderer.create(
    <NavigationProvider initialScreen="register-step1">
      <RegisterProvider>{node}</RegisterProvider>
    </NavigationProvider>,
  );

// ─── RegisterContext ──────────────────────────────────────────────────────────

describe('RegisterContext', () => {
  test('RegisterProvider renders without crashing', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <RegisterProvider>
          <></>
        </RegisterProvider>,
      );
    });
  });

  test('useRegister throws outside RegisterProvider', async () => {
    // En React 19, les erreurs de composants ne remontent plus au caller de create().
    // On utilise un ErrorBoundary pour capturer l'erreur lancée par le hook.
    let caughtError: Error | null = null;
    class Boundary extends React.Component<
      { children: React.ReactNode },
      { hasError: boolean }
    > {
      state = { hasError: false };
      static getDerivedStateFromError() { return { hasError: true }; }
      componentDidCatch(e: Error) { caughtError = e; }
      render() { return this.state.hasError ? null : this.props.children; }
    }
    const BadConsumer = () => { useRegister(); return null; };

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<Boundary><BadConsumer /></Boundary>);
    });
    spy.mockRestore();

    expect(caughtError).not.toBeNull();
    expect((caughtError as Error).message).toContain('RegisterProvider');
  });

  test('registerData initializes with empty strings', async () => {
    let capturedData: { email: string; nom: string; prenom: string } | null = null;
    const Consumer = () => {
      const { registerData } = useRegister();
      capturedData = registerData;
      return null;
    };
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <RegisterProvider>
          <Consumer />
        </RegisterProvider>,
      );
    });
    expect(capturedData).toEqual({ email: '', nom: '', prenom: '' });
  });

  test('setRegisterData updates a single field without erasing others', async () => {
    let captured: { email: string; nom: string; prenom: string } | null = null;
    let setter: ((d: Partial<{ email: string; nom: string; prenom: string }>) => void) | null = null;

    const Consumer = () => {
      const { registerData, setRegisterData } = useRegister();
      captured = registerData;
      setter = setRegisterData;
      return null;
    };

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <RegisterProvider>
          <Consumer />
        </RegisterProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      setter!({ email: 'test@example.com', nom: 'Dupont', prenom: 'Jean' });
    });

    expect(captured!.email).toBe('test@example.com');
    expect(captured!.nom).toBe('Dupont');
    expect(captured!.prenom).toBe('Jean');
  });

  test('setRegisterData merges partially without erasing other fields', async () => {
    let captured: { email: string; nom: string; prenom: string } | null = null;
    let setter: ((d: Partial<{ email: string; nom: string; prenom: string }>) => void) | null = null;

    const Consumer = () => {
      const { registerData, setRegisterData } = useRegister();
      captured = registerData;
      setter = setRegisterData;
      return null;
    };

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <RegisterProvider>
          <Consumer />
        </RegisterProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      setter!({ email: 'init@example.com', nom: 'Martin', prenom: 'Paul' });
    });
    await ReactTestRenderer.act(async () => {
      setter!({ prenom: 'Pierre' }); // mise à jour partielle
    });

    // nom et email doivent être préservés
    expect(captured!.email).toBe('init@example.com');
    expect(captured!.nom).toBe('Martin');
    expect(captured!.prenom).toBe('Pierre');
  });
});

// ─── Validation Step 1 — logique pure ────────────────────────────────────────
// Miroir de la fonction validate() dans RegisterStep1Page.tsx

type Step1Form = {
  nom: string; prenom: string; email: string;
  motDePasse: string; confirmation: string; cgv: boolean;
};
type Step1Errors = {
  nom?: string; prenom?: string; email?: string;
  motDePasse?: string; confirmation?: string; cgv?: string;
};

function validateStep1(form: Step1Form): Step1Errors {
  const e: Step1Errors = {};
  if (!form.nom.trim())          e.nom          = 'Veuillez remplir ce champ !';
  if (!form.prenom.trim())       e.prenom       = 'Veuillez remplir ce champ !';
  if (!form.email.trim())        e.email        = 'Veuillez remplir ce champ !';
  if (!form.motDePasse.trim())   e.motDePasse   = 'Veuillez remplir ce champ !';
  if (!form.confirmation.trim()) e.confirmation = 'Veuillez remplir ce champ !';
  else if (form.confirmation !== form.motDePasse) {
    e.confirmation = 'Les mots de passe ne correspondent pas';
  }
  if (!form.cgv) e.cgv = 'Vous devez accepter les CGV - CGU';
  return e;
}

describe('Validation — Étape 1', () => {
  const base: Step1Form = {
    nom: 'Dupont', prenom: 'Jean', email: 'jean@example.com',
    motDePasse: 'Secret1!', confirmation: 'Secret1!', cgv: true,
  };

  test('formulaire valide → aucune erreur', () => {
    expect(Object.keys(validateStep1(base))).toHaveLength(0);
  });

  test('champs vides → toutes les erreurs présentes', () => {
    const errors = validateStep1({ nom: '', prenom: '', email: '', motDePasse: '', confirmation: '', cgv: false });
    expect(errors.nom).toBeTruthy();
    expect(errors.prenom).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.motDePasse).toBeTruthy();
    expect(errors.confirmation).toBeTruthy();
    expect(errors.cgv).toBeTruthy();
  });

  test('mots de passe différents → erreur confirmation', () => {
    const errors = validateStep1({ ...base, confirmation: 'Autre123!' });
    expect(errors.confirmation).toBe('Les mots de passe ne correspondent pas');
  });

  test('CGV non cochée → erreur cgv', () => {
    const errors = validateStep1({ ...base, cgv: false });
    expect(errors.cgv).toBe('Vous devez accepter les CGV - CGU');
  });

  test('email manquant uniquement → une seule erreur', () => {
    const errors = validateStep1({ ...base, email: '' });
    expect(errors.email).toBeTruthy();
    expect(Object.keys(errors)).toHaveLength(1);
  });

  test('confirmation vide → erreur "Veuillez remplir" (pas "ne correspond pas")', () => {
    const errors = validateStep1({ ...base, confirmation: '' });
    expect(errors.confirmation).toBe('Veuillez remplir ce champ !');
  });
});

// ─── Validation Step 2 — logique pure ────────────────────────────────────────

type Step2Errors = {
  dateNaissance?: string; nom?: string; prenom?: string;
  numeroSecu?: string; adresse?: string; ville?: string;
  pays?: string; telephoneMobile?: string; profession?: string;
};
type Step2Form = {
  dateNaissance: string; nom: string; prenom: string; numeroSecu: string;
  adresse: string; ville: string; pays: string; telephoneMobile: string; profession: string;
};

function validateStep2(form: Step2Form): Step2Errors {
  const e: Step2Errors = {};
  if (!form.dateNaissance.trim())   e.dateNaissance   = 'Veuillez remplir ce champ !';
  if (!form.nom.trim())             e.nom             = 'Veuillez remplir ce champ !';
  if (!form.prenom.trim())          e.prenom          = 'Veuillez remplir ce champ !';
  if (!form.adresse.trim())         e.adresse         = 'Veuillez remplir ce champ !';
  if (!form.ville.trim())           e.ville           = 'Veuillez remplir ce champ !';
  if (!form.pays)                   e.pays            = 'Veuillez remplir ce champ !';
  if (!form.telephoneMobile.trim()) e.telephoneMobile = 'Veuillez remplir ce champ !';
  if (!form.profession.trim())      e.profession      = 'Veuillez remplir ce champ !';
  if (!form.numeroSecu.trim())      e.numeroSecu      = 'Veuillez remplir ce champ !';
  else if (!/^\d{13}$/.test(form.numeroSecu.trim())) {
    e.numeroSecu = 'Le numéro doit être composé de 13 chiffres';
  }
  return e;
}

describe('Validation — Étape 2', () => {
  const base: Step2Form = {
    dateNaissance: '01/01/1980', nom: 'Dupont', prenom: 'Jean',
    numeroSecu: '1800175075050',
    adresse: '10 rue de la Paix', ville: 'Paris', pays: 'France',
    telephoneMobile: '0612345678', profession: 'Ingénieur',
  };

  test('formulaire valide → aucune erreur', () => {
    expect(Object.keys(validateStep2(base))).toHaveLength(0);
  });

  test('numéro sécu vide → erreur "Veuillez remplir"', () => {
    expect(validateStep2({ ...base, numeroSecu: '' }).numeroSecu).toBe('Veuillez remplir ce champ !');
  });

  test('numéro sécu trop court → erreur format', () => {
    expect(validateStep2({ ...base, numeroSecu: '123456' }).numeroSecu).toBe(
      'Le numéro doit être composé de 13 chiffres',
    );
  });

  test('numéro sécu avec lettres → erreur format', () => {
    expect(validateStep2({ ...base, numeroSecu: '1800175abc050' }).numeroSecu).toBe(
      'Le numéro doit être composé de 13 chiffres',
    );
  });

  test(`numéro sécu exactement 13 chiffres → pas d'erreur sécu`, () => {
    const errors = validateStep2({ ...base, numeroSecu: '1800175075050' });
    expect(errors.numeroSecu).toBeUndefined();
  });

  test('pays manquant → erreur pays', () => {
    expect(validateStep2({ ...base, pays: '' }).pays).toBeTruthy();
  });
});

// ─── Validation Step 4 — logique pure ────────────────────────────────────────

type Step4Errors = { taille?: string; poids?: string };

function validateStep4(taille: string, poids: string): Step4Errors {
  const e: Step4Errors = {};
  if (!taille.trim()) e.taille = 'Veuillez remplir ce champ !';
  if (!poids.trim())  e.poids  = 'Veuillez remplir ce champ !';
  return e;
}

describe('Validation — Étape 4', () => {
  test('taille et poids renseignés → aucune erreur', () => {
    expect(Object.keys(validateStep4('175', '70'))).toHaveLength(0);
  });

  test('taille vide → erreur taille uniquement', () => {
    const errors = validateStep4('', '70');
    expect(errors.taille).toBeTruthy();
    expect(errors.poids).toBeUndefined();
  });

  test('poids vide → erreur poids uniquement', () => {
    const errors = validateStep4('175', '');
    expect(errors.poids).toBeTruthy();
    expect(errors.taille).toBeUndefined();
  });

  test('taille et poids vides → deux erreurs', () => {
    expect(Object.keys(validateStep4('', ''))).toHaveLength(2);
  });
});

// ─── Validation Step 5 — logique pure ────────────────────────────────────────

function validateStep5(ville: string): { ville?: string } {
  return ville.trim() ? {} : { ville: 'Veuillez remplir ce champ !' };
}

describe('Validation — Étape 5', () => {
  test('ville renseignée → aucune erreur', () => {
    expect(Object.keys(validateStep5('Paris'))).toHaveLength(0);
  });

  test('ville vide → erreur ville', () => {
    expect(validateStep5('').ville).toBeTruthy();
  });

  test('ville avec espaces uniquement → erreur ville', () => {
    expect(validateStep5('   ').ville).toBeTruthy();
  });
});

// ─── RegisterFlow ─────────────────────────────────────────────────────────────

describe('RegisterFlow', () => {
  test('renders without crashing', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(<RegisterFlow onComplete={jest.fn()} />);
    });
  });

  test(`affiche l'étape 1 par défaut (texte "1 sur 5")`, async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<RegisterFlow onComplete={jest.fn()} />);
    });
    expect(JSON.stringify(renderer!.toJSON())).toContain('1 sur 5');
  });

  test(`affiche le titre de création de compte à l'étape 1`, async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<RegisterFlow onComplete={jest.fn()} />);
    });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Informations de création de compte');
  });
});

// ─── RegisterStep1Page ───────────────────────────────────────────────────────

describe('RegisterStep1Page', () => {
  test('renders without crashing', async () => {
    await ReactTestRenderer.act(async () => { renderRegisterPage(<RegisterStep1Page />); });
  });

  test('affiche "1 sur 5"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep1Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('1 sur 5');
  });

  test('affiche le titre du formulaire', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep1Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Informations de création de compte');
  });

  test('affiche les placeholders des champs obligatoires', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep1Page />); });
    const text = JSON.stringify(renderer!.toJSON());
    expect(text).toContain('Nom *');
    expect(text).toContain('Prénom *');
    expect(text).toContain('Email *');
    expect(text).toContain('Mot de passe *');
  });

  test('affiche la mention CGV', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep1Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('CGV');
  });

  test('affiche le bouton Suivant', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep1Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Suivant');
  });

  test(`n'affiche aucune erreur au rendu initial`, async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep1Page />); });
    const text = JSON.stringify(renderer!.toJSON());
    expect(text).not.toContain('Veuillez remplir ce champ');
    expect(text).not.toContain('ne correspondent pas');
  });
});

// ─── RegisterStep1BisPage ────────────────────────────────────────────────────

describe('RegisterStep1BisPage', () => {
  test('renders without crashing', async () => {
    await ReactTestRenderer.act(async () => { renderRegisterPage(<RegisterStep1BisPage />); });
  });

  test('affiche le titre "E-mail de vérification"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep1BisPage />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('E-mail de vérification');
  });

  test('affiche le bouton "Renvoyer l\'email"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep1BisPage />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain("Renvoyer l'email");
  });

  test(`affiche le message d'instruction`, async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep1BisPage />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('e-mail de vérification');
  });
});

// ─── RegisterStep2Page ───────────────────────────────────────────────────────

describe('RegisterStep2Page', () => {
  test('renders without crashing', async () => {
    await ReactTestRenderer.act(async () => { renderRegisterPage(<RegisterStep2Page />); });
  });

  test('affiche "2 sur 5"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep2Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('2 sur 5');
  });

  test('affiche le titre "Informations personnelles"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep2Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Informations personnelles');
  });

  test('affiche les champs obligatoires', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep2Page />); });
    const text = JSON.stringify(renderer!.toJSON());
    expect(text).toContain('Nom *');
    expect(text).toContain('Prénom *');
    expect(text).toContain('Adresse *');
    expect(text).toContain('Ville *');
  });

  test('affiche le sélecteur de genre', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep2Page />); });
    const text = JSON.stringify(renderer!.toJSON());
    expect(text).toContain('Homme');
    expect(text).toContain('Femme');
  });

  test('affiche le bouton Suivant', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep2Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Suivant');
  });
});

// ─── RegisterStep3Page ───────────────────────────────────────────────────────

describe('RegisterStep3Page', () => {
  test('renders without crashing', async () => {
    await ReactTestRenderer.act(async () => { renderRegisterPage(<RegisterStep3Page />); });
  });

  test('affiche "3 sur 5"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep3Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('3 sur 5');
  });

  test('affiche le titre "Questionnaire auditif"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep3Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Questionnaire auditif');
  });

  test('affiche la question 1 sur la gêne auditive', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep3Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('gêne auditive');
  });

  test('affiche le bouton "Je valide le questionnaire"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep3Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Je valide le questionnaire');
  });

  test('affiche les questions Oui/Non', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep3Page />); });
    const text = JSON.stringify(renderer!.toJSON());
    expect(text).toContain('dispositif auditif');
    expect(text).toContain('acouphènes');
  });
});

// ─── RegisterStep4Page ───────────────────────────────────────────────────────

describe('RegisterStep4Page', () => {
  test('renders without crashing', async () => {
    await ReactTestRenderer.act(async () => { renderRegisterPage(<RegisterStep4Page />); });
  });

  test('affiche "4 sur 5"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep4Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('4 sur 5');
  });

  test('affiche le titre "Informations médicales"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep4Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Informations médicales');
  });

  test('affiche les champs taille et poids', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep4Page />); });
    const text = JSON.stringify(renderer!.toJSON());
    expect(text).toContain('taille');
    expect(text).toContain('poids');
  });

  test('affiche la case Fumeur', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep4Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Fumeur');
  });

  test('affiche le bouton Suivant', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep4Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Suivant');
  });

  test(`n'affiche aucune erreur au rendu initial`, async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep4Page />); });
    expect(JSON.stringify(renderer!.toJSON())).not.toContain('Veuillez remplir ce champ');
  });
});

// ─── RegisterStep5Page ───────────────────────────────────────────────────────

describe('RegisterStep5Page', () => {
  test('renders without crashing', async () => {
    await ReactTestRenderer.act(async () => { renderRegisterPage(<RegisterStep5Page />); });
  });

  test('affiche "5 sur 5"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep5Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('5 sur 5');
  });

  test('affiche le titre "Ajouter un professionnel de santé"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep5Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Ajouter un professionnel de santé');
  });

  test('affiche les champs de recherche', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep5Page />); });
    const text = JSON.stringify(renderer!.toJSON());
    expect(text).toContain('Ville *');
    expect(text).toContain('Spécialité');
  });

  test('affiche le bouton Rechercher', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep5Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Rechercher');
  });

  test('affiche le bouton "Je ne trouve pas"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep5Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Je ne trouve pas');
  });

  test('affiche le bouton "Je valide et je passe"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep5Page />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Je valide et je passe');
  });

  test(`n'affiche aucune erreur au rendu initial`, async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterStep5Page />); });
    expect(JSON.stringify(renderer!.toJSON())).not.toContain('Veuillez remplir ce champ');
  });
});

// ─── RegisterSuccessPage ─────────────────────────────────────────────────────

describe('RegisterSuccessPage', () => {
  test('renders without crashing', async () => {
    await ReactTestRenderer.act(async () => { renderRegisterPage(<RegisterSuccessPage />); });
  });

  test('affiche "Félicitations"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterSuccessPage />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Félicitations');
  });

  test('affiche le bouton "Accéder à Audya"', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterSuccessPage />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Accéder à Audya');
  });

  test('affiche le nom par défaut "Patient AUDYA" quand le contexte est vide', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterSuccessPage />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Patient AUDYA');
  });

  test('affiche le nom complet quand le contexte est alimenté', async () => {
    const Wrapper = () => {
      const { setRegisterData } = useRegister();
      React.useEffect(() => {
        setRegisterData({ nom: 'Dupont', prenom: 'Jean' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return <RegisterSuccessPage />;
    };
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <NavigationProvider initialScreen="register-step1">
          <RegisterProvider>
            <Wrapper />
          </RegisterProvider>
        </NavigationProvider>,
      );
    });
    const text = JSON.stringify(renderer!.toJSON());
    expect(text).toContain('Jean');
    expect(text).toContain('DUPONT');
  });

  test('affiche la description de confirmation', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => { renderer = renderRegisterPage(<RegisterSuccessPage />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain('compte patient est créé');
  });
});
