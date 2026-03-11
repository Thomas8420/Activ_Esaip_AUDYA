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
  screens/           # Page containers (Screen-level components)
    Home/
      HomeScreen.tsx        # Container component for home page
      HomeScreen.styles.tsx # Centralized styles & color definitions
  components/        # Reusable UI components
    MainPage/        # Feature-specific components
      MainPage.tsx   # Main UI logic with SVG icons and menu grid
    common/          # Shared components across the app
      NavBar/        # Navigation bar component
      Button/        # Button variants (e.g., Fab - floating action button)
  assets/            # Images, SVG icons, etc.
    images/          # SVG icon files
__tests__/           # Test files (mirror src structure)
```

### Architecture Pattern

The app follows a **Screen → Component** hierarchy:
1. **Screens** (`src/screens/`) are containers that wrap safe area and layout concerns
2. **Components** (`src/components/`) provide the actual UI logic and structure
   - `MainPage/` contains feature-specific components
   - `common/` contains reusable UI widgets used across multiple pages
3. **Styles** are co-located with screens in `.styles.tsx` files
4. **Static data** (menu items, colors) are defined within components or styles

### Key Design Decisions

- **SVG Icons**: Uses `react-native-svg` and SVG components imported directly (e.g., `HealthIcon`)
- **Centralized Colors**: `HomeScreen.styles.tsx` defines a `COLORS` object for consistent theming
- **Layout Utilities**: Uses `SafeAreaContext` to handle device notches and safe areas
- **Responsive Grid**: Tile size calculated dynamically based on screen width (2-column grid)
- **Styled Components**: All styling is done with `StyleSheet.create()` and stored in `.styles.tsx` files

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
- **Constants**: UPPER_SNAKE_CASE (e.g., `MENU_ITEMS`, `TILE_GAP`)
- **Files**: Match component name (e.g., `MainPage.tsx`, `HomeScreen.styles.tsx`)

### Component Organization
- Include JSDoc comments explaining component purpose (see `HomeScreen.tsx` for example)
- Separate static data (MENU_ITEMS) from component logic
- Keep styles in separate `.styles.tsx` files for screens

### Styling Guidelines
- Use `StyleSheet.create()` for performance optimization
- Define colors in centralized `COLORS` object
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
- Main screen container: `src/screens/Home/HomeScreen.tsx`
- Main UI logic: `src/components/MainPage/MainPage.tsx`
- Configuration: `app.json`, `babel.config.js`, `jest.config.js`, `tsconfig.json`
- ESLint config: `.eslintrc.js` (extends `@react-native`)
- Prettier config: `.prettierrc.js`

## Git & Branching

- Main branch: `main`
- Recent merges show feature branches (e.g., `BaptisteM`)
- Use descriptive commit messages following conventional format when possible

## Important Notes

- The app is currently in early stages (main entry point is `HomeScreen`)
- Static menu items are defined in `MainPage.tsx` (MENU_ITEMS constant)
- Layout uses responsive calculations (TILE_SIZE based on window width)
- Both iOS and Android builds need to be tested after significant changes
- SVG icons are imported as React components and rendered with width/height props
