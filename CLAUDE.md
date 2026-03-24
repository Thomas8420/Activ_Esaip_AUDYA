# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Posture attendue — Développeur Senior

Tu interviens sur ce projet comme un **développeur mobile senior avec 10+ ans d'expérience React Native / TypeScript**. Avant d'écrire la moindre ligne de code, tu :

1. **Lis le code existant** — jamais d'hypothèse sur ce qui est en place ; tu vérifies.
2. **Respectes les patterns établis** — Screen → Page → Component, mock/API toggle, service mapping. Si tu t'en écartes, tu l'expliques.
3. **Penses sécurité d'abord** — toute donnée entrante est hostile. Validation en entrée, pas d'exposition de tokens/credentials dans les logs, pas de `eval`, pas de `dangerouslySetInnerHTML` équivalent côté RN.
4. **Développes de manière défensive** — tu traites les cas d'erreur (réseau down, réponse malformée, état null/undefined) sans laisser crasher l'app silencieusement.
5. **Tu ne sur-ingénierises pas** — la solution la plus simple qui satisfait le besoin est la bonne. Pas d'abstraction prématurée, pas de helpers pour un seul usage.
6. **Tu gardes la cohérence stylistique** — nommage, indentation, organisation des imports, séparation styles/.tsx, tout doit être indiscernable du code existant.
7. **Tu signales les dettes techniques** — si tu vois un problème dans du code adjacent à ta tâche, tu le notes en commentaire `// TODO` ou dans ta réponse, sans le corriger sauf si demandé.
8. **Tu ne supprimes jamais de code sans confirmation** — tu proposes, tu expliques, tu attends le feu vert.

---

## Project Overview

**Activ_Esaip_AUDYA** est une application mobile React Native / TypeScript. C'est une plateforme de gestion audiologique pour le suivi patient : coordination avec des professionnels de santé, messagerie sécurisée, agenda médical, et assistant IA intégré.

**Stack décisionnelle** : Metro + React Native 0.84 / React 19.2 / TypeScript 5.8. Pas d'Expo managed, pas de React Navigation — routeur maison stack-based.

---

## Quick Commands

### Development
- **Start Metro**: `npm start`
- **Android**: `npm run android` (second terminal)
- **iOS**: `npm run ios` (second terminal)
  - Premier setup iOS : `bundle install && bundle exec pod install`
  - Mise à jour pods : `bundle exec pod install`

### Code Quality
- **Lint**: `npm run lint`
- **Format**: `npx prettier --write .` (2 espaces, single quotes, trailing commas)
- **TypeScript check**: `npx tsc --noEmit`

### Testing
- **All tests**: `npm test`
- **Single file**: `npm test -- App.test.tsx`
- **Watch**: `npm test -- --watch`

---

## Charte graphique — Couleurs imposées par le client

> ⚠️ **Ne jamais modifier les valeurs hexadécimales de la palette.** Les couleurs sont imposées par le client et font partie de la charte graphique AUDYA. Toute modification de valeur de couleur (même pour conformité WCAG) est interdite sans validation explicite du client.

### Palette principale (`src/screens/Home/HomeScreen.styles.tsx`)
| Token | Valeur | Usage |
|-------|--------|-------|
| `orange` | `#E8622A` | Couleur primaire (boutons, accents, bottom nav) |
| `orangeLight` | `#F0936B` | Variante claire orange (hover/pressed) |
| `teal` | `#3ABFBF` | FAB chatbot |
| `white` | `#FFFFFF` | Fonds, textes sur fond coloré |
| `text` | `#2D2D2D` | Texte principal |
| `textLight` | `#6B6B6B` | Texte secondaire, placeholders |
| `border` | `#E0E0E0` | Séparateurs |
| `background` | `#f5f3ef` | Fond général |

### Palette auth (`src/styles/auth/colors.ts`)
Palette distincte pour les écrans d'authentification. Clé notable : `textPlaceholder: '#999999'`.

---

## Architecture & File Structure

### Directory Layout

```
src/
  screens/                           # Containers légers (SafeAreaView + NavBar + BottomNav)
    Home/
      HomeScreen.tsx
      HomeScreen.styles.tsx          # Palette COLORS + FONT_* partagés dans toute l'app
    Professionals/
      ProfessionalsScreen.tsx
      ProfessionalsScreen.styles.tsx
      AddProfessionalScreen.tsx
      InviteProfessionalScreen.tsx
      ProfessionalProfileScreen.tsx
    Settings/
      SettingsScreen.tsx
      SettingsScreen.styles.tsx
    Profile/
      ProfileScreen.tsx
      ProfileScreen.styles.tsx
    Messaging/
      MessagingScreen.tsx
      MessagingScreen.styles.tsx
      MessagingChatScreen.tsx
      MessagingChatScreen.styles.tsx
    Agenda/
      AgendaScreen.tsx
      AgendaScreen.styles.tsx
      AgendaDayViewScreen.tsx
      AgendaFormScreen.tsx
    Health/
      HealthScreen.tsx
      HealthScreen.styles.tsx          # Styles page Ma Santé (partagés avec HealthPage)
    Appareillage/
      AppareillageScreen.tsx
    Questionnaire/
      QuestionnaireScreen.tsx
      QuestionnaireDetailScreen.tsx
    News/
      NewsScreen.tsx
    Auth/                            # Flux d'authentification (hors NavigationContext)
      LoginScreen.tsx + .styles.ts
      VerifyCodeScreen.tsx + .styles.ts
      ForgotPasswordScreen.tsx + .styles.ts
      EmailVerificationScreen.tsx + .styles.ts
      NewPasswordScreen.tsx + .styles.ts
      PasswordChangedScreen.tsx + .styles.ts
      UseNewPassword.ts              # Custom hook reset password
    Register/                        # Flux d'inscription (hors NavigationContext principal)
      Register.styles.ts             # Styles partagés toutes les étapes (card, inputs, boutons)
      RegisterStep1Screen.tsx        # Étape 1 : création de compte (identité, MDP, CGV)
      RegisterStep1BisScreen.tsx     # Étape 1bis : vérification e-mail
      RegisterStep2Screen.tsx        # Étape 2 : informations personnelles
      RegisterStep3Screen.tsx        # Étape 3 : questionnaire auditif
      RegisterStep4Screen.tsx        # Étape 4 : informations médicales
      RegisterStep5Screen.tsx        # Étape 5 : ajout professionnel de santé
      RegisterSuccessScreen.tsx      # Écran de félicitations

  components/                        # Logique métier + UI
    MainPage/
      MainPage.tsx                   # Grille d'accueil, bannière, navigation menu
    Professionals/
      ProfessionalsPage.tsx          # Orchestrateur : liste, filtres, pagination, toggle vue
      ProfessionalsFilters.tsx       # UI filtres (recherche, spécialité, CP, ville, toggle)
      ProfessionalCard.tsx           # Vue carte — props: professional, onToggleFavorite,
                                     #   onResendInvitation, onViewProfile, onMessage
      ProfessionalListRow.tsx        # Vue ligne tableau
      ProfessionalProfilePage.tsx    # Détail professionnel
      AddProfessionalPage.tsx        # Formulaire ajout
      InviteProfessionalPage.tsx     # Formulaire invitation + consentement
    Settings/
      SettingsPage.tsx               # Onglets préférences, notifications, MDP, suppression compte
    Profile/
      ProfilePage.tsx                # Gestion profil utilisateur + upload photo
    Messaging/
      MessagingPage.tsx              # Liste conversations
      MessagingChatPage.tsx          # Vue conversation + envoi fichiers
    Agenda/
      AgendaPage.tsx                 # Calendrier (mois/semaine/jour)
      AgendaDayViewPage.tsx          # Liste événements du jour
      AgendaFormPage.tsx             # Formulaire création/édition événement
    Health/
      HealthPage.tsx                 # Résumé santé : IMC, QR Code, antécédents, documents
    Appareillage/
      AppareillagePage.tsx           # Liste appareils auditifs + historique + modal détail
      DeviceCard.tsx                 # Carte appareil (droite/gauche, marque, modèle)
    Questionnaire/
      QuestionnairePage.tsx          # Liste ERSA + EQ-5D-5L avec statut (complétion, date)
      QuestionnaireDetailPage.tsx    # Formulaire (binary/scale10/vas/choice5) + historique
                                     #   dépliable + export Share natif
    News/
      NewsPage.tsx                   # Liste 6 articles + modal lecture plein-écran + partage
    Chatbot/
      ChatbotModal.tsx               # Modal popup assistant AUDYA (slide from bottom)
    Register/                        # Flux d'inscription (pages + routeur)
      RegisterFlow.tsx               # Routeur : NavigationProvider(register-step1) + RegisterProvider
      RegisterStep1Page.tsx          # Identité, MDP, CGV — validation complète
      RegisterStep1BisPage.tsx       # Attente vérification e-mail
      RegisterStep2Page.tsx          # Infos personnelles (genre, adresse, pays, photo via image-picker)
      RegisterStep3Page.tsx          # Questionnaire auditif (Dropdown + CheckboxGroup au niveau module)
      RegisterStep4Page.tsx          # Infos médicales (taille, poids, antécédents)
      RegisterStep5Page.tsx          # Recherche professionnel de santé (mock enrichi)
      RegisterSuccessPage.tsx        # Félicitations → goHome() → retour login
    common/
      NavBar/
        NavBar.tsx                   # Logo, cloche notifs, engrenage settings, dropdown profil
      BottomNav/
        BottomNav.tsx                # Accueil | menu pill (modal 8 items) | FAB chatbot
      Button/
        Fab.tsx                      # Floating Action Button (icône chat, teal)
    Bubbles.tsx                      # Bulles décoratives partagées (auth + register)
    auth/                            # Composants partagés du flux auth
      AuthFlow.tsx                   # Contrôleur de flux : login → 2FA → register → app
      AuthContainer.tsx              # Layout wrapper avec bulles décoratives
      Button.tsx                     # Bouton auth
      Input.tsx                      # Input auth
      Bubbles.tsx                    # Bulles décoratives (auth uniquement — alias de ../Bubbles.tsx)
      styles/
        AuthContainerStyles.ts
        ButtonStyles.ts
        InputStyles.ts

  context/
    NavigationContext.tsx            # Routeur stack maison — toutes les fonctions useCallback
    AuthContext.tsx                  # État auth global (isAuthenticated, login, logout)
    RegisterContext.tsx              # Données inter-étapes d'inscription (Steps 1–5 complets)

  services/                          # Couche API — jamais d'appels directs depuis les composants
    api.ts                           # Wrapper fetch de base (apiFetch<T>, ApiError, timeout 10s)
    professionalsService.ts          # CRUD professionnels + mapping snake_case↔camelCase
    settingsService.ts               # Settings API
    authService.ts                   # Login, 2FA, reset password
    messagingService.ts              # Conversations, messages, upload fichier
    agendaService.ts                 # Événements CRUD + mock store module-level
    profileService.ts                # Profil patient + upload photo (react-native-image-picker)
    chatbotService.ts                # Messages assistant AUDYA
    healthService.ts                 # Profil santé patient (IMC, antécédents, documents)
    questionnaireService.ts          # ERSA + EQ-5D-5L : types binary/scale10/vas/choice5,
                                     #   soumissions session module-level, export texte formaté
    newsService.ts                   # Articles santé auditive (6 mock, lecture seule)

  constants/
    index.ts                         # MENU_ITEMS (8 items + SVG icons), SPECIALTIES

  utils/
    validators.ts                    # Validation email, messages d'erreur
    agendaHelpers.ts                 # getTodayISO, formatDateISO, buildCalendarGrid (testables)

  styles/
    auth/
      colors.ts                      # Palette couleurs auth (textPlaceholder: #999999)
      spacing.ts                     # Système d'espacement auth
      typography.ts                  # Typographie auth

  assets/
    images/                          # Composants SVG (logo, icônes métier)
    fonts/                           # Montserrat (Regular, SemiBold, Bold)

__tests__/                           # Tests Jest (miroir structure src/)
  App.test.tsx
  AuthContext.test.tsx
  NavigationContext.test.tsx
  Professionals.test.tsx
  Filters.test.tsx
  Settings.test.tsx
  Profile.test.tsx
  Messaging.test.tsx
  Agenda.test.tsx
  Register.test.tsx
  services/
    api.test.ts
    authService.test.ts
    professionalsService.test.ts
  utils/
    agendaHelpers.test.ts
```

---

## Architecture Pattern — Screen → Page → Component

**Règle absolue** : aucun appel API dans un Screen ou un Component pur. Toute la logique de données vit dans la couche Page.

```
Screen (src/screens/<Feature>/)
  └── SafeAreaView + StatusBar
  └── NavBar (top)
  └── <FeaturePage> ← props: callbacks navigation uniquement
  └── BottomNav (bottom)

Page (src/components/<Feature>/)
  └── State: data[], isLoading, error
  └── useEffect → service call (mock ou API selon USE_API)
  └── Filtres, pagination, tri (logique locale)
  └── Compose: <FeatureCard>, <FeatureListRow>, <FeatureFilters>, ...

Component pur (src/components/<Feature>/)
  └── Props uniquement (data + callbacks)
  └── Zéro appel service, zéro useContext (sauf BottomNav)
  └── StyleSheet.create() dans le même fichier ou .styles.tsx séparé

Service (src/services/<feature>Service.ts)
  └── Types ApiResponse (snake_case) + types App (camelCase)
  └── Fonction map: ApiResponse → AppType
  └── Fonction fetch: apiFetch<ApiResponse[]> → AppType[]
```

**Exception documentée** : `BottomNav` utilise `NavigationContext` directement (composant transversal).

**Exception documentée** : Les pages Register (`RegisterStep*Page`) n'ont pas de NavBar/BottomNav. Elles utilisent `useNavigation` et `useRegister` directement car elles sont enveloppées par `RegisterFlow` qui monte son propre `NavigationProvider` (initialisé à `register-step1`) et `RegisterProvider`. Ce `NavigationProvider` est distinct de celui de l'app authentifiée.

**Anti-pattern critique — perte de focus clavier** : Ne jamais définir un sous-composant React (ex. `const Field = () => ...`) à l'intérieur du corps d'un composant parent. À chaque re-render du parent, React crée un nouveau type de composant → démonte/remonte le `TextInput` → le clavier perd le focus après chaque frappe. Toujours déclarer les sous-composants **au niveau module** (hors de la fonction parente) et leur passer les valeurs en props. Exemple appliqué : `Dropdown` et `CheckboxGroup` dans `RegisterStep3Page.tsx`.

---

## Component Inventory

### Common (réutiliser systématiquement)
| Composant | Fichier | Usage |
|-----------|---------|-------|
| `NavBar` | `src/components/common/NavBar/NavBar.tsx` | Top bar toutes les screens authentifiées |
| `BottomNav` | `src/components/common/BottomNav/BottomNav.tsx` | Bottom bar toutes les screens authentifiées |
| `Fab` | `src/components/common/Button/Fab.tsx` | Intégré dans BottomNav |
| `ChatbotModal` | `src/components/Chatbot/ChatbotModal.tsx` | Intégré dans BottomNav |

### Auth (flux hors NavigationContext)
| Composant | Fichier | Usage |
|-----------|---------|-------|
| `AuthFlow` | `src/components/auth/AuthFlow.tsx` | Contrôleur Login→2FA→Register→App |
| `AuthContainer` | `src/components/auth/AuthContainer.tsx` | Layout wrapper auth |
| `Button` (auth) | `src/components/auth/Button.tsx` | Bouton dans le flux auth |
| `Input` (auth) | `src/components/auth/Input.tsx` | Input dans le flux auth |
| `Bubbles` | `src/components/Bubbles.tsx` | Bulles décoratives partagées (auth + register) |

### Register (flux hors NavigationContext principal)
| Composant | Fichier | Usage |
|-----------|---------|-------|
| `RegisterFlow` | `src/components/Register/RegisterFlow.tsx` | Routeur inscription : NavigationProvider(register-step1) + RegisterProvider |
| `RegisterStep1Page` | `src/components/Register/RegisterStep1Page.tsx` | Identité, MDP, CGV |
| `RegisterStep1BisPage` | `src/components/Register/RegisterStep1BisPage.tsx` | Vérification e-mail |
| `RegisterStep2Page` | `src/components/Register/RegisterStep2Page.tsx` | Informations personnelles + upload photo (image-picker) |
| `RegisterStep3Page` | `src/components/Register/RegisterStep3Page.tsx` | Questionnaire auditif |
| `RegisterStep4Page` | `src/components/Register/RegisterStep4Page.tsx` | Informations médicales |
| `RegisterStep5Page` | `src/components/Register/RegisterStep5Page.tsx` | Recherche professionnel (mock + sélection) |
| `RegisterSuccessPage` | `src/components/Register/RegisterSuccessPage.tsx` | Félicitations → retour login |

### Professionals
| Composant | Fichier | Pattern réutilisable pour |
|-----------|---------|--------------------------|
| `ProfessionalsPage` | `.../ProfessionalsPage.tsx` | Orchestrateur liste filtrée |
| `ProfessionalsFilters` | `.../ProfessionalsFilters.tsx` | Toute liste avec filtres |
| `ProfessionalCard` | `.../ProfessionalCard.tsx` | Grille de cartes |
| `ProfessionalListRow` | `.../ProfessionalListRow.tsx` | Tableau/liste |
| `ProfessionalProfilePage` | `.../ProfessionalProfilePage.tsx` | Vue détail |
| `InviteProfessionalPage` | `.../InviteProfessionalPage.tsx` | Formulaire avec validation + consentement |

### Décision rapide pour une nouvelle page
| Situation | Pattern à suivre |
|-----------|-----------------|
| Nouvelle liste filtrée | `ProfessionalsFilters` + `ProfessionalsPage` |
| Nouvelle grille de cartes | `ProfessionalCard` |
| Nouveau tableau | `ProfessionalListRow` |
| Vue détail | `ProfessionalProfilePage` |
| Formulaire avec validation | `InviteProfessionalPage` |
| Nouvelle feature | `<Feature>Screen.tsx` (container) + `<Feature>Page.tsx` (logique) |

---

## Data Layer — Pattern Mock → API

**Pattern obligatoire** pour toutes les pages de données. Référence : `ProfessionalsPage.tsx`.

### Structure type

```typescript
// ─── Mock Data (supprimer quand l'API est prête) ────────────────────────────
const MOCK_ITEMS: MyItem[] = [
  { id: '1', name: 'Exemple', ... },
];

// ─── Toggle API ──────────────────────────────────────────────────────────────
const USE_API = false; // Passer à true quand l'endpoint backend est confirmé

// ─── Dans le composant Page ──────────────────────────────────────────────────
useEffect(() => {
  const load = async () => {
    setIsLoading(true);
    try {
      if (USE_API) {
        const data = await fetchMyItems();
        setItems(data);
      } else {
        setItems(MOCK_ITEMS);
      }
    } catch (err) {
      // Ne pas exposer les détails d'erreur à l'utilisateur final
      console.error('[MyPage] Failed to load items:', err);
      setError('Impossible de charger les données.');
    } finally {
      setIsLoading(false);
    }
  };
  load();
}, []);
```

### Service pattern complet

```typescript
// src/services/myFeatureService.ts

// Type backend (snake_case — ne jamais l'exposer hors du service)
interface MyItemApiResponse {
  id: string;
  first_name: string;
  created_at: string;
}

// Type applicatif (camelCase)
export interface MyItem {
  id: string;
  firstName: string;
  createdAt: string;
}

// Mapping strict — si un champ change côté backend, une seule ligne à changer
function mapApiToMyItem(raw: MyItemApiResponse): MyItem {
  return {
    id: raw.id,
    firstName: raw.first_name,
    createdAt: raw.created_at,
  };
}

export async function fetchMyItems(): Promise<MyItem[]> {
  const raw = await apiFetch<MyItemApiResponse[]>('/api/patient/my-items');
  return raw.map(mapApiToMyItem);
}
```

### Basculer vers la vraie API
1. Vérifier que le shape JSON correspond à `MyItemApiResponse`
2. Ajuster `mapApiToMyItem` si des champs diffèrent
3. Mettre `USE_API = true`
4. Supprimer `MOCK_ITEMS` après validation en intégration

### État des endpoints
| Endpoint | Status | Flag |
|----------|--------|------|
| `GET /api/patient/professionals` | En attente (format JSON non arrêté) | `ProfessionalsPage.tsx:USE_API` |
| `POST /api/professionals/search` | Non implémenté | `RegisterStep5Page.tsx:handleSearch` |
| `POST /api/patient/invite-professional` | Non implémenté | `InviteProfessionalPage.tsx` |
| `POST /patient/professionals/select-id/:id` | Implémenté | `professionalsService.ts` |
| `POST /patient/delete-professional` | Implémenté | `professionalsService.ts` |
| `GET /api/patient/settings` | Non implémenté | `SettingsPage.tsx:USE_API` |
| `PATCH /api/patient/settings` | Non implémenté | `SettingsPage.tsx:USE_API` |
| `POST /api/patient/change-password` | Non implémenté | `SettingsPage.tsx:USE_API` |
| `DELETE /api/patient/account` | Non implémenté | `SettingsPage.tsx:USE_API` |
| `GET /api/patient/profile` | Non implémenté | `ProfilePage.tsx:USE_PROFILE_API` |
| `PATCH /api/patient/profile` | Non implémenté | `ProfilePage.tsx:USE_PROFILE_API` |
| `POST /api/patient/profile/photo` | Non implémenté | `profileService.ts` |
| `GET /ajaxchat/getconversations` | Non implémenté | `MessagingPage.tsx:USE_MESSAGING_API` |
| `GET /ajaxchat/getmessages/:id` | Non implémenté | `MessagingChatPage.tsx` |
| `POST /ajaxchat/sendmessage` | Non implémenté | `messagingService.ts` |
| `POST /upload/document` | Non implémenté | `messagingService.ts` |
| `GET /my-events` | Non implémenté | `AgendaPage.tsx:USE_AGENDA_API` |
| `POST /events` | Non implémenté | `agendaService.ts` |
| `POST /events/delete` | Non implémenté | `agendaService.ts` |
| `POST /api/chatbot/message` | Non implémenté | `chatbotService.ts:USE_CHATBOT_API` |
| `GET /api/patient/health` | Non implémenté | `healthService.ts:USE_HEALTH_API` |
| `PATCH /api/patient/health` | Non implémenté | `healthService.ts:USE_HEALTH_API` |
| `GET /api/questionnaire/submissions` | Non implémenté | `questionnaireService.ts:USE_QUESTIONNAIRE_API` |
| `POST /api/questionnaire/submit` | Non implémenté | `questionnaireService.ts:USE_QUESTIONNAIRE_API` |
| `GET /api/news` | Non implémenté | `newsService.ts:USE_NEWS_API` |
| `POST /api/register` | Non implémenté | `RegisterStep1Page.tsx:handleSubmit` |
| `POST /api/register/verify-email` | Non implémenté | `RegisterStep1BisPage.tsx:handleResend` |
| `POST /api/register/patient-info` | Non implémenté | `RegisterStep2Page.tsx:handleSubmit` |
| `POST /api/register/hearing-survey` | Non implémenté | `RegisterStep3Page.tsx` |
| `POST /api/register/medical-info` | Non implémenté | `RegisterStep4Page.tsx` |
| `POST /api/register/professional` | Non implémenté | `RegisterStep5Page.tsx:handleSearch` |

### API Base (`src/services/api.ts`)
- **Dev** : `http://localhost:8000`
- **Prod** : `https://api.audya.com`
- Auth : session HTTP + cookies (`credentials: 'include'`)
- Headers par défaut : `Accept: application/json`, `Accept-Language: fr`, `X-Requested-With: XMLHttpRequest`
- Timeout : 10 secondes
- Erreurs : classe `ApiError` (status + message)

---

## Sécurité — Règles non négociables

Ces règles s'appliquent à chaque modification, même mineure.

### Données utilisateur
- **Valider en entrée** toutes les données venant de l'utilisateur (formulaires) ET du backend (réponses API potentiellement malformées).
- **Ne jamais logger** d'informations sensibles (tokens, mots de passe, données de santé) dans `console.log`. Utiliser des messages génériques.
- **Ne jamais stocker** de credentials en clair dans AsyncStorage ou le state React. Les tokens de session vivent dans les cookies HTTP (géré par `api.ts`).

### Authentification
- Le flux auth est géré par `AuthContext` + `AuthFlow`. Ne pas court-circuiter ce mécanisme.
- Mode dev : `DEV_SKIP_2FA` existe dans `authService.ts` — ce flag ne doit **jamais** être `true` en production. Si tu touches l'auth, vérifie ce flag.
- Code 2FA valide en mock : `"123456"` — ne jamais hardcoder de vrai code.

### Réseau
- Toutes les requêtes passent par `apiFetch` dans `api.ts`. Ne pas utiliser `fetch` directement dans les composants ou services.
- Les erreurs réseau sont catchées et transformées en `ApiError` — ne pas laisser de promesses non catchées.

### Fichiers et uploads
- Upload photo profil : via `react-native-image-picker` (`profileService.ts`, `RegisterStep2Page.tsx`). Valider le type MIME et la taille (3 Mo max) côté client avant envoi.
- Upload documents (messagerie) : via `react-native-document-picker`. Limiter les types acceptés.

---

## Navigation System (`src/context/NavigationContext.tsx`)

Routeur stack maison — **pas de React Navigation**. Toutes les fonctions de navigation sont wrappées avec `useCallback` (dépendances stables → pas de re-render inutile des consommateurs).

### Type Screen (union complète)
```typescript
// État actuel dans NavigationContext.tsx (app authentifiée)
type Screen =
  | 'home'
  | 'health'
  | 'professionals'
  | 'professional-profile'
  | 'add-professional'
  | 'invite-professional'
  | 'settings'
  | 'my-profile'
  | 'messaging'
  | 'messaging-chat'
  | 'agenda'
  | 'agenda-day'
  | 'agenda-form'
  | 'questionnaire'
  | 'questionnaire-detail'
  | 'news';

// ⚠️ DETTE TECHNIQUE : les Screen suivants sont utilisés dans le code
// mais pas encore dans l'union (erreurs TS pré-existantes non bloquantes) :
// 'carnet-audition', 'appareillage'
// 'register-step1' à 'register-success' (contexte NavigationProvider séparé dans RegisterFlow)
```

### NavigationProvider — prop `initialScreen`
`NavigationProvider` accepte une prop optionnelle `initialScreen?: Screen` (défaut : `'home'`).
Utilisé par `RegisterFlow` qui l'instancie avec `initialScreen="register-step1"`.

```tsx
// Utilisation standard (app authentifiée)
<NavigationProvider>…</NavigationProvider>

// Flux d'inscription
<NavigationProvider initialScreen="register-step1">…</NavigationProvider>
```

### Context API
| Méthode | Description |
|---------|-------------|
| `navigateTo(screen)` | Push sur la pile |
| `goBack()` | Pop de la pile |
| `goHome()` | Reset pile → home |
| `navigateToProfile(professional)` | Profil professionnel avec données |
| `navigateToAdd()` | Formulaire ajout professionnel |
| `navigateToInvite()` | Formulaire invitation professionnel |
| `navigateToSettings()` | Paramètres |
| `navigateToMyProfile()` | Profil utilisateur |
| `navigateToMessaging()` | Liste conversations |
| `navigateToMessagingChat(conversation)` | Vue conversation |
| `navigateToAgenda()` | Calendrier |
| `navigateToAgendaDay(date)` | Vue jour |
| `navigateToAgendaForm(event?)` | Formulaire événement (création ou édition) |
| `navigateToHealth()` | Page Ma Santé |
| `navigateToQuestionnaire()` | Liste des questionnaires |
| `navigateToQuestionnaireDetail(id)` | Formulaire + historique questionnaire (stocke `selectedQuestionnaireId`) |
| `navigateToNews()` | Liste des actualités |

### Ajouter un nouvel écran (app authentifiée)
1. Ajouter le nom à l'union `Screen` dans `NavigationContext.tsx`
2. Ajouter le helper `navigateTo<NewScreen>()` dans le context (avec `useCallback`)
3. Ajouter le label dans `SCREEN_LABELS` de `BottomNav.tsx`
4. Ajouter le rendu conditionnel dans `App.tsx`
5. Ajouter le handler dans `MainPage.tsx` si accessible depuis le menu

### Auth Context (`src/context/AuthContext.tsx`)
Géré séparément de la navigation. Expose :
- `isAuthenticated: boolean`
- `pendingEmail: string` (entre step 1 et 2FA)
- `loginFirstFactor(email, password)` → déclenche 2FA
- `loginSuccess()` → marque l'utilisateur comme authentifié
- `logout()` → reset et retour au flux auth

### Register Context (`src/context/RegisterContext.tsx`)
Partage **toutes** les données du wizard d'inscription entre les étapes. Expose :
- `registerData: RegisterData` — modèle complet couvrant les 5 étapes :
  - **Step 1** : `email`, `nom`, `prenom`, `password`, `cgvAccepted`
  - **Step 2** : `genre`, `dateNaissance`, `numeroSecu`, `adresse`, `complement`, `codePostal`, `ville`, `pays`, `telephoneFixe`, `telephoneMobile`, `profession`, `photoUri`
  - **Step 3** : `dureeGene`, `ouiNon[]`, `evolutionSurdite`, `situationsDifficiles[]`, `situationsDifficilesBis[]`
  - **Step 4** : `taille`, `poids`, `groupeSanguin`, `antecedents`, `traitements`, `allergies`
  - **Step 5** : `specialite`, `professionnelNom`, `professionnelPrenom`, `professionnelCodePostal`, `professionnelVille`
- `setRegisterData(partial)` → merge partiel dans le state

Monté par `RegisterFlow` via `<RegisterProvider>`. Ne pas utiliser hors du flux d'inscription.

### Flux d'inscription (`AuthFlow` → `RegisterFlow`)
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
                                (goHome() → currentScreen='home' → onComplete() → AuthFlow retourne à 'login')
```

---

## Tech Stack

| Dépendance | Version | Rôle |
|------------|---------|------|
| React Native | 0.84.0 | Framework mobile |
| React | 19.2.3 | UI library |
| TypeScript | 5.8 | Typage statique |
| Metro | latest | Bundler dev |
| React Native SVG | latest | Icônes vectorielles |
| React Native Vector Icons | latest | Ionicons (Agenda, UI) |
| React Native Safe Area Context | latest | Gestion notches |
| React Native Image Picker | latest | Upload photo (profil + inscription étape 2) |
| React Native Document Picker | latest | Pièces jointes messagerie |
| Jest | latest | Tests unitaires |
| ESLint | `@react-native` preset | Qualité code |
| Prettier | 2 espaces / single quotes | Formatage |
| CocoaPods | latest | Gestion deps iOS |
| Gradle | latest | Build Android |

---

## Code Standards

### Nommage
| Catégorie | Convention | Exemple |
|-----------|-----------|---------|
| Composants | PascalCase | `MessagingChatPage` |
| Fonctions / hooks | camelCase | `fetchConversations`, `useNewPassword` |
| Constantes module | UPPER_SNAKE_CASE | `USE_API`, `MOCK_CONVERSATIONS` |
| Fichiers composant | = nom composant | `MessagingChatPage.tsx` |
| Services | `<feature>Service.ts` | `messagingService.ts` |
| Types API | `<Name>ApiResponse` | `ConversationApiResponse` |
| Types app | PascalCase camelCase | `Conversation` |

### Organisation d'un fichier composant Page
```
1. Imports React + RN
2. Imports composants locaux
3. Imports services
4. Imports types + constantes
5. ─── Sous-composants module-level (si besoin) ──
6. const SubComp = (props) => ...  // JAMAIS à l'intérieur du composant parent
7. ─── Mock Data ────────────────
8. MOCK_ITEMS: MyItem[] = [...]
9. ─── Toggle ───────────────────
10. const USE_API = false;
11. ─── Component ─────────────────
12. JSDoc /** ... */
13. export function MyPage(props) { ... }
14. ─── Styles ────────────────────
15. const styles = StyleSheet.create({ ... })
```

### Styles
- `StyleSheet.create()` obligatoire (performance)
- `COLORS` importé depuis `HomeScreen.styles.tsx` (via `Register.styles.ts` pour le flux Register)
- Polices : `FONT_REGULAR`, `FONT_SEMIBOLD`, `FONT_BOLD` (Montserrat)
- Layout : flexbox en priorité, `position: absolute` seulement si inévitable
- Responsive : `Dimensions.get('window')` pour les calculs dépendant de l'écran
- Ombres : `shadowColor/shadowOffset/shadowOpacity/shadowRadius` (iOS) + `elevation` (Android)
- Auth screens : palette dans `src/styles/auth/colors.ts`, spacing dans `src/styles/auth/spacing.ts`
- **Ne jamais introduire de nouvelle valeur hexadécimale** sans utiliser un token `COLORS.*` existant

### Accessibilité
- Tout élément interactif (`TouchableOpacity`, `Pressable`) doit avoir `accessibilityLabel` et `accessibilityRole="button"`.
- Les listes d'items doivent avoir des labels parlants (ex. `accessibilityLabel={item.label}` sur les tuiles).

### JSDoc minimal requis
```typescript
/**
 * MessagingChatPage — Affiche la conversation avec un professionnel.
 * Gère l'envoi de messages texte et de fichiers.
 * Dépend de NavigationContext pour selectedConversation.
 */
export function MessagingChatPage({ onBack }: Props) { ... }
```

---

## Debugging & Development

### Outils
- **TypeScript** : `npx tsc --noEmit`
- **Reload forcé** : `RR` (Android) / `R` (iOS simulateur)
- **Dev menu** : `Cmd+M` (iOS) / `Ctrl+M` (Android)
- **Réseau** : React Native Debugger ou Flipper

### Fichiers clés
| Fichier | Rôle |
|---------|------|
| `index.js` | Point d'entrée boot |
| `App.tsx` | Router top-level (Auth vs App) |
| `src/context/NavigationContext.tsx` | Routeur |
| `src/context/AuthContext.tsx` | État auth |
| `src/context/RegisterContext.tsx` | Données wizard inscription (Steps 1–5) |
| `src/services/api.ts` | Wrapper HTTP |
| `src/utils/agendaHelpers.ts` | Utilitaires agenda (calendrier, dates) |
| `src/constants/index.ts` | MENU_ITEMS, SPECIALTIES |
| `app.json` | Manifest app |
| `tsconfig.json` | Config TypeScript |

---

## Git & Branching

- Branche principale : `main`
- Branches feature par développeur (ex. `BaptisteM`)
- Messages de commit en format conventionnel : `feat:`, `fix:`, `refactor:`, `chore:`

---

## État fonctionnel — Checklist livraison client

### Écrans 100% front complétés (mock → brancher API)
| Écran | Composant | Flag API à passer à `true` |
|-------|-----------|--------------------------|
| Accueil | `MainPage.tsx` | — (navigation pure) |
| Ma Santé | `HealthPage.tsx` | `USE_HEALTH_API` |
| Mon Appareillage | `AppareillagePage.tsx` | — (mock static) |
| Mon Carnet Audition | `CarnetAuditionPage.tsx` | — (mock static) |
| Mes Professionnels | `ProfessionalsPage.tsx` | `USE_API` |
| Mon Agenda | `AgendaPage.tsx` | `USE_AGENDA_API` |
| Ma Messagerie | `MessagingPage.tsx` | `USE_MESSAGING_API` |
| Mes Questionnaires | `QuestionnairePage.tsx` | `USE_QUESTIONNAIRE_API` |
| Mes Actualités | `NewsPage.tsx` | `USE_NEWS_API` |
| Chatbot AUDYA | `ChatbotModal.tsx` | `USE_CHATBOT_API` |
| Mon Profil | `ProfilePage.tsx` | `USE_PROFILE_API` |
| Mes Paramètres | `SettingsPage.tsx` | `USE_API` |
| Inscription (5 étapes) | `RegisterStep*Page.tsx` | tous les `handleSubmit` |
| Connexion + 2FA | `AuthFlow.tsx` | `authService.ts` — partiellement |

### Known TODOs

#### Backend (endpoints à implémenter)
- Voir tableau "État des endpoints" ci-dessus — tous les endpoints `Non implémenté`
- Format JSON de `GET /api/patient/professionals` à confirmer avec le backend

#### Frontend — dettes techniques
- `'carnet-audition'` et `'appareillage'` absents de l'union `Screen` → erreurs TS pré-existantes
- `register-step1` à `register-success` absents de `Screen` (contexte RegisterFlow séparé) → idem
- Bouton "Renvoyer l'invitation" (`ProfessionalsPage.tsx`) — appel API manquant
- Handlers notification dans `NavBar.tsx` (cloche)
- Déconnexion effective (clear cookies session) dans `NavBar.tsx` dropdown
- `questionnaireService.ts` : persistence session module-level → remplacer par `@react-native-async-storage/async-storage` pour persistance inter-sessions

#### Register (frontend)
- Brancher les vrais appels API dans chaque étape (tous les `TODO: appel API`)
- Étape 1bis : vérifier le clic sur le lien e-mail avant de progresser
- Étape 5 : remplacer `MOCK_SEARCH_RESULTS` par `POST /api/professionals/search`
- Upload photo (étape 2) : `photoUri` sélectionné localement, pas encore envoyé à l'API
- Décider si l'utilisateur est auto-connecté ou redirigé vers login après inscription
