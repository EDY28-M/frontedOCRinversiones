import axiosInstance from '../api/axiosConfig';

export const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    const response = await axiosInstance.get('/products');
    return response.data;
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // Crear nuevo producto
  createProduct: async (productData) => {
    const response = await axiosInstance.post('/products', productData);
    return response.data;
  },

  // Actualizar producto
  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
  },

  // Actualizar estado (Activo/Inactivo) optimizado
  updateProductStatus: async (id, isActive) => {
    const response = await axiosInstance.patch(`/products/${id}/status`, { isActive });
    return response.data;
  },

  // Eliminar producto
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  // Importación masiva de productos
  bulkImportProducts: async (products) => {
    const response = await axiosInstance.post('/products/bulk-import', { 
      products,
      autoCreateEntities: true
    });
    return response.data;
  },

  // Generar códigos automáticos
  generateCodes: async () => {
    const response = await axiosInstance.get('/products/generate-codes');
    return response.data;
  },

  // Verificar si un código está disponible
  checkCodigoAvailable: async (codigo) => {
    const response = await axiosInstance.get('/products/check-codigo-available', {
      params: { codigo }
    });
    return response.data;
  },

  // Verificar si un código comercial está disponible
  checkCodigoComercialAvailable: async (codigoComer) => {
    const response = await axiosInstance.get('/products/check-codigo-comercial-available', {
      params: { codigoComer }
    });
    return response.data;
  },

  // Obtener productos disponibles (con imágenes) paginados
  getAvailableProducts: async ({ page = 1, pageSize = 12, q = '', categoryId = null, onlyWithImages = true } = {}) => {
    const params = { page, pageSize, onlyWithImages };
    if (q) params.q = q;
    if (categoryId) params.categoryId = categoryId;
    
    const response = await axiosInstance.get('/products/available', { params });
    return response.data;
  },
};

export const categoryService = {
  // Obtener todas las categorías
  getAllCategories: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  // Obtener categoría por ID
  getCategoryById: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  // Crear nueva categoría
  createCategory: async (categoryData) => {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  },

  // Actualizar categoría
  updateCategory: async (id, categoryData) => {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Eliminar categoría
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },
};

// ===== NOMBRE MARCAS =====
export const nombreMarcaService = {
  // Obtener todas las marcas
  getAllNombreMarcas: async () => {
    const response = await axiosInstance.get('/nombremarcas');
    return response.data;
  },

  // Obtener marca por ID
  getNombreMarcaById: async (id) => {
    const response = await axiosInstance.get(`/nombremarcas/${id}`);
    return response.data;
  },

  // Crear marca
  createNombreMarca: async (nombreMarcaData) => {
    const response = await axiosInstance.post('/nombremarcas', nombreMarcaData);
    return response.data;
  },

  // Actualizar marca
  updateNombreMarca: async (id, nombreMarcaData) => {
    const response = await axiosInstance.put(`/nombremarcas/${id}`, nombreMarcaData);
    return response.data;
  },

  // Eliminar marca
  deleteNombreMarca: async (id) => {
    const response = await axiosInstance.delete(`/nombremarcas/${id}`);
    return response.data;
  },
};
