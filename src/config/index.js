export const config = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  appName: 'Inversiones App',
  version: '1.0.0',
  environment: import.meta.env.MODE,
};
