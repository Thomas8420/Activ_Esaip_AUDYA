# AUDIT REPORT — Activ_Esaip_AUDYA
**Date :** 2026-03-23
**Orchestrateur :** 7 agents spécialisés (Sécurité · Qualité · Performance · Accessibilité · Architecture · Dette Technique · Tests)
**Périmètre :** Codebase complète — `src/`, `__tests__/`, `App.tsx`, configuration

---

## RÉSUMÉ EXÉCUTIF

L'application est dans un état de **prototype avancé** structurellement sain mais non production-ready. La couverture de test est de **28 %** (138 tests), tous les services sont en mode mock (`USE_*_API = false`), et plusieurs features core sont des coquilles visuelles non câblées. La bonne nouvelle : **aucune donnée réelle ne transite vers l'API en l'état** — la fenêtre de correction avant la mise en production est ouverte.

**Points forts identifiés :**
- Pattern mock/API toggle cohérent dans tous les services
- Mapping snake_case ↔ camelCase propre dans les services
- AuthContext correctement isolé du NavigationContext
- `apiFetch` centralisé avec timeout AbortController
- Zéro `console.log` exposant des données sensibles
- Anti-pattern keyboard focus documenté et corrigé dans RegisterStep1Page

**Risques bloquants avant production :**
- 2 failles de sécurité CRITIQUES (DEV_SKIP_2FA bypass, token reset vide)
- Données de santé catégorie RGPD Art. 9 collectées sans service ni protection
- 3 violations WCAG AA bloquantes (contrastes orange 3.1:1, teal 2.4:1)
- Pattern Screen→Page inversé sur 6 fichiers
- 5 fonctionnalités core visuellement présentes mais non fonctionnelles

---

## TOP 10 — ACTIONS CRITIQUES CROSS-DOMAINES

| # | Action | Agents concernés | Sévérité | Effort |
|---|--------|-----------------|---------|--------|
| **1** | Remplacer `DEV_SKIP_2FA = __DEV__ && !USE_API` par une variable `.env.local` non commitée | SEC · DETTE | 🔴 CRITIQUE | S |
| **2** | Implémenter la réception du token reset-password via deep link (React Native Linking) | SEC · DETTE | 🔴 CRITIQUE | M |
| **3** | Appliquer `secureTextEntry` sur le champ NIR + créer `registerService.ts` | SEC · ARCH · DETTE | 🔴 CRITIQUE | L |
| **4** | Corriger les contrastes de couleurs : orange `#E8622A→#C44D1A`, teal `#3ABFBF→#1E8F8F`, placeholder `#999→#767676` | A11Y · QUA | 🔴 BLOQUANT | S |
| **5** | Aligner `RegisterFlow` sur le pattern `AuthFlow` (supprimer NavigationProvider imbriqué, état local `RegisterScreen`) | ARCH · PERF · QUA | 🟠 HAUTE | M |
| **6** | Déplacer `Dropdown`/`CheckboxGroup` hors du corps de `RegisterStep3Page` (anti-pattern clavier focus) | QUA · PERF | 🟠 HAUTE | XS |
| **7** | Wrapper les fonctions `NavigationContext` avec `useCallback` + supprimer `eslint-disable` | PERF · QUA · ARCH | 🟠 HAUTE | S |
| **8** | Corriger la configuration Jest : mock `react-native-vector-icons`, `react-native-image-picker`, setup `fetch` | TESTS | 🟠 HAUTE | S |
| **9** | Ajouter `accessibilityLabel` + `accessibilityRole` sur NavBar, BottomNav, tuiles MainPage, icônes SVG | A11Y | 🟠 HAUTE | S |
| **10** | Implémenter la vraie vérification e-mail dans `RegisterStep1BisPage` (bloquer navigation avant confirmation) | SEC · DETTE · ARCH | 🟠 HAUTE | M |

---

## BACKLOG PRIORISÉ GLOBAL

### 🔴 CRITIQUE — Bloqueront la mise en production

| ID | Domaine | Description | Fichier | Effort |
|----|---------|-------------|---------|--------|
| SEC-001 | Sécurité | `DEV_SKIP_2FA` bypass 2FA automatique sur tout build `__DEV__` | `authService.ts:11` | S |
| SEC-002 | Sécurité | Token reset-password hardcodé `''` — fonctionnalité non implémentable | `NewPasswordScreen.tsx:38` | M |
| SEC-003 | Sécurité | NIR (Art. 9 RGPD) sans `secureTextEntry`, en clair en état React | `RegisterStep2Page.tsx:59` | M |
| SEC-007 | Sécurité | Données médicales (Step3/4) collectées sans service ni transmission définie | `RegisterStep3/4Page.tsx` | L |
| ARCH-003 | Architecture | `RegisterFlow` utilise `goHome()` comme signal de fin — couplage fragile | `RegisterFlow.tsx:50` | M |
| DETTE-001 | Dette | `RegisterStep1BisPage` navigue vers step2 sans vérification e-mail réelle | `RegisterStep1BisPage.tsx:22` | L |
| DETTE-002 | Dette | `RegisterStep5Page.handleSearch` vide — inscription sans professionnel possible | `RegisterStep5Page.tsx:35` | L |
| DETTE-003 | Dette | Photo upload RegisterStep2 — bouton appelle `setPhotoModal(false)` seulement | `RegisterStep2Page.tsx:195` | S |

### 🟠 HAUTE — À traiter avant beta publique

| ID | Domaine | Description | Fichier | Effort |
|----|---------|-------------|---------|--------|
| A11Y-008 | Accessibilité | Orange `#E8622A` sur blanc — ratio 3.1:1 (seuil 4.5:1) | `HomeScreen.styles.tsx:6` | S |
| A11Y-009 | Accessibilité | Teal `#3ABFBF` sur blanc — ratio 2.4:1 | `ChatbotModal.tsx` | S |
| A11Y-010 | Accessibilité | Placeholder `#999` sur blanc — ratio 2.8:1 | Partout | XS |
| A11Y-029 | Accessibilité | Bordures checkbox/radio `#E0E0E0` — ratio 1.2:1 | `Register.styles.ts:174` | XS |
| A11Y-001 à 007 | Accessibilité | SVG sans label, boutons sans rôle (NavBar, MainPage, FAB) | Multiple | S |
| A11Y-011 à 013 | Accessibilité | TextInput sans `accessibilityLabel`, erreurs non annoncées | Multiple | M |
| A11Y-020 à 021 | Accessibilité | Cellules calendrier sans label accessible, flèches sans hint | `AgendaPage.tsx` | M |
| PERF-001 | Performance | Fonctions navigation non mémoïsées → re-renders en cascade sur tous les écrans | `NavigationContext.tsx:121` | S |
| PERF-002 | Performance | Rendu conditionnel destructif — tous les écrans unmount/remount | `App.tsx:30` | L |
| PERF-003 | Performance | `React.memo` neutralisé par inline arrows dans `ProfessionalsPage` | `ProfessionalsPage.tsx:168` | XS |
| QUA-001 | Qualité | SafeAreaView/NavBar/BottomNav dans les Pages (violation Screen→Page) | 6 fichiers | M |
| QUA-003 | Qualité | `useMemo` NavigationContext sans `useCallback` → `eslint-disable` injustifié | `NavigationContext.tsx:178` | S |
| QUA-004 | Qualité | `useMemo` AuthContext sans `useCallback` | `AuthContext.tsx:53` | S |
| QUA-009 | Qualité | `Dropdown`/`CheckboxGroup` dans corps de `RegisterStep3Page` → perte focus | `RegisterStep3Page.tsx:51` | XS |
| ARCH-001 | Architecture | Pattern Screen→Page inversé sur 6 écrans | Multiple | L |
| ARCH-002 | Architecture | Routes `register-step*` polluent le type `Screen` global | `NavigationContext.tsx:19` | M |
| ARCH-005 | Architecture | `RegisterContext` ne couvre que 3 champs — données perdues à la navigation arrière | `RegisterContext.tsx:3` | M |
| ARCH-010 | Architecture | Absence de `registerService.ts` — flux inscription sans couche service | `src/services/` | S |
| SEC-010 | Sécurité | Validation MDP insuffisante (longueur 8 minimum, pas de complexité) | `validators.ts` / `RegisterStep1Page.tsx` | S |
| SEC-006 | Sécurité | Email affiché en clair dans modal 2FA | `VerifyCodeScreen.tsx:99` | XS |
| TEST-001 | Tests | `react-native-vector-icons` non mocké → 9 suites à risque | `jest.config.js` | S |
| TEST-002 | Tests | `AuthContext` — 0 test sur le gardien de session | — | S |
| TEST-003 | Tests | `NavigationContext` — 0 test sur le routeur | — | S |
| TEST-005 | Tests | Services (`api.ts`, `authService`, `professionalsService`) — 0 test | — | M |
| TEST-006 | Tests | `validators.ts` — 0 test sur la logique métier critique | — | XS |
| DETTE-005 | Dette | 5 items du menu home sans navigation (clic silencieux) | `MainPage.tsx:35` | M |
| DETTE-006 | Dette | Bouton Message sur `ProfessionalCard` sans `onPress` | `ProfessionalCard.tsx:80` | S |

### 🟡 MOYEN — À traiter avant release stable

| ID | Domaine | Description | Effort |
|----|---------|-------------|--------|
| SEC-005 | Sécurité | Uploads sans validation MIME ni limite de taille (messagerie) | S |
| SEC-008 | Sécurité | Pas de rate limiting / lockout côté client sur le login | M |
| SEC-014 | Sécurité | Pas de timeout de session / verrouillage automatique | M |
| SEC-012 | Sécurité | Flux vérification e-mail contournable (RegisterStep1Bis) | M |
| PERF-004 | Performance | `ScrollView` non virtualisé pour la liste des professionnels | S |
| PERF-005 | Performance | 42 `TouchableOpacity` calendrier sans `useMemo` | S |
| PERF-006 | Performance | Bannière image depuis URL Unsplash externe (dépendance tiers) | XS |
| PERF-008 | Performance | NavBar/BottomNav instanciés dans chaque Page (12 montages/démontages) | L |
| QUA-015 | Qualité | `buildCalendarGrid` + `MONTHS_FR` dupliqués dans AgendaPage et AgendaFormPage | S |
| QUA-020 | Qualité | Race condition `ProfilePage.handleSave` (setProfile async avant updatePatientProfile) | XS |
| QUA-019 | Qualité | Catch silencieux sans log ni feedback dans `ProfessionalsPage` | XS |
| ARCH-007 | Architecture | NavigationContext stocke données métier (SelectedConversation, etc.) | L |
| ARCH-011 | Architecture | Spécialités dupliquées : `SPECIALTIES` vs `OPTIONS_SPECIALITE` | XS |
| ARCH-012 | Architecture | `MessagingChatPage` importe `BASE_URL` directement | XS |
| ARCH-009 | Architecture | App.tsx avec 13 conditions booléennes non scalable | S |
| DETTE-004 | Dette | Bouton notifications NavBar sans handler | M |
| DETTE-007 | Dette | `handleResendInvitation` vide dans ProfessionalsPage | S |
| DETTE-008 | Dette | `AddProfessionalPage` recherche sans appel API | L |
| DETTE-010 | Dette | Pas de toast de confirmation après actions sensibles (suppression compte) | S |
| A11Y-015 | Accessibilité | Titres de pages sans `accessibilityRole="header"` | XS |
| A11Y-016 à 019 | Accessibilité | Conversations/messages sans labels groupés | M |
| A11Y-025 | Accessibilité | Indicateur `AUDYA répond…` sans `accessibilityLiveRegion` | XS |
| A11Y-033 | Accessibilité | Changements de page non annoncés via `AccessibilityInfo` | XS |
| TEST-007 à 009 | Tests | Tests sans assertions (`App.test`, `Professionals.test`, `Filters.test` couplé copie) | S |
| TEST-014 | Tests | 0 test d'interaction utilisateur (press/input) dans toute la suite | L |
| TEST-019 | Tests | `console.log` pollutant la CI dans `Filters.test.tsx` | XS |

### 🟢 FAIBLE — Améliorations cosmétiques / dette mineure

| ID | Domaine | Description | Effort |
|----|---------|-------------|--------|
| SEC-018 | Sécurité | Données mock personnelles dans le code source | XS |
| QUA-011 à 014 | Qualité | Variables inutilisées, labels Q10 identiques, `isSelected` dead code | XS |
| QUA-023 à 025 | Qualité | Prop `field` inutilisée, JSDoc absent, register-steps dans App.tsx | XS |
| QUA-016 à 018 | Qualité | Dropdowns dupliqués SettingsPage, styles inline Register/Agenda | S |
| A11Y-027 | Accessibilité | `autoComplete` manquant sur champ MDP login | XS |
| A11Y-028 | Accessibilité | Hauteurs fixes incompatibles avec Dynamic Type | M |
| A11Y-036 | Accessibilité | Tiles avec `height` fixe (incompatible zoom texte) | S |
| ARCH-017 à 019 | Architecture | Screens vides d'une ligne, `previousScreen` superflu, import styles inversé | XS |
| DETTE-016 à 017 | Dette | Dates mock agenda déjà passées en semaine 3, mockStore non réinitialisé | XS |
| TEST-017 à 022 | Tests | Tests couplés aux valeurs mock, agendaService sans tests CRUD | M |

---

## PLAN DE SPRINT (3 SPRINTS DE 2 SEMAINES)

### SPRINT 1 — Sécurité & Fondations (Semaines 1-2)
**Objectif :** Éliminer tous les bloquants sécurité avant la moindre activation d'API réelle

| Priorité | Tâche | Effort | Responsable |
|----------|-------|--------|-------------|
| 🔴 | Remplacer `DEV_SKIP_2FA` par variable `.env.local` non commitée | S | Backend/Auth |
| 🔴 | Implémenter deep link reset password (React Native Linking) | M | Mobile |
| 🔴 | Créer `registerService.ts` avec pattern mock/API | S | Mobile |
| 🔴 | `secureTextEntry` sur NIR + cycle de vie documenté | XS | Mobile |
| 🔴 | Bloquer vérification email `RegisterStep1Bis` (ne pas naviguer avant confirmation) | M | Mobile |
| 🟠 | Corriger contrastes : orange, teal, placeholders, bordures checkbox | S | Design/Mobile |
| 🟠 | Fix Jest config : mock `react-native-vector-icons`, `react-native-image-picker`, setup `fetch` | S | Mobile |
| 🟠 | Écrire tests `validators.ts`, `AuthContext`, `NavigationContext` | M | Mobile |
| 🟠 | Masquer email dans modal 2FA (`maskEmail()`) | XS | Mobile |
| 🟠 | `validatePassword()` centralisé dans `validators.ts` (complexité) | S | Mobile |

**Résultat sprint 1 :** Application sécurisée pour une démo avec données réelles. Couverture tests critique couverte.

---

### SPRINT 2 — Architecture & Qualité (Semaines 3-4)
**Objectif :** Corriger les dettes architecturales bloquant la scalabilité

| Priorité | Tâche | Effort | Responsable |
|----------|-------|--------|-------------|
| 🟠 | Aligner `RegisterFlow` sur `AuthFlow` (supprimer NavigationProvider imbriqué) | M | Mobile |
| 🟠 | Étendre `RegisterContext` pour couvrir tous les champs du wizard (Step2-5) | M | Mobile |
| 🟠 | Wrapper fonctions navigation `NavigationContext` avec `useCallback` | S | Mobile |
| 🟠 | Déplacer `SafeAreaView`/`NavBar`/`BottomNav` dans les Screens (restaurer pattern) | L | Mobile |
| 🟠 | Déplacer `Dropdown`/`CheckboxGroup` hors corps `RegisterStep3Page` | XS | Mobile |
| 🟠 | `React.memo` custom comparator sur `ProfessionalCard`/`ProfessionalListRow` | XS | Mobile |
| 🟠 | Brancher upload photo RegisterStep2 via `react-native-image-picker` | S | Mobile |
| 🟠 | Brancher `handleSearch` RegisterStep5 (API stub ou mock enrichi) | M | Mobile |
| 🟠 | Implémenter bouton Message sur `ProfessionalCard` → messagerie | S | Mobile |
| 🟠 | Ajouter `accessibilityLabel` + `accessibilityRole` (NavBar, BottomNav, tuiles MainPage) | S | Mobile |
| 🟡 | Écrire tests services (`api.ts`, `authService.ts`, `professionalsService.ts`) | M | Mobile |
| 🟡 | Réécrire `App.test.tsx` et `Professionals.test.tsx` avec assertions réelles | S | Mobile |
| 🟡 | Extraire `buildCalendarGrid` dans `src/utils/agendaHelpers.ts` | S | Mobile |
| 🟡 | Corriger race condition `ProfilePage.handleSave` | XS | Mobile |

**Résultat sprint 2 :** Architecture conforme, features core câblées. Couverture tests ~45%.

---

### SPRINT 3 — Production Readiness (Semaines 5-6)
**Objectif :** Préparer le passage `USE_*_API = true` pour chaque service

| Priorité | Tâche | Effort | Responsable |
|----------|-------|--------|-------------|
| 🟠 | Valider shape JSON backend + basculer `USE_AUTH_API = true` | M | Backend+Mobile |
| 🟠 | Valider + basculer `USE_PROFESSIONALS_API = true` | M | Backend+Mobile |
| 🟠 | Valider + basculer `USE_MESSAGING_API = true` | M | Backend+Mobile |
| 🟡 | Ajouter timeout de session (`useInactivityTimeout`) + verrouillage | M | Mobile |
| 🟡 | FlatList pour liste professionnels (virtualisation) | S | Mobile |
| 🟡 | Migrer bannière Unsplash vers asset local | XS | Mobile |
| 🟡 | `AccessibilityInfo.announceForAccessibility` à chaque changement d'écran | XS | Mobile |
| 🟡 | Labels accessibles pour calendrier (cellules, flèches, DAYS_FULL_FR) | M | Mobile |
| 🟡 | Labels accessibles pour messagerie (rows conversation, bulles, inputs) | M | Mobile |
| 🟡 | Supprimer console.log CI dans `Filters.test.tsx` + relier logique vraie | S | Mobile |
| 🟡 | Ajouter tests d'interaction utilisateur (press/input) | L | Mobile |
| 🟡 | `AbortController` dans polling `MessagingChatPage` | XS | Mobile |
| 🟡 | Toast de confirmation après actions sensibles (suppression compte) | S | Mobile |
| 🟡 | Navigation menu home pour les 5 items manquants | M | Mobile |
| 🟢 | Nettoyage dead code (indexes, isSelected, prop field, labels Q10) | XS | Mobile |
| 🟢 | JSDoc sur les 5 composants RegisterStep*Page | XS | Mobile |
| 🟢 | Déplacer `Register.styles.ts` vers `src/components/Register/` | XS | Mobile |

**Résultat sprint 3 :** Application production-ready sur les domaines Auth + Professionnels + Messagerie. Couverture tests ~60%.

---

## MATRICE DE RISQUES

```
PROBABILITÉ D'IMPACT EN PRODUCTION
(quand USE_API passera à true)

CRITIQUE ──────────────────────────────────────────────────────────
  SEC-001  DEV_SKIP_2FA bypass          → Données médicales exposées
  SEC-002  Token reset vide             → Reset MDP non fonctionnel
  SEC-003  NIR non protégé              → Violation RGPD Art. 9

HAUTE ─────────────────────────────────────────────────────────────
  SEC-007  Données médicales sans API   → Perte données inscription
  DETTE-001 Vérif. email contournable   → Comptes sans identité vérifiée
  DETTE-002 handleSearch vide           → Inscription sans professionnel
  A11Y-008/9 Contrastes insuffisants   → Non-conformité légale (HDS)
  PERF-001 Re-renders NavigationCtx    → Lenteur perceptible tous écrans

MODÉRÉE ───────────────────────────────────────────────────────────
  ARCH-003 goHome() comme signal       → Inscription ne termine pas
  QUA-020  Race condition ProfilePage  → Photo uploadée, profil non sauvé
  TEST-001 vector-icons non mocké      → CI instable à toute màj package
  SEC-014  Pas de timeout session      → Données médicales exposées tablette

FAIBLE ────────────────────────────────────────────────────────────
  PERF-002 Unmount/remount screens     → Perte d'état (filtres, scroll)
  PERF-004 ScrollView non virtualisé  → Lenteur sur liste >20 pros
  ARCH-009 App.tsx non scalable        → Maintenance difficile à 20+ routes
```

---

## STATISTIQUES DE L'AUDIT

| Domaine | Findings total | Critiques | Hauts | Moyens | Faibles |
|---------|---------------|-----------|-------|--------|---------|
| Sécurité | 20 | 2 | 8 | 6 | 4 |
| Qualité | 29 | 0 | 10 | 11 | 8 |
| Performance | 20 | 2 | 6 | 9 | 3 |
| Accessibilité | 38 | 14 | 16 | 6 | 2 |
| Architecture | 19 | 3 | 9 | 5 | 2 |
| Dette Technique | 20 | 3 | 9 | 5 | 3 |
| Tests | 22 | 6 | 8 | 5 | 3 |
| **TOTAL** | **168** | **30** | **66** | **47** | **25** |

**Couverture de tests actuelle :** 28% (138 tests / ~12 500 lignes)
**Objectif couverture post-sprint 3 :** 60%
**Effort total estimé :** ~25 jours·développeur
**Effort sprint 1 (urgences sécurité) :** ~6 jours·développeur

---

*Rapport généré par l'orchestrateur multi-agents AUDYA — 2026-03-23*
*Agents : agent-securite · agent-qualite · agent-performance · agent-accessibilite · agent-architecture · agent-dette · agent-tests*
