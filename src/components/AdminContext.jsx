import { createContext, useState, useContext } from 'react';
import api from '../api/axiosConfig';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // LOGIN REAL
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data; // { token, nombre, role }
      
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
    window.location.href = '/';
  };

  // Ajuste de roles según lo que devuelve tu AuthController
  const isAdmin = user?.role === 'admin' || user?.role === 'ROLE_ADMIN';
  const isEmpleado = user?.role === 'empleado' || user?.role === 'ROLE_EMPLEADO';

  return (
    <AdminContext.Provider value={{ user, login, logout, isAdmin, isEmpleado }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);