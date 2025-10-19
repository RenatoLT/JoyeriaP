import '../setupTests.js'; //se importa meramente para que lo ejecute primero y se asegure de ejecutar el localstorage
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AdminProvider } from './AdminContext.jsx';
import LogIn from './LogIn.jsx';
import SignIn from './SignIn.jsx';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('LogIn Component ', () => {

    it('debe mostrar un mensaje de error si las contraseñas no coinciden, registro', async () => {
        render(
            <MemoryRouter>
                <AdminProvider>
                    <LogIn />
                </AdminProvider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('Correo Electrónico'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'Password123!' } });
        fireEvent.change(screen.getByPlaceholderText('Repite Contraseña'), { target: { value: 'PasswordDIFERENTE!' } });
        fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
        await waitFor(async () => {
            expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
        });
    });
});

describe('SignIn Component (Inicio de Sesión)', () => {
    it('debe mostrar un mensaje de error si las credenciales son incorrectas', async () => {
        render(
            <MemoryRouter>
                <AdminProvider>
                    <SignIn />
                </AdminProvider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'usuario@incorrecto.com' } });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'clavemala' } });
        
        fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
        
        await waitFor(() => {
            expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
        });
    });
});