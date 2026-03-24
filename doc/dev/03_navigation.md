# 03 — Navigation

## Principe

AUDYA n'utilise **pas React Navigation**. Le routeur est un **stack maison** basé sur un tableau d'historique géré dans `src/context/NavigationContext.tsx`.

- `navigateTo(screen)` → push sur la pile
- `goBack()` → pop (mise à jour fonctionnelle — pas de stale closure)
- `goHome()` → reset pile → `['home']`

---

## Type Screen (union complète)

```typescript
export type Screen =
  | 'home' | 'health' | 'professionals' | 'professional-profile'
  | 'add-professional' | 'invite-professional'
  | 'settings' | 'my-profile'
  | 'messaging' | 'messaging-chat'
  | 'agenda' | 'agenda-day' | 'agenda-form'
  | 'carnet-audition' | 'appareillage'
  | 'questionnaire' | 'questionnaire-detail'
  | 'news'
  | 'register-step1' | 'register-step1bis' | 'register-step2'
  | 'register-step3' | 'register-step4' | 'register-step5'
  | 'register-success';
```

---

## API du contexte

| Méthode | Description | Données transmises |
|---------|-------------|-------------------|
| `navigateTo(screen)` | Push générique | — |
| `goBack()` | Pop | — |
| `goHome()` | Reset → home | — |
| `navigateToProfile(professional)` | Fiche professionnel | `SelectedProfessional` |
| `navigateToAdd()` | Formulaire ajout pro | — |
| `navigateToInvite()` | Formulaire invitation | — |
| `navigateToSettings()` | Paramètres | — |
| `navigateToMyProfile()` | Profil utilisateur | — |
| `navigateToMessaging()` | Liste conversations | — |
| `navigateToMessagingChat(conversation)` | Vue conversation | `SelectedConversation` |
| `navigateToAgenda()` | Calendrier | — |
| `navigateToAgendaDay(date)` | Vue jour | `string` (YYYY-MM-DD) |
| `navigateToAgendaForm(event?)` | Formulaire événement | `SelectedAgendaEvent \| null` |
| `navigateToHealth()` | Page Ma Santé | — |
| `navigateToQuestionnaire()` | Liste questionnaires | — |
| `navigateToQuestionnaireDetail(id)` | Formulaire questionnaire | `string` (questionnaireId) |
| `navigateToNews()` | Actualités | — |

---

## Ajouter un nouvel écran (app authentifiée)

**5 étapes, dans cet ordre :**

### 1. Ajouter le nom à l'union `Screen`

```typescript
// src/context/NavigationContext.tsx
export type Screen =
  | ... (existant)
  | 'ma-nouvelle-feature';   // ← ajouter ici
```

### 2. Créer la fonction navigate dans le contexte

```typescript
// Dans NavigationProvider
const navigateToMaFeature = useCallback(() => {
  setHistory(prev => [...prev, 'ma-nouvelle-feature']);
}, []);

// Ajouter dans l'interface NavigationContextType
navigateToMaFeature: () => void;

// Ajouter dans le useMemo value
navigateToMaFeature,
```

### 3. Ajouter le label BottomNav

```typescript
// src/components/common/BottomNav/BottomNav.tsx
const SCREEN_TRANSLATION_KEYS: Partial<Record<Screen, string>> = {
  ...
  'ma-nouvelle-feature': 'screen.maFeature',  // clé i18n
};
```

### 4. Ajouter le rendu dans App.tsx

```tsx
// App.tsx
{currentScreen === 'ma-nouvelle-feature' && <MaFeatureScreen />}
```

### 5. Ajouter le handler dans MainPage.tsx (si accessible depuis la grille)

```tsx
// src/components/MainPage/MainPage.tsx
} else if (itemId === 'ma-feature') {
  navigateToMaFeature();
}
```

---

## Flux d'inscription (routeur séparé)

L'inscription utilise un `NavigationProvider` **distinct** initialisé à `register-step1` :

```
AuthFlow (screen === 'register')
  └── RegisterFlow
        └── NavigationProvider (initialScreen="register-step1")
              └── RegisterProvider
                    └── RegisterScreenRouter
                          ├── register-step1    → RegisterStep1Screen
                          ├── register-step1bis → RegisterStep1BisScreen
                          ├── register-step2    → RegisterStep2Screen
                          ├── register-step3    → RegisterStep3Screen
                          ├── register-step4    → RegisterStep4Screen
                          ├── register-step5    → RegisterStep5Screen
                          └── register-success  → RegisterSuccessScreen
```

⚠️ Ne pas mélanger ce contexte avec celui de l'app authentifiée.

---

## Contextes liés

| Contexte | Rôle | Fichier |
|----------|------|---------|
| `NavigationContext` | Routeur principal app authentifiée | `src/context/NavigationContext.tsx` |
| `AuthContext` | État auth (`isAuthenticated`, `login`, `logout`) | `src/context/AuthContext.tsx` |
| `RegisterContext` | Données inter-étapes inscription | `src/context/RegisterContext.tsx` |
| `LanguageContext` | Langue courante + fonction `t()` | `src/context/LanguageContext.tsx` |
