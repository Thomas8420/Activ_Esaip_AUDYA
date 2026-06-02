/* eslint-env jest, node */
// Setup global fetch mock pour les tests (non disponible dans jsdom par défaut)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  }),
);

// Stockage chiffré natif (Keychain/Keystore) — wrapper en mémoire pour les tests.
jest.mock('react-native-encrypted-storage', () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      setItem: jest.fn((key, value) => {
        store.set(key, value);
        return Promise.resolve();
      }),
      getItem: jest.fn(key => Promise.resolve(store.get(key) ?? null)),
      removeItem: jest.fn(key => {
        store.delete(key);
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store.clear();
        return Promise.resolve();
      }),
    },
  };
});
