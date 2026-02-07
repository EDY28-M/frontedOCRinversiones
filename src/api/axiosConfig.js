import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const isDevelopment = import.meta.env.DEV;

// Logger condicional que solo ejecuta en desarrollo
const logger = {
  log: (...args) => isDevelopment && console.log(...args),
  group: (...args) => isDevelopment && console.group(...args),
  groupEnd: () => isDevelopment && console.groupEnd(),
  error: (...args) => isDevelopment && console.error(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
  info: (...args) => isDevelopment && console.info(...args),
};

logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
logger.log('🔧 AXIOS CONFIG INICIALIZADO');
logger.log('API Base URL:', API_BASE_URL);
logger.log('Environment:', isDevelopment ? 'development' : 'production');
logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Configuración de retry
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
  retryMethods: ['get', 'head', 'options'],
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos de timeout
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
    
    // Agregar timestamp para evitar caché del navegador en GET requests
    if (config.method === 'get' && config.cache !== true) {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    logger.group('📡 HTTP REQUEST');
    logger.log('Método:', config.method?.toUpperCase());
    logger.log('URL:', config.url);
    logger.log('Token presente:', !!token);
    if (config.data && isDevelopment) {
      // Ocultar password en los logs
      const dataToLog = { ...config.data };
      if (dataToLog.password) dataToLog.password = '***';
      if (dataToLog.confirmPassword) dataToLog.confirmPassword = '***';
      logger.log('Body:', dataToLog);
    }
    logger.groupEnd();
    
    return config;
  },
  (error) => {
    logger.error('❌ ERROR EN REQUEST INTERCEPTOR:', error);
    return Promise.reject(error);
  }
);

// Response interceptor con retry automático
axiosInstance.interceptors.response.use(
  (response) => {
    logger.group('✅ HTTP RESPONSE');
    logger.log('Status:', response.status, response.statusText);
    logger.log('URL:', response.config.url);
    logger.groupEnd();
    
    return response;
  },
  async (error) => {
    const { config, response } = error;
    
    // Configurar retry
    if (config && !config.__retryCount) {
      config.__retryCount = 0;
    }
    
    // Verificar si se debe hacer retry
    const shouldRetry = (
      config &&
      config.__retryCount < RETRY_CONFIG.maxRetries &&
      RETRY_CONFIG.retryMethods.includes(config.method?.toLowerCase()) &&
      (!response || RETRY_CONFIG.retryStatusCodes.includes(response.status))
    );
    
    if (shouldRetry) {
      config.__retryCount += 1;
      const delay = RETRY_CONFIG.retryDelay * Math.pow(2, config.__retryCount - 1); // Exponential backoff
      
      logger.warn(`🔄 Retry ${config.__retryCount}/${RETRY_CONFIG.maxRetries} para ${config.url} en ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return axiosInstance(config);
    }
    
    logger.group('❌ HTTP ERROR');
    logger.error('URL:', config?.url);
    logger.error('Método:', config?.method);
    
    if (response) {
      logger.error('Status:', response.status);
      logger.error('Data:', response.data);
    } else if (error.request) {
      logger.error('No hubo respuesta del servidor');
    } else {
      logger.error('Error:', error.message);
    }
    logger.groupEnd();
    
    // Manejo de errores específicos
    if (response?.status === 401) {
      logger.warn('⚠️ Token inválido/expirado (401)');
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    // Transformar error para mejor manejo
    const enhancedError = new Error(
      response?.data?.message || 
      error.message || 
      'Error desconocido en la petición'
    );
    enhancedError.status = response?.status;
    enhancedError.data = response?.data;
    enhancedError.originalError = error;
    
    return Promise.reject(enhancedError);
  }
);

// Métodos de conveniencia con tipado mejorado
export const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  
  // Método para cancelar requests
  CancelToken: axios.CancelToken,
  isCancel: axios.isCancel,
};

export default axiosInstance;
