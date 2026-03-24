# 07 — Tests

## Framework

**Jest 29** + **react-test-renderer** (pas de React Native Testing Library).

Fichier de config : `jest.config.js` à la racine.

---

## Commandes

```bash
# Tous les tests
npm test

# Fichier unique
npm test -- NavigationContext.test.tsx

# Pattern de fichier
npm test -- --testPathPattern="services/"

# Mode watch
npm test -- --watch

# Couverture
npm test -- --coverage
```

---

## Structure des tests

Les tests sont dans `__tests__/` et **mirent la structure de `src/`** :

```
__tests__/
  App.test.tsx                  # Rendu racine
  AuthContext.test.tsx          # Contexte auth
  NavigationContext.test.tsx    # Routeur (navigateTo, goBack, goHome)
  Professionals.test.tsx        # Composant ProfessionalsPage
  Filters.test.tsx              # Composant ProfessionalsFilters
  Settings.test.tsx             # Page Paramètres
  Profile.test.tsx              # Page Profil
  Messaging.test.tsx            # Pages Messagerie
  Agenda.test.tsx               # Pages Agenda
  Register.test.tsx             # Flux inscription (Steps 1–5)
  Validators.test.ts            # Utilitaires validation
  services/
    api.test.ts                 # Wrapper HTTP (timeout, erreurs, headers)
    authService.test.ts         # Service auth
    professionalsService.test.ts # Service professionnels
  utils/
    agendaHelpers.test.ts       # Calculs calendrier (buildCalendarGrid, formatDateISO)
```

**Total : 15 fichiers de test**

---

## Ce qui est couvert

| Domaine | Couverture |
|---------|-----------|
| Routeur navigation (navigateTo, goBack, goHome, paramètres) | ✅ |
| Contexte auth (login, logout, 2FA) | ✅ |
| Filtres professionnels (recherche, spécialité, CP, reset) | ✅ |
| Service API (timeout, ApiError, headers) | ✅ |
| Service auth (login, vérification 2FA) | ✅ |
| Service professionnels (CRUD, mapping snake_case↔camelCase) | ✅ |
| Utilitaires agenda (calcul grille, formatage dates) | ✅ |
| Validation email | ✅ |
| Formulaire inscription (Steps 1–5) | ✅ |
| Pages Health, Appareillage, Questionnaire, News | ⬜ |
| Service notification, questionnaire, news | ⬜ |
| Système i18n (LanguageContext) | ⬜ |

---

## Conventions de test

### Nommage des fichiers
```
__tests__/<FeatureName>.test.tsx     # Composants React
__tests__/services/<name>.test.ts   # Services purs
__tests__/utils/<name>.test.ts      # Utilitaires
```

### Structure d'un test de composant

```tsx
import React from 'react';
import renderer from 'react-test-renderer';
import { NavigationProvider } from '../src/context/NavigationContext';

describe('MyComponent', () => {
  it('renders without crashing', () => {
    const tree = renderer.create(
      <NavigationProvider>
        <MyComponent />
      </NavigationProvider>
    ).toJSON();
    expect(tree).toBeTruthy();
  });

  it('handles press', () => {
    // ...
  });
});
```

### Points d'attention

- Les composants qui utilisent `useNavigation` doivent être enveloppés dans `<NavigationProvider>`
- Les composants qui utilisent `useLanguage` doivent être enveloppés dans `<LanguageProvider>`
- Les services mockés doivent l'être avec `jest.mock('../src/services/myService')`
- **Ne jamais mocker `apiFetch` pour contourner les tests** — les tests d'intégration doivent valider le mapping réel

---

## Tests à ajouter en priorité

| Priorité | Test | Raison |
|----------|------|--------|
| 🔴 Haute | `LanguageContext.test.tsx` | Feature critique, zéro couverture |
| 🔴 Haute | `services/notificationService.test.ts` | Feature récente |
| 🟡 Moyenne | `services/questionnaireService.test.ts` | Logique de soumission/mapping |
| 🟡 Moyenne | `QuestionnairePage.test.tsx` | Chargement async + isLoading |
| 🟢 Basse | `NotificationPanel.test.tsx` | UI panel |
