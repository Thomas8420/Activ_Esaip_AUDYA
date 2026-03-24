# 01 — Setup & Commandes

## Prérequis

| Outil | Version recommandée |
|-------|---------------------|
| Node.js | ≥ 18 LTS |
| npm | ≥ 9 |
| Ruby (iOS) | ≥ 3.1 |
| CocoaPods (iOS) | ≥ 1.15 |
| Xcode (iOS) | ≥ 15 |
| Android Studio | ≥ Giraffe |
| Java JDK (Android) | ≥ 17 |

---

## Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd Activ_Esaip_AUDYA

# 2. Installer les dépendances JS
npm install

# 3. iOS uniquement — installer les pods (premier setup)
bundle install
bundle exec pod install

# 4. Mettre à jour les pods après une mise à jour npm
bundle exec pod install
```

---

## Lancement

### Metro (bundler) — terminal 1

```bash
npm start
```

### Android — terminal 2

```bash
npm run android
```

### iOS — terminal 2

```bash
npm run ios
```

---

## Commandes de qualité

```bash
# TypeScript — vérification des types (aucune génération de fichier)
npx tsc --noEmit

# Lint ESLint
npm run lint

# Formatage Prettier (2 espaces, single quotes, trailing commas)
npx prettier --write .
```

---

## Tests

```bash
# Tous les tests
npm test

# Fichier spécifique
npm test -- App.test.tsx

# Mode watch (relance à chaque sauvegarde)
npm test -- --watch

# Couverture
npm test -- --coverage
```

---

## Rechargement en développement

| Action | Android | iOS simulateur |
|--------|---------|----------------|
| Reload | `RR` | `R` |
| Dev menu | `Ctrl+M` | `Cmd+M` |

---

## Variables d'environnement

Aucune variable d'environnement `.env` n'est requise. Les URLs d'API sont définies directement dans `src/services/api.ts` :

```typescript
// Dev  : http://localhost:8000
// Prod : https://api.audya.com
```

Pour pointer vers un environnement différent, modifier la constante `BASE_URL` dans `src/services/api.ts`.

---

## Stack technique

| Dépendance | Version | Rôle |
|------------|---------|------|
| React Native | 0.84.0 | Framework mobile cross-platform |
| React | 19.2.3 | Bibliothèque UI |
| TypeScript | 5.8 | Typage statique |
| react-native-safe-area-context | 5.5.2 | Gestion encoches/notches |
| react-native-svg | 15.15.3 | Icônes vectorielles SVG |
| react-native-vector-icons | 10.3.0 | Ionicons (Agenda, UI) |
| react-native-image-picker | 8.2.1 | Sélection photo (profil) |
| react-native-document-picker | 9.3.1 | Pièces jointes messagerie |
| Jest | 29 | Tests unitaires |
| ESLint | 10 | Qualité code |
| Prettier | 2.8.8 | Formatage |
