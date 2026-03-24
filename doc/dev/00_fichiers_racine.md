# 00 — Fichiers & dossiers à la racine du projet

Ce fichier documente l'utilité de chaque fichier ou dossier présent à la racine du projet, en dehors de `src/`.

---

## Point d'entrée applicatif

| Fichier | Rôle |
|---------|------|
| `index.js` | Point d'entrée React Native. Enregistre le composant racine `App` via `AppRegistry.registerComponent`. Ne jamais modifier sans raison impérative. |
| `App.tsx` | Composant racine de l'application. Monte les providers (`SafeAreaProvider`, `LanguageProvider`, `AuthProvider`) et orchestre le routage haut niveau entre le flux auth et l'app authentifiée. |
| `app.json` | Manifeste de l'application : nom technique (`Activ_Esaip_AUDYA`) et nom d'affichage. Utilisé par Metro et les outils de build iOS/Android. |

---

## Configuration de build & bundler

| Fichier | Rôle |
|---------|------|
| `babel.config.js` | Configuration Babel. Utilise le preset `@react-native/babel-preset`. Requis pour la transpilation du code TypeScript/JSX vers JS compatible RN. |
| `metro.config.js` | Configuration du bundler Metro. Deux rôles : (1) intègre `react-native-svg-transformer` pour importer les `.svg` comme des composants React ; (2) retire `.svg` des `assetExts` et l'ajoute aux `sourceExts`. À modifier uniquement si un nouveau type de fichier doit être bundlé. |
| `react-native.config.js` | Configuration CLI React Native. Déclare les dossiers de polices à lier (`src/assets/fonts/` et ceux de `react-native-vector-icons`). Utilisé par `react-native link` lors du setup initial ou d'un ajout de police. |
| `tsconfig.json` | Configuration TypeScript. Étend `@react-native/typescript-config`, ajoute les types Jest, inclut tous les `.ts`/`.tsx`, exclut `node_modules` et `Pods`. |

---

## Qualité de code

| Fichier | Rôle |
|---------|------|
| `.eslintrc.js` | Configuration ESLint. Étend `@react-native` (règles de linting officielle RN). Exécuté via `npm run lint`. |
| `.prettierrc.js` | Configuration Prettier : guillemets simples, trailing commas, pas de parenthèses sur les arrow functions à un paramètre. Exécuté via `npx prettier --write .`. |

---

## Gestion des dépendances

| Fichier / Dossier | Rôle |
|-------------------|------|
| `package.json` | Manifeste npm : dépendances, devDependencies, scripts (`start`, `android`, `ios`, `lint`, `test`). Contient aussi `"postinstall": "patch-package"` pour appliquer automatiquement les patches après `npm install`. |
| `package-lock.json` | Lockfile npm. Fige les versions exactes de toutes les dépendances transitives. **Ne jamais modifier manuellement.** Commité pour reproductibilité des builds. |
| `node_modules/` | Dépendances installées. **Jamais commité** (dans `.gitignore`). Recréé via `npm install`. |
| `Gemfile` | Dépendances Ruby pour CocoaPods (iOS). Épingle les versions de `cocoapods`, `activesupport`, `xcodeproj` et d'autres gems Ruby. Certaines versions sont explicitement exclues car elles provoquent des erreurs de build. |
| `Gemfile.lock` | Lockfile Ruby. Fige les versions exactes des gems. Commité pour reproductibilité. |
| `vendor/` | Cache des gems Ruby géré par Bundler (`bundle install --path vendor/bundle`). Non commité en général. |

---

## Patches de dépendances

| Fichier / Dossier | Rôle |
|-------------------|------|
| `patches/` | Correctifs appliqués sur des packages `node_modules` via `patch-package`. |
| `patches/react-native-document-picker+9.3.1.patch` | Patch sur `react-native-document-picker` v9.3.1. Ajoute des fichiers générés manquants pour le build Android (nouvelle architecture). Appliqué automatiquement à chaque `npm install` via le script `postinstall`. |

---

## Tests

| Fichier / Dossier | Rôle |
|-------------------|------|
| `jest.config.js` | Configuration Jest. Déclare le preset `react-native`, le fichier de setup, les `moduleNameMapper` (SVG → mock, react-native-document-picker, image-picker, vector-icons), et les `transformIgnorePatterns` pour les packages qui doivent être transpilés (non pré-compilés). |
| `jest.setup.js` | Fichier exécuté avant chaque suite de tests. Mock global de `fetch` pour éviter les vraies requêtes réseau pendant les tests. |
| `__tests__/` | Tous les fichiers de test Jest. Miroir de la structure `src/`. Voir [07_tests.md](07_tests.md) pour le détail complet. |
| `__mocks__/` | Mocks manuels de modules natifs non compatibles jsdom. |
| `__mocks__/svg-mock.js` | Remplace tous les imports `.svg` par un composant React vide (`() => null`) pendant les tests. |
| `__mocks__/react-native-document-picker.js` | Mock du module natif de sélection de documents (non disponible dans jsdom). |
| `__mocks__/react-native-image-picker.js` | Mock du module natif de sélection d'images (non disponible dans jsdom). |
| `__mocks__/react-native-vector-icons.js` | Mock de toutes les icônes vector-icons (`Ionicons`, etc.) par un composant vide. |
| `test-filters-logic.js` | Script Node.js autonome (sans Jest) pour tester la logique de filtrage des professionnels. Exécutable directement via `node test-filters-logic.js`. Utilisé lors du développement initial des filtres. Peut être converti en test Jest ou supprimé. |

---

## Build natif

| Dossier | Rôle |
|---------|------|
| `android/` | Projet Android natif (Gradle). Contient le code Java/Kotlin généré, `build.gradle`, `settings.gradle`, etc. Modifié uniquement pour des configurations natives spécifiques (permissions, build variants, etc.). |
| `ios/` | Projet iOS natif (Xcode). Contient le projet `.xcodeproj`, le workspace `.xcworkspace`, le `Podfile` et les Pods. Modifié uniquement pour des configurations natives (capabilities, permissions, entitlements). |

---

## Documentation & rapports

| Fichier / Dossier | Rôle |
|-------------------|------|
| `doc/` | Documentation du projet. Voir [doc/README.md](../README.md) pour l'index complet. Contient les docs dev (`doc/dev/`) et managers (`doc/manager/`). |
| `README.md` | README standard du dépôt (généré lors du scaffolding React Native). Contenu générique — remplacé fonctionnellement par `doc/`. |
| `CLAUDE.md` | Instructions destinées à l'assistant IA Claude Code. Décrit l'architecture, les conventions, les règles de sécurité et l'état du projet. Source de vérité pour les développements assistés par IA. |
| `API_DOCUMENTATION.md` | Documentation des endpoints backend. Référence des shapes JSON, méthodes HTTP, paramètres attendus. |
| `AUDIT_REPORT.md` | Rapport d'audit technique du Sprint 2. Contient l'analyse de l'architecture, de la qualité du code et de la couverture de tests à un instant T. |
| `audit_architecture_report.json` | Export JSON brut de l'audit d'architecture (données source du rapport `AUDIT_REPORT.md`). Peut être supprimé une fois l'audit intégré à la documentation. |

---

## Outils & IDE

| Fichier / Dossier | Rôle |
|-------------------|------|
| `.gitignore` | Liste des fichiers et dossiers exclus du dépôt Git (`node_modules`, `ios/Pods`, `android/build`, `.env`, etc.). |
| `.watchmanconfig` | Configuration de Watchman (outil de surveillance de fichiers utilisé par Metro). Fichier vide = configuration par défaut. |
| `.bundle/` | Configuration Bundler Ruby (chemin d'installation des gems). |
| `.idea/` | Fichiers de configuration de l'IDE JetBrains (Android Studio / WebStorm). Peut être commité pour partager la configuration IDE en équipe. |
| `.claude/` | Données de session de l'assistant Claude Code (mémoire, contexte). Non pertinent pour le développement. |
