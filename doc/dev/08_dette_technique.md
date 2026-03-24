# 08 — Dette technique & TODOs

## Dépendances manquantes à installer

| Package | Usage | Priorité |
|---------|-------|----------|
| `@react-native-async-storage/async-storage` | Persistance inter-sessions (langue, soumissions questionnaire, notifications lues) | 🔴 Haute |

```bash
npm install @react-native-async-storage/async-storage
bundle exec pod install  # iOS
```

---

## TODOs par fichier

### `src/services/questionnaireService.ts`
```typescript
// TODO: remplacer par @react-native-async-storage/async-storage
// pour persistance inter-sessions des soumissions
const _store: QuestionnaireSubmission[] = [];
```

### `src/services/notificationService.ts`
```typescript
// TODO: remplacer par @react-native-async-storage/async-storage
// pour persistance inter-sessions des notifications lues
let _persistedLanguage: Language = 'FR';
```

### `src/context/LanguageContext.tsx`
```typescript
// TODO: remplacer par @react-native-async-storage/async-storage
// pour que la langue choisie survive au redémarrage de l'app
let _persistedLanguage: Language = 'FR';
```

### `src/components/MainPage/MainPage.tsx`
- Image bannière actuellement chargée depuis unsplash.com (URL externe).
  → Remplacer par un asset local ou une URL propre à l'infrastructure AUDYA.

### `src/components/Settings/SettingsPage.tsx`
- Bouton "Enregistrer" en mode mock ne persist rien → ajouter un toast de confirmation.
- Bouton "Modifier le mot de passe" en mode mock : ne montre aucun retour visuel de succès.

### `src/components/common/NavBar/NavBar.tsx`
- Cloche : handler notification connecté, mais pas de navigation depuis une notification vers l'écran correspondant (ex: tap sur notif "message" → ouvrir la messagerie).
- Déconnexion : `logout()` appelé mais les cookies de session ne sont pas clearés côté client.

### `src/components/Register/RegisterStep1BisPage.tsx`
- Vérification du clic sur le lien e-mail non implémentée côté front (polling ou deep link requis).

### `src/components/Register/RegisterStep2Page.tsx`
- `photoUri` sélectionné localement mais jamais envoyé à l'API (en attente de `POST /api/register/patient-info`).

### `src/components/Register/RegisterStep5Page.tsx`
- `MOCK_SEARCH_RESULTS` hardcodé → remplacer par `POST /api/professionals/search`.

---

## Dettes TypeScript résiduelles (non bloquantes)

| Fichier | Dette | Impact |
|---------|-------|--------|
| `BottomNav.tsx` | `'register-step*'` dans `Screen` mais jamais utilisés dans le routeur principal | Zéro — contexte séparé `RegisterFlow` |
| `NavigationContext.tsx` | ESLint disable sur dépendances `useMemo` | Les callbacks `useCallback` sont stables — dette cosmétique |

---

## Traductions incomplètes

Seuls ces composants utilisent le système i18n. Les écrans suivants ont encore des strings hardcodés en français :

| Écran | Strings à traduire |
|-------|--------------------|
| `HealthPage` | Titres sections, labels IMC, boutons |
| `MessagingPage` / `MessagingChatPage` | Labels conversations, placeholders |
| `AgendaPage` / `AgendaDayViewPage` / `AgendaFormPage` | Labels jours/mois, boutons |
| `QuestionnairePage` / `QuestionnaireDetailPage` | Titres, statuts, libellés questions |
| `AppareillagePage` / `DeviceCard` | Labels appareils |
| `NewsPage` | Labels articles |
| `ProfessionalsPage` et sous-composants | Filtres, statuts, boutons |
| Flux `Register` (Steps 1–5) | Tous les labels formulaires |
| Flux `Auth` | Connexion, 2FA, reset MDP |
| `ChatbotModal` | Messages système, placeholder |
| `NotificationPanel` | Titres, "Tout lire", "Aucune notification" |

**Procédure :** voir [doc/dev/06_i18n.md](06_i18n.md) section "Composants actuellement traduits".

---

## Sécurité — Points de vigilance

| Point | Risque | Fichier |
|-------|--------|---------|
| `DEV_SKIP_2FA` dans `authService.ts` | Si `true` en prod : bypass 2FA | `src/services/authService.ts` |
| Upload photo : pas de validation MIME + taille en mode mock | En prod : valider avant envoi (≤ 3 Mo, types image/* uniquement) | `profileService.ts`, `RegisterStep2Page.tsx` |
| Données santé dans les questionnaires | Stockées en mémoire session (non chiffrées) | `questionnaireService.ts` — attente backend |
| Cookie session | Géré par `apiFetch` (`credentials: 'include'`) — ne jamais stocker en AsyncStorage | `api.ts` |

---

## Composants non testés (priorité de couverture)

1. `LanguageContext` — système i18n récent, critique, zéro couverture
2. `notificationService` — feature récente
3. `questionnaireService` — refactorisé en async, mapping non testé
4. Pages `Questionnaire` (chargement async)
5. `NotificationPanel` (interactions markAsRead)
