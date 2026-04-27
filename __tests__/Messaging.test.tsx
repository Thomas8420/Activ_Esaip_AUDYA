/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import MessagingPage from '../src/components/Messaging/MessagingPage';
import MessagingChatPage from '../src/components/Messaging/MessagingChatPage';
import { SelectedConversation } from '../src/context/NavigationContext';
import { renderWithProviders } from './test-utils';

/** Conversation de test pour MessagingChatPage */
const MOCK_CONVERSATION: SelectedConversation = {
  id: 1,
  subject: 'Draft 1',
  correspondentId: '1',
  correspondentName: 'Arnaud DEVEZE',
  correspondentPhone: '0600000000',
  correspondentEmail: 'arnaud.deveze@example.com',
  correspondentCity: 'Bordeaux',
  correspondentZip: '33000',
  status: 'pending',
  isOnline: true,
};

/** Helpers de rendu */
const renderMessagingPage = () => renderWithProviders(<MessagingPage />);

const renderChatPage = (conv: SelectedConversation = MOCK_CONVERSATION) =>
  renderWithProviders(<MessagingChatPage conversation={conv} />);

// ── MessagingPage ──────────────────────────────────────────────────────────────

test('MessagingPage renders without crashing', async () => {
  await ReactTestRenderer.act(async () => {
    renderMessagingPage();
  });
});

test('MessagingPage displays title "Ma messagerie"', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderMessagingPage();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Ma messagerie');
});

test('MessagingPage displays EN LIGNE filter badge', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderMessagingPage();
  });
  const instance = renderer!.root;
  const badge = instance.findByProps({ testID: 'filterOnline' });
  expect(badge).toBeTruthy();
});

test('MessagingPage renders conversation list with mock data', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderMessagingPage();
  });
  const instance = renderer!.root;
  const list = instance.findByProps({ testID: 'conversationList' });
  expect(list).toBeTruthy();
});

test('MessagingPage shows correspondent names from mock data', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderMessagingPage();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Arnaud DEVEZE');
});

test('MessagingPage shows conversation subjects from mock data', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderMessagingPage();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Draft 1');
});

// ── MessagingChatPage ──────────────────────────────────────────────────────────

test('MessagingChatPage renders without crashing', async () => {
  await ReactTestRenderer.act(async () => {
    renderChatPage();
  });
});

test('MessagingChatPage displays chat header', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderChatPage();
  });
  const instance = renderer!.root;
  const header = instance.findByProps({ testID: 'chatHeader' });
  expect(header).toBeTruthy();
});

test('MessagingChatPage shows correspondent name in sub-header', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderChatPage();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Arnaud DEVEZE');
});

test('MessagingChatPage shows correspondent location', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderChatPage();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('33000');
  expect(text).toContain('Bordeaux');
});

test('MessagingChatPage renders message input', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderChatPage();
  });
  const instance = renderer!.root;
  const input = instance.findByProps({ testID: 'messageInput' });
  expect(input).toBeTruthy();
});

test('MessagingChatPage renders send button', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderChatPage();
  });
  const instance = renderer!.root;
  const btn = instance.findByProps({ testID: 'sendButton' });
  expect(btn).toBeTruthy();
});

test('MessagingChatPage renders attach photo and document buttons', async () => {
  // Le bouton attach unique a été splitté en deux : photo (galerie/caméra)
  // et document (DocumentPicker). Vérifie les deux testIDs.
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderChatPage();
  });
  const instance = renderer!.root;
  expect(instance.findByProps({ testID: 'attachPhotoButton' })).toBeTruthy();
  expect(instance.findByProps({ testID: 'attachDocButton' })).toBeTruthy();
});

test('MessagingChatPage renders close button', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderChatPage();
  });
  const instance = renderer!.root;
  const btn = instance.findByProps({ testID: 'closeChat' });
  expect(btn).toBeTruthy();
});

test('MessagingChatPage renders message list with mock messages', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderChatPage();
  });
  const instance = renderer!.root;
  const list = instance.findByProps({ testID: 'messagesList' });
  expect(list).toBeTruthy();
});

test('MessagingChatPage shows mock message text', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = renderChatPage();
  });
  const text = JSON.stringify(renderer!.toJSON());
  expect(text).toContain('Bonjour');
});
