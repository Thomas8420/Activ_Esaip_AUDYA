/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import SettingsPage from '../src/components/Settings/SettingsPage';
import { NavigationProvider } from '../src/context/NavigationContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import { AuthProvider } from '../src/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 320, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

/**
 * Render helper — enveloppe dans tous les providers consommés par NavBar,
 * BottomNav et SettingsPage (Auth, Language, Navigation, SafeArea).
 */
const renderSettings = () =>
  ReactTestRenderer.create(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <AuthProvider>
        <LanguageProvider>
          <NavigationProvider>
            <SettingsPage />
          </NavigationProvider>
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>,
  );

// ── Render ──────────────────────────────────────────────────────────────────

test('SettingsPage renders without crashing', async () => {
  await ReactTestRenderer.act(async () => {
    renderSettings();
  });
});

test('SettingsPage displays the title "MES PARAMÈTRES"', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderSettings();
  });
  const json = renderer!.toJSON();
  const text = JSON.stringify(json);
  expect(text).toContain('MES PARAMÈTRES');
});

// ── Mock data defaults ───────────────────────────────────────────────────────

test('SettingsPage renders notification section', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderSettings();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Notifications de messages');
  expect(text).toContain("Notifications d'alertes");
  expect(text).toContain('Notifications de tâches');
});

test('SettingsPage renders password section', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderSettings();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Modifier le mot de passe');
});

test('SettingsPage renders account deletion button', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderSettings();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Supprimer mon compte');
});

test('SettingsPage renders save button', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderSettings();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Enregistrer les modifications');
});

// ── Preferences tabs ─────────────────────────────────────────────────────────

test('SettingsPage renders language and format tabs', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderSettings();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('FR');
  expect(text).toContain('JJ/MM/AAAA');
  expect(text).toContain('24h');
});

// ── Password mismatch ────────────────────────────────────────────────────────

test('password mismatch error is not shown when fields are empty', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderSettings();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).not.toContain('Les mots de passe ne correspondent pas');
});
