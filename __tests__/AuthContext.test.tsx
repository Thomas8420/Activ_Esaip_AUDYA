/**
 * Tests unitaires — src/context/AuthContext.tsx
 * Couvre : AuthProvider, useAuth, loginFirstFactor, loginSuccess, logout.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {AuthProvider, useAuth} from '../src/context/AuthContext';

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Capture la valeur du contexte depuis un consumer. */
function captureContext() {
  let captured: ReturnType<typeof useAuth> | null = null;
  const Consumer = () => {
    captured = useAuth();
    return null;
  };
  return {Consumer, getCaptured: () => captured};
}

// ─── Rendu ────────────────────────────────────────────────────────────────────

describe('AuthProvider', () => {
  test('renders without crashing', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <AuthProvider>
          <></>
        </AuthProvider>,
      );
    });
  });

  test('useAuth throws outside AuthProvider', async () => {
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
      useAuth();
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
    expect((caughtError as unknown as Error).message).toContain('AuthProvider');
  });
});

// ─── État initial ─────────────────────────────────────────────────────────────

describe('AuthContext — état initial', () => {
  test('isAuthenticated est false par défaut', async () => {
    const {Consumer, getCaptured} = captureContext();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <AuthProvider>
          <Consumer />
        </AuthProvider>,
      );
    });
    expect(getCaptured()!.isAuthenticated).toBe(false);
  });

  test('pendingEmail est vide par défaut', async () => {
    const {Consumer, getCaptured} = captureContext();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <AuthProvider>
          <Consumer />
        </AuthProvider>,
      );
    });
    expect(getCaptured()!.pendingEmail).toBe('');
  });
});

// ─── loginFirstFactor ─────────────────────────────────────────────────────────

describe('loginFirstFactor', () => {
  test('peuple pendingEmail après le premier facteur (mock mode)', async () => {
    const {Consumer, getCaptured} = captureContext();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <AuthProvider>
          <Consumer />
        </AuthProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      await getCaptured()!.loginFirstFactor('user@gmail.com', 'any');
    });

    expect(getCaptured()!.pendingEmail).toBe('user@gmail.com');
  });

  test('ne passe pas isAuthenticated à true (DEV_SKIP_2FA = false)', async () => {
    const {Consumer, getCaptured} = captureContext();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <AuthProvider>
          <Consumer />
        </AuthProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      await getCaptured()!.loginFirstFactor('user@gmail.com', 'any');
    });

    // DEV_SKIP_2FA est false → la 2FA reste requise
    expect(getCaptured()!.isAuthenticated).toBe(false);
  });
});

// ─── loginSuccess ─────────────────────────────────────────────────────────────

describe('loginSuccess', () => {
  test('passe isAuthenticated à true', async () => {
    const {Consumer, getCaptured} = captureContext();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <AuthProvider>
          <Consumer />
        </AuthProvider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      getCaptured()!.loginSuccess();
    });

    expect(getCaptured()!.isAuthenticated).toBe(true);
  });
});

// ─── logout ───────────────────────────────────────────────────────────────────

describe('logout', () => {
  test('remet isAuthenticated à false et vide pendingEmail', async () => {
    const {Consumer, getCaptured} = captureContext();
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <AuthProvider>
          <Consumer />
        </AuthProvider>,
      );
    });

    // Simuler un login complet
    await ReactTestRenderer.act(async () => {
      await getCaptured()!.loginFirstFactor('user@gmail.com', 'any');
      getCaptured()!.loginSuccess();
    });

    expect(getCaptured()!.isAuthenticated).toBe(true);
    expect(getCaptured()!.pendingEmail).toBe('user@gmail.com');

    // Déconnexion
    await ReactTestRenderer.act(async () => {
      await getCaptured()!.logout();
    });

    expect(getCaptured()!.isAuthenticated).toBe(false);
    expect(getCaptured()!.pendingEmail).toBe('');
  });
});
