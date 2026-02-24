import axiosInstance from '../api/axiosConfig';

export const authService = {
  login: async (credentials) => {
    console.group('🔐 AuthService.login');
    console.log('📤 Enviando al backend:', {
      username: credentials.usuario,
      password: '***'
    });
    console.log('🕐 Timestamp:', new Date().toISOString());

    try {
      // El backend espera username y password
      const response = await axiosInstance.post('/auth/login', {
        username: credentials.usuario,
        password: credentials.password
      });

      console.log('✅ ¡RESPUESTA RECIBIDA!');
      console.table({
        'Token Recibido': response.data.token ? 'SÍ' : 'NO',
        'Username': response.data.username,
        'Email': response.data.email,
        'Role': response.data.role,
        'Expira': response.data.expiresAt
      });
      console.groupEnd();

      return response.data; // Retorna: { token, username, email, role, expiresAt }
    } catch (error) {
      console.error('❌ ========== ERROR EN AUTHSERVICE ==========');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Error Data:', error.response?.data);
      console.error('Error Message:', error.message);
      console.error('URL:', error.config?.baseURL + error.config?.url);
      console.error('================================================');
      console.groupEnd();
      throw error;
    }
  },

  logout: async () => {
    console.log('🚪 AuthService.logout - Cerrando sesión...');
    try {
      await axiosInstance.post('/auth/logout');
      console.log('✅ Sesión cerrada en el servidor');
    } catch (error) {
      console.error('❌ Error al cerrar sesión en servidor:', error.message);
    } finally {
      localStorage.removeItem('token');
      console.log('✅ Token eliminado del localStorage');
    }
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      // Decodificar el JWT para obtener la información del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));

      console.log('🔍 Payload completo del token:', payload);

      // Manejar múltiples formatos de JWT - Flexibilidad para diferentes estructuras
      const username = payload.unique_name
        || payload.name
        || payload.preferred_username
        || payload.username
        || payload.sub
        || 'Usuario';

      // .NET JWT usa el claim "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      // Pero también puede venir como "role" directamente
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        || payload.role
        || payload.roles?.[0]
        || 'Vendedor';

      const email = payload.email || '';

      console.log('✅ Usuario decodificado:', {
        username,
        role,
        email,
        userId: payload.sub
      });

      return {
        username,
        role,
        email,
        userId: payload.sub || payload.id
      };
    } catch (error) {
      console.error('❌ Error decodificando token:', error.message);
      return null;
    }
  },

  forgotPassword: async (email) => {
    console.log('🔑 AuthService.forgotPassword:', email);
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    console.log('✅ Forgot password response:', response.data);
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    console.log('🔐 AuthService.resetPassword');
    const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
    console.log('✅ Reset password response:', response.data);
    return response.data;
  },
};
