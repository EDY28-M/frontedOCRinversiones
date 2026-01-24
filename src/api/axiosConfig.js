import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔧 AXIOS CONFIG INICIALIZADO');
console.log('API Base URL:', API_BASE_URL);
console.log('Timestamp:', new Date().toLocaleTimeString());
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 0, // Sin timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.group('📡 HTTP REQUEST');
    console.log('Método:', config.method?.toUpperCase());
    console.log('URL Completa:', config.baseURL + config.url);
    console.log('Token presente:', !!token);
    if (config.data) {
      // Ocultar password en los logs
      const dataToLog = { ...config.data };
      if (dataToLog.password) dataToLog.password = '***';
      console.log('Body:', dataToLog);
    }
    console.log('Headers:', config.headers);
    console.log('⏱️', new Date().toLocaleTimeString());
    console.groupEnd();
    
    return config;
  },
  (error) => {
    console.error('❌ ERROR EN REQUEST INTERCEPTOR:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.group('✅ HTTP RESPONSE EXITOSA');
    console.log('Status:', response.status, response.statusText);
    console.log('URL:', response.config.url);
    console.log('Data keys:', Object.keys(response.data || {}));
    console.log('Response completa:', response.data);
    console.log('⏱️', new Date().toLocaleTimeString());
    console.groupEnd();
    
    return response;
  },
  (error) => {
    console.group('❌ HTTP RESPONSE ERROR');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Tipo:', error.name);
    console.error('Mensaje:', error.message);
    
    if (error.response) {
      console.error('━━━ RESPUESTA DEL SERVIDOR ━━━');
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('━━━ NO HUBO RESPUESTA ━━━');
      console.error('Request:', error.request);
      console.error('URL:', error.config?.baseURL + error.config?.url);
    } else {
      console.error('━━━ ERROR DE CONFIGURACIÓN ━━━');
      console.error('Config:', error.config);
    }
    
    console.error('⏱️', new Date().toLocaleTimeString());
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.groupEnd();
    
    if (error.response?.status === 401) {
      console.warn('⚠️ Token inválido/expirado (401). Limpiando sesión...');
      localStorage.removeItem('token');

      // Notificar al contexto React mediante evento personalizado
      window.dispatchEvent(new CustomEvent('auth:logout'));

      // NO hacer window.location.href - causa recarga y pérdida de estado de error
      // El componente que hizo la petición manejará el error y decidirá si navegar
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
