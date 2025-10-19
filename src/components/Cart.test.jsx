import '../setupTests.js';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';

// --- Mock de datos de productos ---
// Simulamos los productos que fetch recuperaría de catalog.json
const mockProducts = [
  { id: 1, nombre: 'Collar de oro', precio: 100000, foto: 'path/to/image1.jpg' },
  { id: 2, nombre: 'Cadena de Eslabones', precio: 50000, foto: 'path/to/image2.jpg' },
];

// --- Mock global de la función fetch ---
// Esto intercepta todas las llamadas a fetch en nuestras pruebas.
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockProducts),
  })
);

describe('Cart Component', () => {

  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    localStorage.clear();
    vi.clearAllMocks();
    });

    it('debe calcular correctamente el total del carrito', async () => {
        const initialCart = [1,2]; // IDs de productos en el carrito
        localStorage.setItem('carrito', JSON.stringify(initialCart));
        
        render(
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      );

        const subtotalText = await screen.findByText('$126.050');
        const ivaText = await screen.findByText('$23.950');
        const totalText = await screen.findByText('$150.000');
        expect(subtotalText).toBeInTheDocument();
        expect(ivaText).toBeInTheDocument();
        expect(totalText).toBeInTheDocument();
  });

    it('debe eliminar un producto y recalcular el total', async () => {
        localStorage.setItem('carrito', JSON.stringify([1, 2]));

        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );

        // Esperar a que el producto inicial esté visible
        await screen.findByText('Collar de oro');
        
        // Encontrar y hacer clic en el botón de eliminar del primer producto
        const deleteButtons = screen.getAllByText('❌');
        fireEvent.click(deleteButtons[0]);

        // Esperar a que el producto desaparezca y los nuevos totales aparezcan
        await waitFor(() => {
        expect(screen.queryByText('Collar de oro')).not.toBeInTheDocument();
        });

        const newSubtotalText = await screen.findByText('$42.017');
        const shippingText = await screen.findByText('$7.290');

        expect(newSubtotalText).toBeInTheDocument();
        expect(shippingText).toBeInTheDocument();
  });
});