/**
 * API Client para endpoints públicos (sin autenticación)
 * Reutiliza la misma lógica del backend que usa el Admin "Productos Disponibles"
 * pero a través del endpoint público /api/products/public/active
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Instancia de axios sin autenticación para endpoints públicos
const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Servicio de productos públicos
 * Consume el endpoint GET /api/products/public/active que reutiliza
 * la misma lógica de filtrado del Admin "Productos Disponibles":
 * - Solo productos con IsActive = true
 * - Solo productos con al menos 1 imagen válida
 * - Paginación y búsqueda incluidas
 */
export const publicProductsApi = {
  /**
   * Obtiene productos activos con imágenes (mismos que aparecen en Admin "Productos Disponibles")
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página (default: 1)
   * @param {number} params.pageSize - Cantidad por página (default: 16)
   * @param {string} params.q - Término de búsqueda (opcional)
   * @param {number} params.categoryId - ID de categoría para filtrar (opcional)
   * @param {string} params.brandIds - IDs de marcas para filtrar (separadas por coma) (opcional)
   * @returns {Promise<{items: Array, page: number, pageSize: number, total: number}>}
   */
  getActiveProducts: async ({ page = 1, pageSize = 16, q = '', categoryId = null, brandIds = undefined } = {}) => {
    try {
      const params = { page, pageSize };
      if (q && q.trim()) params.q = q.trim();
      if (categoryId) params.categoryId = categoryId;
      if (brandIds) params.brandIds = brandIds;

      const response = await publicAxios.get('/products/public/active', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos públicos:', error);
      throw error;
    }
  },

  /**
   * Obtiene productos destacados públicos (solo activos con imágenes)
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Número de página (default: 1)
   * @param {number} params.pageSize - Cantidad por página (default: 9)
   * @returns {Promise<{items: Array, page: number, pageSize: number, total: number}>}
   */
  getFeaturedProducts: async ({ page = 1, pageSize = 9 } = {}) => {
    try {
      const params = { page, pageSize };
      const response = await publicAxios.get('/products/public/featured', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos destacados públicos:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las categorías activas (público)
   * @returns {Promise<Array>}
   */
  getCategories: async () => {
    try {
      const response = await publicAxios.get('/categories/public');
      return response.data;
    } catch (error) {
      // Si no existe endpoint público de categorías, devolver array vacío
      console.warn('Endpoint de categorías públicas no disponible:', error.message);
      return [];
    }
  },

  /**
   * Obtiene todas las marcas activas (público)
   * @returns {Promise<Array>}
   */
  getBrands: async () => {
    try {
      const response = await publicAxios.get('/products/public/brands');
      return response.data;
    } catch (error) {
      console.warn('Endpoint de marcas públicas no disponible:', error.message);
      return [];
    }
  },

  /**
   * Obtiene todas las categorías activas con conteo de productos (público)
   * @returns {Promise<Array>}
   */
  getPublicCategories: async () => {
    try {
      const response = await publicAxios.get('/products/public/categories');
      return response.data;
    } catch (error) {
      console.warn('Endpoint de categorías públicas no disponible:', error.message);
      return [];
    }
  },
};

export default publicAxios;
