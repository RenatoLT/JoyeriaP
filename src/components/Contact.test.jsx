import '../setupTests.js'; //se importa meramente para que lo ejecute primero y se asegure de ejecutar el localstorage
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Contact from './Contact';

describe('Contact Component', () => {

  it('debe mostrar un mensaje de error si el RUT es inválido', async () => {
    render(<Contact />);

    // Llenar todos los campos para que la única validación que falle sea la del RUT
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan Prueba' } });
    fireEvent.change(screen.getByLabelText('RUT'), { target: { value: '12345678-0' } }); // RUT inválido
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'juan@prueba.com' } });
    fireEvent.change(screen.getByLabelText('Número de teléfono'), { target: { value: '+56912345678' } });
    fireEvent.change(screen.getByLabelText('Tipo de problema'), { target: { value: 'otro' } });
    fireEvent.change(screen.getByLabelText('Duda'), { target: { value: 'Esta es una prueba.' } });

    fireEvent.click(screen.getByText('Enviar'));

    // Esperar a que aparezca el mensaje de error
    const errorMessage = await screen.findByText('RUT inválido');
    expect(errorMessage).toBeInTheDocument();
  });

  it('debe mostrar un mensaje de éxito y limpiar el formulario al enviarlo correctamente', async () => {
    render(<Contact />);

    const nombreInput = screen.getByLabelText('Nombre');
    const rutInput = screen.getByLabelText('RUT');
    const correoInput = screen.getByLabelText('Correo electrónico');

    // Llenar el formulario con datos válidos
    fireEvent.change(nombreInput, { target: { value: 'Usuario Válido' } });
    fireEvent.change(rutInput, { target: { value: '12345678-5' } }); // RUT válido
    fireEvent.change(correoInput, { target: { value: 'valido@correo.com' } });
    fireEvent.change(screen.getByLabelText('Número de teléfono'), { target: { value: '+56987654321' } });
    fireEvent.change(screen.getByLabelText('Tipo de problema'), { target: { value: 'envio' } });
    fireEvent.change(screen.getByLabelText('Duda'), { target: { value: 'Consulta sobre mi envío.' } });

    fireEvent.click(screen.getByText('Enviar'));
    // Verificar que el mensaje de éxito aparece
    await waitFor(() => {
        expect(screen.getByText('Tu reclamo ha sido enviado correctamente ✅')).toBeInTheDocument();
    });

    // Verificar que los campos se limpiaron
    expect(nombreInput.value).toBe('');
    expect(rutInput.value).toBe('');
    expect(correoInput.value).toBe('');
  });

});