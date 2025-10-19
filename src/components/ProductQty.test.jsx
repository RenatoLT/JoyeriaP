import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductQty from './ProductQty';

describe('ProductQty Component', () => {

  it('debe renderizar el valor inicial correctamente', () => {
    render(<ProductQty initial={5} />);
    const input = screen.getByDisplayValue('5');
    expect(input).toBeInTheDocument();
  });

  it('debe incrementar la cantidad al hacer clic en el botón "+"', () => {
    render(<ProductQty initial={1} />);
    
    // Busca el input por su rol y valor actual
    const input = screen.getByRole('textbox', { value: '1' }); 
    
    // Busca el botón "+" y simula un clic
    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);

    // Verifica que el valor del input ahora sea '2'
    expect(input.value).toBe('2');
  });

  it('debe decrementar la cantidad al hacer clic en el botón "-"', () => {
    render(<ProductQty initial={5} />);
    
    const input = screen.getByRole('textbox', { value: '5' });
    
    const decrementButton = screen.getByText('-');
    fireEvent.click(decrementButton);
    
    // Verifica que el valor del input ahora sea '4'
    expect(input.value).toBe('4');
  });

  it('no debe decrementar por debajo del valor mínimo (min)', () => {
    render(<ProductQty initial={0} min={0} />);
    
    const input = screen.getByRole('textbox', { value: '0' });
    
    const decrementButton = screen.getByText('-');
    fireEvent.click(decrementButton);

    // El valor no debería cambiar porque ya está en el mínimo
    expect(input.value).toBe('0');
  });

});