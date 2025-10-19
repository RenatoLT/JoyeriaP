import '@testing-library/jest-dom';

// --- Simulación (mock) de localStorage para todas las pruebas ---
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
})();

// Asigna el mock al objeto 'window' para que esté disponible globalmente
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});