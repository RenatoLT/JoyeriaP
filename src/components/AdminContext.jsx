import { createContext, useState, useContext } from 'react';
import api from '../api/axiosConfig';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Al iniciar, buscamos si ya hay un usuario guardado con su token
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Función de Login REAL (conecta con Spring Boot)
  const login = async (email, password) => {
    try {
      // 1. Petición al Backend
      const response = await api.post('/auth/login', { email, password });
      
      // 2. Si es exitoso, el backend devuelve { token, nombre, role }
      const userData = response.data;
      
      // 3. Guardamos en el navegador y en el estado
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error("Error login:", error);
      return { success: false, message: 'Credenciales inválidas' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/'; // Redirigir al Home
  };

  // Verificamos roles según lo que envía el backend (ajusta si tus roles se llaman distinto)
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'admin';
  const isEmpleado = user?.role === 'ROLE_EMPLEADO' || user?.role === 'empleado';

  return (
    <AdminContext.Provider value={{ user, login, logout, isAdmin, isEmpleado }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);