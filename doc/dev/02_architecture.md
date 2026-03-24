# 02 — Architecture

## Vue d'ensemble

AUDYA est une application React Native **sans Expo** avec un **routeur stack maison** (pas de React Navigation). L'architecture suit trois niveaux strictement séparés :

```
Screen → Page → Component(s) purs
```

---

## Pattern Screen → Page → Component

### Règle fondamentale

> Aucun appel API, aucune logique métier dans un Screen ou un Component pur.
> Toute la logique de données vit dans la couche **Page**.

### Screen (`src/screens/<Feature>/`)

Conteneur léger. Responsabilités :
- `SafeAreaView` + `StatusBar`
- `NavBar` (haut)
- Montage du `<FeaturePage>`
- `BottomNav` (bas)

```tsx
// Exemple : QuestionnaireScreen.tsx
const QuestionnaireScreen = () => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <StatusBar barStyle="dark-content" />
    <NavBar />
    <QuestionnairePage />
    <BottomNav />
  </SafeAreaView>
);
```

### Page (`src/components/<Feature>/`)

Couche logique. Responsabilités :
- État : `data[]`, `isLoading`, `error`
- `useEffect` → appel service (mock ou API selon `USE_API`)
- Filtres, pagination, tri
- Composition des sous-composants

### Component pur (`src/components/<Feature>/`)

- Props uniquement (data + callbacks)
- Zéro appel service, zéro `useContext` (sauf `BottomNav` — exception documentée)
- `StyleSheet.create()` dans le même fichier ou `.styles.tsx` séparé

---

## Structure des fichiers

```
src/
  screens/                     # Containers (SafeAreaView + NavBar + BottomNav)
    Home/
    Professionals/
    Settings/
    Profile/
    Messaging/
    Agenda/
    Health/
    Appareillage/
    Carnet_Audition/
    Questionnaire/
    News/
    Auth/                      # Flux auth (hors NavigationContext)
    Register/                  # Flux inscription (hors NavigationContext principal)

  components/                  # Logique métier + UI
    MainPage/
    Professionals/
    Settings/
    Profile/
    Messaging/
    Agenda/
    Health/
    Appareillage/
    Questionnaire/
    News/
    Chatbot/
    Register/
    auth/
    common/
      NavBar/                  # NavBar.tsx + NotificationPanel.tsx
      BottomNav/               # BottomNav.tsx
      Button/                  # Fab.tsx

  context/
    NavigationContext.tsx      # Routeur stack maison
    AuthContext.tsx            # État authentification
    RegisterContext.tsx        # Données wizard inscription (Steps 1–5)
    LanguageContext.tsx        # Internationalisation (t(), setLanguage())

  services/                    # Couche API — jamais appelée directement depuis les composants
    api.ts                     # Wrapper fetch de base (apiFetch<T>, timeout 10s)
    agendaService.ts
    authService.ts
    chatbotService.ts
    healthService.ts
    messagingService.ts
    notificationService.ts
    newsService.ts
    professionalsService.ts
    profileService.ts
    questionnaireService.ts
    settingsService.ts

  i18n/
    translations.ts            # Toutes les chaînes FR / EN / ES

  constants/
    index.ts                   # MENU_ITEMS (8 items + SVG), SPECIALTIES

  utils/
    validators.ts              # Validation email, messages d'erreur
    agendaHelpers.ts           # getTodayISO, formatDateISO, buildCalendarGrid

  styles/
    auth/
      colors.ts                # Palette auth distincte
      spacing.ts
      typography.ts

  assets/
    images/                    # SVG logo + icônes métier
    fonts/                     # Montserrat (Regular, SemiBold, Bold)

__tests__/                     # Tests Jest (miroir structure src/)
```

---

## Pattern Mock → API

Tous les services suivent ce pattern. C'est la **règle absolue** de la couche données.

```typescript
// ─── Toggle ──────────────────────────────────────────────────────────
export const USE_MY_FEATURE_API = false; // passer à true quand l'endpoint est prêt

// ─── Types API (snake_case — jamais exposés hors du service) ──────────
interface MyItemApiResponse {
  id: string;
  first_name: string;
  created_at: string;
}

// ─── Types applicatifs (camelCase) ───────────────────────────────────
export interface MyItem {
  id: string;
  firstName: string;
  createdAt: string;
}

// ─── Mapping strict ───────────────────────────────────────────────────
function mapApiToMyItem(raw: MyItemApiResponse): MyItem {
  return {
    id: raw.id,
    firstName: raw.first_name,
    createdAt: raw.created_at,
  };
}

// ─── Fonction service async ───────────────────────────────────────────
export async function fetchMyItems(): Promise<MyItem[]> {
  if (!USE_MY_FEATURE_API) {
    return MOCK_ITEMS; // données statiques en attendant l'API
  }
  const raw = await apiFetch<MyItemApiResponse[]>('/api/my-items');
  return raw.map(mapApiToMyItem);
}
```

### Basculer vers la vraie API

1. Vérifier que le shape JSON correspond au type `ApiResponse`
2. Ajuster `mapApiTo*` si des champs diffèrent
3. Mettre `USE_MY_FEATURE_API = true`
4. Supprimer `MOCK_*` après validation en intégration

---

## Anti-patterns à éviter

### Définir un sous-composant à l'intérieur d'un composant parent

```tsx
// ❌ INTERDIT — perte de focus clavier à chaque re-render
const MyPage = () => {
  const Field = () => <TextInput ... />; // nouveau type à chaque render
  return <Field />;
};

// ✅ CORRECT — déclaration au niveau module
const Field = () => <TextInput ... />;
const MyPage = () => <Field />;
```

### Appeler fetch directement dans un composant

```tsx
// ❌ INTERDIT
const MyPage = () => {
  useEffect(() => {
    fetch('/api/items').then(...); // bypass du wrapper apiFetch
  }, []);
};

// ✅ CORRECT — via service
const MyPage = () => {
  useEffect(() => {
    fetchItems().then(setItems);
  }, []);
};
```

### Hardcoder une couleur hexadécimale

```tsx
// ❌ INTERDIT
<Text style={{ color: '#E8622A' }}>...</Text>

// ✅ CORRECT — toujours via les tokens COLORS
import { COLORS } from '../../screens/Home/HomeScreen.styles';
<Text style={{ color: COLORS.orange }}>...</Text>
```
