/**
 * Helpers de test partagés.
 *
 * `renderWithProviders` enveloppe un composant dans la pile de providers
 * minimale dont dépendent les Pages authentifiées : SafeArea (edges sur
 * SafeAreaView), Auth (NavBar dropdown), Language (t()), Navigation.
 *
 * Évite de répéter la même cascade dans chaque test ; un changement de
 * provider se répercute en un seul endroit.
 */

import React, { ReactElement, ReactNode } from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import { NavigationProvider } from '../src/context/NavigationContext';
import type { Screen } from '../src/context/NavigationContext';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 320, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

interface Options {
  initialScreen?: Screen;
}

export const AppProviders = ({ children, initialScreen }: { children: ReactNode } & Options) => (
  <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
    <AuthProvider>
      <LanguageProvider>
        <NavigationProvider initialScreen={initialScreen}>
          {children}
        </NavigationProvider>
      </LanguageProvider>
    </AuthProvider>
  </SafeAreaProvider>
);

export const renderWithProviders = (
  ui: ReactElement,
  options?: Options,
): ReactTestRenderer.ReactTestRenderer =>
  ReactTestRenderer.create(<AppProviders {...options}>{ui}</AppProviders>);
