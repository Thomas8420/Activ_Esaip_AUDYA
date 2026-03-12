# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Activ_Esaip_AUDYA** is a React Native mobile application built with TypeScript. It's a health/audiology management platform for patient monitoring and coordination. The app uses a modern tech stack with Expo/Metro development environment, comprehensive tooling for code quality, and a modular component architecture.

## Quick Commands

### Development
- **Start Metro dev server**: `npm start` (run in one terminal)
- **Run on Android** (in another terminal): `npm run android`
- **Run on iOS** (in another terminal): `npm run ios`
  - First time iOS setup: `bundle install && bundle exec pod install`
  - Subsequent pod updates: `bundle exec pod install`

### Code Quality
- **Lint**: `npm run lint` (ESLint with React Native rules)
- **Format**: `npx prettier --write .` (uses 2-space indent, single quotes, trailing commas)

### Testing
- **Run tests**: `npm test` (Jest with React Native preset)
- **Run single test**: `npm test -- App.test.tsx`
- **Watch mode**: `npm test -- --watch`

## Architecture & File Structure

### Directory Layout
```
src/
  screens/                     # Page containers (Screen-level components)
    Home/
      HomeScreen.tsx            # Container for home page
      HomeScreen.styles.tsx     # COLORS, FONT_*, styles for home
    Professionals/
      ProfessionalsScreen.tsx   # Container for professionals list
      ProfessionalsScreen.styles.tsx  # Extensive styles (filters, cards, rows, profile, forms)
      AddProfessionalScreen.tsx       # Container for add-professional flow
      InviteProfessionalScreen.tsx    # Container for invite-professional flow
      ProfessionalProfileScreen.tsx   # Container for professional detail view
    Settings/
      SettingsScreen.tsx        # Container for settings page
      SettingsScreen.styles.tsx # Styles (prefs bar, section cards, inputs, modal)
  components/                  # UI components (business logic lives here)
    MainPage/
      MainPage.tsx              # Home grid + banner + navigation
    Professionals/
      ProfessionalsPage.tsx     # List orchestrator (data, filters, pagination, view toggle)
      ProfessionalsFilters.tsx  # Filter controls (search, specialty, zip, city, view mode)
      ProfessionalCard.tsx      # Card view for one professional
      ProfessionalListRow.tsx   # Table row view for one professional
      ProfessionalProfilePage.tsx  # Detailed profile view for one professional
      AddProfessionalPage.tsx   # Search & add existing professionals form
      InviteProfessionalPage.tsx   # Invite new professional form
    Settings/
      SettingsPage.tsx          # Settings logic + UI (notifications toggles, password change, delete account)
    common/                    # Shared across all features
      NavBar/
        NavBar.tsx              # Top bar: logo, notifications, settings, profile dropdown
      BottomNav/
        BottomNav.tsx           # Bottom bar: home, section menu, chat button
      Button/
        Fab.tsx                 # Floating Action Button (chat icon, teal)
  context/
    NavigationContext.tsx       # Custom stack-based router (no React Navigation)
  services/
    api.ts                     # Base fetch wrapper (apiFetch, ApiError)
    professionalsService.ts    # Professional API calls + snake_case↔camelCase mapping
    settingsService.ts         # Settings API calls (fetchSettings, saveSettings, changePassword, deleteAccount)
  constants/
    index.ts                   # MENU_ITEMS (8 items with SVG icons), SPECIALTIES
  assets/
    images/                    # SVG icon files (React components)
__tests__/                     # Test files (mirror src structure)
```

### Architecture Pattern

The app follows a **Screen → Page → Component** hierarchy:

1. **Screens** (`src/screens/`) — thin containers:
   - Wrap `SafeAreaView`, `StatusBar`
   - Render `NavBar` at top, `BottomNav` at bottom
   - Read from `NavigationContext` (goBack, selectedProfessional, etc.)
   - Pass navigation callbacks as props to the Page component

2. **Pages** (`src/components/<Feature>/`) — business logic layer:
   - Hold data state (list, loading, error)
   - Apply filters and pagination logic
   - Compose sub-components (Card, Row, Filters, etc.)
   - **Data loading in `useEffect`** with mock/API toggle (see Data Layer section)

3. **Components** (`src/components/<Feature>/`) — pure UI:
   - Receive data via props; emit events via callbacks
   - No direct API calls or context usage (exception: BottomNav uses NavigationContext)

4. **Common** (`src/components/common/`) — shared widgets:
   - `NavBar`, `BottomNav`, `Fab` — used by every screen

5. **Services** (`src/services/`) — API communication:
   - `api.ts`: base `apiFetch<T>()` wrapper
   - `<feature>Service.ts`: feature-specific API functions + type mapping

## Component Inventory

Use this table to decide which existing components to reuse for new pages.

### Common Components (always reuse)
| Component | File | Use for |
|-----------|------|---------|
| `NavBar` | `src/components/common/NavBar/NavBar.tsx` | Top bar on every screen |
| `BottomNav` | `src/components/common/BottomNav/BottomNav.tsx` | Bottom bar on every screen |
| `Fab` | `src/components/common/Button/Fab.tsx` | Chat FAB button (embedded in BottomNav) |

### Professionals Feature Components
| Component | File | Use for |
|-----------|------|---------|
| `ProfessionalsPage` | `src/components/Professionals/ProfessionalsPage.tsx` | Orchestrates list, filters, pagination, view toggle |
| `ProfessionalsFilters` | `src/components/Professionals/ProfessionalsFilters.tsx` | Search/filter UI (search input, dropdowns, view toggle) — **reuse pattern for any filterable list** |
| `ProfessionalCard` | `src/components/Professionals/ProfessionalCard.tsx` | Card view for one item — **reuse pattern for card grids** |
| `ProfessionalListRow` | `src/components/Professionals/ProfessionalListRow.tsx` | Table row — **reuse pattern for list tables** |
| `ProfessionalProfilePage` | `src/components/Professionals/ProfessionalProfilePage.tsx` | Detail view with structured fields |
| `AddProfessionalPage` | `src/components/Professionals/AddProfessionalPage.tsx` | Search + add form |
| `InviteProfessionalPage` | `src/components/Professionals/InviteProfessionalPage.tsx` | Full invite form with validation + consent |

### Settings Feature Components
| Component | File | Use for |
|-----------|------|---------|
| `SettingsPage` | `src/components/Settings/SettingsPage.tsx` | Preferences tabs, notification toggles (Switch), password change with eye icon + mismatch validation, account deletion with confirmation modal |

### Decision Guide for New Pages

| Situation | Reuse / Adapt |
|-----------|---------------|
| New list with filters | Copy `ProfessionalsFilters` pattern; adapt filter fields |
| New card grid | Copy `ProfessionalCard` pattern; change fields |
| New table/list | Copy `ProfessionalListRow` pattern; change columns |
| New detail view | Copy `ProfessionalProfilePage` pattern; change fields |
| New form with validation | Copy `InviteProfessionalPage` pattern; change fields & schema |
| New feature screen | Create `<Feature>Screen.tsx` (thin container) + `<Feature>Page.tsx` (logic) |

## Data Layer: Fake Data → API Pattern

Every feature page must follow this **single-flag toggle** pattern to switch between mock data and real API calls. This is established in `ProfessionalsPage.tsx` and must be applied consistently to all new pages.

### 1. Mock Data Constant
Define static mock data at the top of the Page component file, typed with the app's interface:

```typescript
// ─── Mock Data (remove once API is ready) ──────────────────────────────────
const MOCK_ITEMS: MyItem[] = [
  { id: '1', name: 'Sample', ... },
];
```

### 2. Toggle Flag
Immediately after the mock data constant, add a single boolean flag:

```typescript
const USE_API = false; // Set to true when the API endpoint is ready
```

### 3. useEffect with Branch
In the Page component's `useEffect`, branch on `USE_API`:

```typescript
useEffect(() => {
  const load = async () => {
    setIsLoading(true);
    try {
      if (USE_API) {
        const data = await fetchMyItems(); // from src/services/<feature>Service.ts
        setItems(data);
      } else {
        setItems(MOCK_ITEMS);
      }
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setIsLoading(false);
    }
  };
  load();
}, []);
```

### 4. Service Function
In `src/services/<feature>Service.ts`, declare the typed API response and the fetch function:

```typescript
// Types matching the backend JSON (snake_case)
export interface MyItemApiResponse {
  id: string;
  first_name: string;
  // ...
}

// App-level type (camelCase)
export interface MyItem {
  id: string;
  firstName: string;
  // ...
}

// Mapping function
export function mapApiToMyItem(raw: MyItemApiResponse): MyItem {
  return { id: raw.id, firstName: raw.first_name, ... };
}

// API call
export async function fetchMyItems(): Promise<MyItem[]> {
  const raw = await apiFetch<MyItemApiResponse[]>('/api/patient/items');
  return raw.map(mapApiToMyItem);
}
```

### 5. Switching to Real API
When the backend endpoint is confirmed and ready:
1. Verify the JSON shape matches `MyItemApiResponse`
2. Update `mapApiToMyItem` if fields differ
3. Set `USE_API = true` in the Page component
4. Delete the `MOCK_ITEMS` constant once confirmed working

### Current API Status
| Endpoint | Status | Flag location |
|----------|--------|---------------|
| `GET /api/patient/professionals` | Pending (JSON format not ready) | `ProfessionalsPage.tsx:USE_API` |
| `POST /api/professionals/search` | Not implemented | `AddProfessionalPage.tsx` (TODO) |
| `POST /api/patient/invite-professional` | Not implemented | `InviteProfessionalPage.tsx` (TODO) |
| `POST /patient/professionals/select-id/:id` | Implemented | `professionalsService.ts:addProfessional` |
| `POST /patient/delete-professional` | Implemented | `professionalsService.ts:removeProfessional` |
| `GET /api/patient/settings` | Not implemented | `SettingsPage.tsx:USE_API` |
| `PATCH /api/patient/settings` | Not implemented | `SettingsPage.tsx:USE_API` |
| `POST /api/patient/change-password` | Not implemented | `SettingsPage.tsx:USE_API` |
| `DELETE /api/patient/account` | Not implemented | `SettingsPage.tsx:USE_API` |

### API Base Configuration (`src/services/api.ts`)
- **Dev**: `http://localhost:8000`
- **Prod**: `https://api.audya.com`
- Auth: HTTP session + cookies (`credentials: 'include'`)
- Default headers: `Accept: application/json`, `Accept-Language: fr`, `X-Requested-With: XMLHttpRequest`

## Navigation System (`src/context/NavigationContext.tsx`)

Custom stack-based router — **no React Navigation library**.

### Screen Names
```typescript
type Screen = 'home' | 'professionals' | 'professional-profile' | 'add-professional' | 'invite-professional' | 'settings';
```

### Adding a New Screen
1. Add the new name to the `Screen` union type in `NavigationContext.tsx`
2. Add a `navigateTo<NewScreen>()` helper function in the context (or use `navigateTo('new-screen')`)
3. Add the screen label to `SCREEN_LABELS` in `BottomNav.tsx`
4. Add the screen rendering in `App.tsx` (or wherever the router switch lives)
5. Add a handler in `MainPage.tsx` if it's accessible from the home menu

### Context API
| Method | Description |
|--------|-------------|
| `navigateTo(screen)` | Push screen onto history stack |
| `goBack()` | Pop history stack (go to previous screen) |
| `goHome()` | Reset stack to home |
| `navigateToProfile(professional)` | Navigate to profile with selected professional |
| `navigateToAdd()` | Navigate to add-professional form |
| `navigateToInvite()` | Navigate to invite-professional form |
| `navigateToSettings()` | Navigate to settings screen |

## Tech Stack

- **React Native 0.84.0** + **React 19.2.3** with TypeScript 5.8
- **Metro** bundler for development (started with `npm start`)
- **React Native SVG** for vector graphics and icons
- **React Native Safe Area Context** for handling device notches
- **Jest** for unit testing
- **ESLint** with `@react-native/eslint-config` preset
- **Prettier** for code formatting (2-space indent, single quotes)
- **Babel** with React Native preset for transpilation
- **iOS**: CocoaPods for dependency management (Podfile in `ios/`)
- **Android**: Gradle for build system (Android Studio compatible)

## Code Standards

### Naming Conventions
- **Components**: PascalCase (e.g., `MainPage`, `NavBar`)
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE (e.g., `MENU_ITEMS`, `TILE_GAP`, `USE_API`)
- **Files**: Match component name (e.g., `MainPage.tsx`, `HomeScreen.styles.tsx`)
- **Services**: `<feature>Service.ts` (e.g., `professionalsService.ts`)

### Component Organization
- Include JSDoc comments explaining component purpose
- Separate static data (MENU_ITEMS, MOCK_*) from component logic
- Keep styles in separate `.styles.tsx` files for screens
- API types use snake_case suffix (`ApiResponse`); app types use camelCase

### Styling Guidelines
- Use `StyleSheet.create()` for performance optimization
- Define colors in centralized `COLORS` object (per screen styles file)
- Font constants: `FONT_REGULAR`, `FONT_SEMIBOLD`, `FONT_BOLD` (Montserrat)
- Use flexbox for layout (no absolute positioning unless necessary)
- Use `Dimensions.get('window')` for responsive calculations
- Include shadow/elevation for depth (shadowColor for iOS, elevation for Android)

## Debugging & Development

### Common Tasks
- **Check TypeScript errors**: Run `npx tsc --noEmit` (uses tsconfig.json)
- **Force reload app**: Press 'R' twice on Android, or 'R' on iOS simulator
- **Access Metro dev menu**: Cmd+M (iOS) or Ctrl+M (Android)
- **View network requests**: Use React Native debugging tools in the Metro dev menu

### File Paths to Know
- App entry point: `index.js` → `App.tsx`
- Router switch: `App.tsx` (renders screen based on NavigationContext)
- Navigation context: `src/context/NavigationContext.tsx`
- Base API wrapper: `src/services/api.ts`
- App-wide constants: `src/constants/index.ts`
- Configuration: `app.json`, `babel.config.js`, `jest.config.js`, `tsconfig.json`
- ESLint config: `.eslintrc.js` (extends `@react-native`)
- Prettier config: `.prettierrc.js`

## Git & Branching

- Main branch: `main`
- Use feature branches per developer (e.g., `BaptisteM`)
- Use descriptive commit messages following conventional format when possible

## Known TODOs

- Navigation for menu items beyond "professionals" (MainPage.tsx, BottomNav.tsx)
- Implement `GET /api/patient/professionals` JSON endpoint (backend pending)
- Implement `GET /api/professionals/search` (AddProfessionalPage.tsx)
- Implement `POST /api/patient/invite-professional` (InviteProfessionalPage.tsx)
- Backend fields to confirm: `isFavorite`, `invitation_status`, `zipCode`, `city`
- Resend invitation API call (ProfessionalsPage.tsx)
- Message button functionality (ProfessionalCard.tsx)
- Notification and settings handlers (NavBar.tsx)
- Profile / Preferences / Logout handlers (NavBar.tsx dropdown)
