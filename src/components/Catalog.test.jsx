import '../setupTests.js';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';

// Simulamos los productos que nuestro 'fetch' falso devolverá
const mockProducts = [
  { id: 1, nombre: 'Collar de oro', precio: 100000, foto: 'path/to/image1.jpg' },
  { id: 2, nombre: 'Cadena de Eslabones', precio: 50000, foto: 'path/to/image2.jpg' },
];

// Mock global de la función fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockProducts),
  })
);

describe('Cart Component (Carrito)', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe calcular el subtotal, IVA y total correctamente', async () => {
    localStorage.setItem('carrito', JSON.stringify([1, 2]));

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    // Usamos findByText, que automáticamente espera a que el elemento aparezca.
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

    // Esperar a que el producto desaparezca
    await waitFor(() => {
      expect(screen.queryByText('Collar de oro')).not.toBeInTheDocument();
    });

    // Verificar los nuevos totales
    const newSubtotalText = await screen.findByText('$42.017');
    const shippingText = await screen.findByText('$7.290');

    expect(newSubtotalText).toBeInTheDocument();
    expect(shippingText).toBeInTheDocument();
  });
});