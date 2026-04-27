/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ProfilePage from '../src/components/Profile/ProfilePage';
import { renderWithProviders } from './test-utils';

const renderProfile = () => renderWithProviders(<ProfilePage />);

// ── Render ──────────────────────────────────────────────────────────────────

test('ProfilePage renders without crashing', async () => {
  await ReactTestRenderer.act(async () => {
    renderProfile();
  });
});

test('ProfilePage displays the title "Mon profil"', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderProfile();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Mon profil');
});

// ── Mock data defaults ───────────────────────────────────────────────────────

test('ProfilePage renders QR code section', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderProfile();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('partager votre profil');
});

test('ProfilePage renders gender selector with Homme and Femme', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderProfile();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Homme');
  expect(text).toContain('Femme');
});

test('ProfilePage renders mock last name and first name', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderProfile();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Duroc');
  expect(text).toContain('Roger');
});

test('ProfilePage renders email field with mock email', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderProfile();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('patient.audya-48@gmail.com');
});

test('ProfilePage renders save button', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderProfile();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Enregistrer les modifications');
});

test('ProfilePage renders city and zip code from mock data', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderProfile();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Lyon');
  expect(text).toContain('69007');
});

test('ProfilePage renders address from mock data', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderProfile();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('76 cours gambetta');
});

test('ProfilePage renders photo button', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderProfile();
  });
  const instance = renderer!.root;
  const photoButton = instance.findByProps({ testID: 'photoButton' });
  expect(photoButton).toBeTruthy();
});
