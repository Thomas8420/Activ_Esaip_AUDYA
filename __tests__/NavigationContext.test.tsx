/**
 * Tests unitaires — src/context/NavigationContext.tsx
 * Couvre : NavigationProvider, useNavigation, navigateTo, goBack, goHome,
 *          navigateToProfile, navigateToMessagingChat.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {
  NavigationProvider,
  useNavigation,
  SelectedProfessional,
  SelectedConversation,
} from '../src/context/NavigationContext';

// ─── Helper ───────────────────────────────────────────────────────────────────

function captureNav() {
  let captured: ReturnType<typeof useNavigation> | null = null;
  const Consumer = () => {
    captured = useNavigation();
    return null;
  };
  return {Consumer, get: () => captured!};
}

// ─── Rendu ────────────────────────────────────────────────────────────────────

describe('NavigationProvider', () => {
  test('renders without crashing (default home)', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <></>
        </NavigationProvider>,
      );
    });
  });

  test('renders with initialScreen prop', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider initialScreen="register-step1">
          <Consumer />
        </NavigationProvider>,
      );
    });
    expect(get().currentScreen).toBe('register-step1');
  });

  test('useNavigation throws outside NavigationProvider', async () => {
    let caughtError: Error | null = null;
    class Boundary extends React.Component<
      {children: React.ReactNode},
      {hasError: boolean}
    > {
      state = {hasError: false};
      static getDerivedStateFromError() {
        return {hasError: true};
      }
      componentDidCatch(e: Error) {
        caughtError = e;
      }
      render() {
        return this.state.hasError ? null : this.props.children;
      }
    }
    const BadConsumer = () => {
      useNavigation();
      return null;
    };

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <Boundary>
          <BadConsumer />
        </Boundary>,
      );
    });
    spy.mockRestore();

    expect(caughtError).not.toBeNull();
    expect((caughtError as unknown as Error).message).toContain('NavigationProvider');
  });
});

// ─── État initial ─────────────────────────────────────────────────────────────

describe('NavigationContext — état initial', () => {
  test('currentScreen est "home" par défaut', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <Consumer />
        </NavigationProvider>,
      );
    });
    expect(get().currentScreen).toBe('home');
  });

  test('selectedProfessional est null par défaut', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <Consumer />
        </NavigationProvider>,
      );
    });
    expect(get().selectedProfessional).toBeNull();
  });
});

// ─── navigateTo ───────────────────────────────────────────────────────────────

describe('navigateTo', () => {
  test('change currentScreen vers la destination', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <Consumer />
        </NavigationProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      get().navigateTo('professionals');
    });

    expect(get().currentScreen).toBe('professionals');
  });

  test('empile les écrans successifs', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <Consumer />
        </NavigationProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      get().navigateTo('professionals');
      get().navigateTo('professional-profile');
    });

    expect(get().currentScreen).toBe('professional-profile');
    expect(get().previousScreen).toBe('professionals');
  });
});

// ─── goBack ───────────────────────────────────────────────────────────────────

describe('goBack', () => {
  test('revient à l\'écran précédent', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <Consumer />
        </NavigationProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      get().navigateTo('settings');
    });
    expect(get().currentScreen).toBe('settings');

    await ReactTestRenderer.act(async () => {
      get().goBack();
    });
    expect(get().currentScreen).toBe('home');
  });

  test('ne dépile pas en dessous de 1 écran', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <Consumer />
        </NavigationProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      get().goBack();
    });

    expect(get().currentScreen).toBe('home');
  });
});

// ─── goHome ───────────────────────────────────────────────────────────────────

describe('goHome', () => {
  test('réinitialise la pile à home', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <Consumer />
        </NavigationProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      get().navigateTo('professionals');
      get().navigateTo('professional-profile');
      get().navigateTo('settings');
    });

    await ReactTestRenderer.act(async () => {
      get().goHome();
    });

    expect(get().currentScreen).toBe('home');
  });
});

// ─── navigateToProfile ────────────────────────────────────────────────────────

describe('navigateToProfile', () => {
  const mockPro: SelectedProfessional = {
    id: '1', firstName: 'Jean', lastName: 'Dupont',
    email: 'j.dupont@example.com', phone: '0612345678',
    specialty: 'ORL', company: 'Clinique X',
    zipCode: '75001', city: 'Paris',
  };

  test('navigue vers professional-profile et stocke le professionnel', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <Consumer />
        </NavigationProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      get().navigateToProfile(mockPro);
    });

    expect(get().currentScreen).toBe('professional-profile');
    expect(get().selectedProfessional).toEqual(mockPro);
  });
});

// ─── navigateToMessagingChat ──────────────────────────────────────────────────

describe('navigateToMessagingChat', () => {
  const mockConv: SelectedConversation = {
    id: 42, subject: 'Suivi', correspondentId: 'pro-1',
    correspondentName: 'Dr. Martin', correspondentPhone: '0600000000',
    correspondentEmail: 'dr.martin@example.com', correspondentCity: 'Lyon',
    correspondentZip: '69001', status: 'pending',
  };

  test('navigue vers messaging-chat et stocke la conversation', async () => {
    const {Consumer, get} = captureNav();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <NavigationProvider>
          <Consumer />
        </NavigationProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      get().navigateToMessagingChat(mockConv);
    });

    expect(get().currentScreen).toBe('messaging-chat');
    expect(get().selectedConversation).toEqual(mockConv);
  });
});
