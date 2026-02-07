import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 checkAuth - Token existe:', !!token);

    if (token) {
      try {
        const userData = authService.getCurrentUser();

        if (userData && userData.username && userData.role) {
          // Token válido y decodificado correctamente
          console.log('✅ Usuario restaurado desde token:', userData);
          setUser(userData);
        } else {
          // Token existe pero no se pudo decodificar correctamente
          console.warn('⚠️ Token inválido o corrupto. Limpiando sesión.');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        // Error inesperado - limpiar solo si es crítico
        console.error('❌ Error crítico al verificar autenticación:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listener para eventos de logout forzado (desde axios interceptor)
  useEffect(() => {
    const handleForcedLogout = () => {
      console.warn('⚠️ Sesión cerrada por el interceptor (401)');
      setUser(null);
    };

    window.addEventListener('auth:logout', handleForcedLogout);

    return () => {
      window.removeEventListener('auth:logout', handleForcedLogout);
    };
  }, []);

  const login = async (credentials) => {
    // NO limpiar authError aquí - el componente de login maneja su propio error
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.token);
    const userData = {
      username: response.username,
      email: response.email,
      role: response.role
    };
    setUser(userData);
    // Limpiar cualquier error previo de auth solo tras login exitoso
    setAuthError(null);
    // Retornar userData para que Login.jsx pueda usarlo
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    // NO navegar automáticamente - dejar que el componente decida
  };

  // Función para limpiar error de auth - solo por acción del usuario
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    authError,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
