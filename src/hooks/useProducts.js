import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useNotification } from '../context/NotificationContext';
import { useCallback, useMemo } from 'react';

// Query key factory para productos - centralizado y type-safe
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters],
  detail: (id) => [...productKeys.all, 'detail', id],
  available: () => [...productKeys.all, 'available'],
  availableList: (filters) => [...productKeys.available(), filters],
  featured: () => [...productKeys.all, 'featured'],
  infinite: () => [...productKeys.all, 'infinite'],
  recent: (limit) => [...productKeys.all, 'recent', limit],
};

// Constantes de configuración
const STALE_TIME = 5 * 60 * 1000; // 5 minutos
const GC_TIME = 10 * 60 * 1000; // 10 minutos

/**
 * Hook para obtener productos disponibles (con imágenes) con paginación del backend
 * Optimizado con React Query v5
 */
export function useAvailableProducts({ page = 1, pageSize = 12, q = '', categoryId = null, onlyActive = true } = {}) {
  // Memoizar filtros para evitar re-renders innecesarios
  const filters = useMemo(() => ({
    page,
    pageSize,
    q: q?.trim() || '',
    categoryId,
    onlyActive,
  }), [page, pageSize, q, categoryId, onlyActive]);

  return useQuery({
    queryKey: productKeys.availableList(filters),
    queryFn: () => productService.getAvailableProducts(filters),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    // Habilitar solo cuando hay filtros válidos
    enabled: page > 0 && pageSize > 0,
  });
}

/**
 * Hook para obtener productos con React Query
 * Soporta filtros, paginación y búsqueda
 */
export function useProducts(filters = {}) {
  // Memoizar la representación string de los filtros para estabilidad
  const filtersString = JSON.stringify(filters);
  
  const memoizedFilters = useMemo(() => filters, [filtersString]);

  return useQuery({
    queryKey: productKeys.list(memoizedFilters),
    queryFn: () => productService.getAllProducts(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obtener un producto por ID
 * Con prefetch automático y caché optimizada
 */
export function useProduct(id) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para prefetch de producto (usado en hover del botón Editar)
 * Evita el flash blanco al navegar
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  const prefetchProduct = useCallback((id) => {
    if (!id) return;
    
    // Verificar si ya está en caché antes de prefetch
    const existingData = queryClient.getQueryData(productKeys.detail(id));
    if (existingData) return;
    
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => productService.getProductById(id),
      staleTime: STALE_TIME,
    });
  }, [queryClient]);

  return prefetchProduct;
}

/**
 * Hook para obtener productos destacados
 * Caché más larga ya que cambian poco frecuentemente
 */
export function useFeaturedProducts(options = {}) {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productService.getAvailableProducts({ 
      page: 1, 
      pageSize: 9, 
      onlyWithImages: true 
    }),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    ...options,
  });
}

/**
 * Hook para scroll infinito de productos
 * Ideal para catálogos grandes
 */
export function useInfiniteProducts(pageSize = 12) {
  return useInfiniteQuery({
    queryKey: productKeys.infinite(),
    queryFn: ({ pageParam = 1 }) => 
      productService.getAvailableProducts({ page: pageParam, pageSize }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.currentPage + 1;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
}

/**
 * Hook para obtener los últimos productos creados (historial reciente)
 * @param {number} limit - Cantidad de productos recientes (1-100, default 10)
 */
export function useRecentProducts(limit = 10) {
  return useQuery({
    queryKey: productKeys.recent(limit),
    queryFn: () => productService.getRecentProducts(limit),
    staleTime: 2 * 60 * 1000, // 2 minutos — datos que cambian con cada importación
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
  });
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Hook para actualizar producto completo
 * Con invalidación optimizada de caché
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: async ({ id, productData }) => {
      return productService.updateProduct(id, productData);
    },

    onSuccess: (data, { id }) => {
      // Actualizar caché inmediatamente sin esperar refetch
      queryClient.setQueryData(productKeys.detail(id), data);

      queryClient.setQueriesData({ queryKey: productKeys.lists() }, (oldData) => {
        if (!Array.isArray(oldData)) return oldData;
        return oldData.map((p) => {
          if (p.id !== id && p.Id !== id) return p;
          return {
            ...p,
            ...data,
            descripcion: data?.descripcion ?? data?.Descripcion ?? null,
            fichaTecnica: data?.fichaTecnica ?? data?.FichaTecnica ?? null,
          };
        });
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.all,
        refetchType: 'all',
      });
      queryClient.invalidateQueries({ queryKey: ['public-products'] });
      queryClient.invalidateQueries({ queryKey: ['public-product'] });
      queryClient.invalidateQueries({ queryKey: ['public-featured-products'] });
      
      success('Producto actualizado exitosamente');
    },

    onError: (err) => {
      console.error('Error al actualizar producto:', err);
      const errorMessage = err.message || 'Error al actualizar el producto';
      showError(errorMessage);
    },
  });
}

/**
 * Hook para toggle de estado activo con optimistic update
 * Proporciona UX fluida y rollback en caso de error
 */
export function useToggleProductActive() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: async ({ productId, newActiveState }) => {
      return productService.updateProductStatus(productId, newActiveState);
    },

    onMutate: async ({ productId, newActiveState }) => {
      // Cancelar refetches en progreso
      await queryClient.cancelQueries({ queryKey: productKeys.all });

      // Snapshot del estado anterior
      const previousQueries = queryClient.getQueriesData({ queryKey: productKeys.lists() });
      const previousDetail = queryClient.getQueryData(productKeys.detail(productId));

      // Optimistic update de listas
      queryClient.setQueriesData({ queryKey: productKeys.lists() }, (oldData) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.map((product) =>
            product.id === productId
              ? { ...product, isActive: newActiveState }
              : product
          );
        }
        // Para data paginada
        if (oldData.items) {
          return {
            ...oldData,
            items: oldData.items.map((product) =>
              product.id === productId
                ? { ...product, isActive: newActiveState }
                : product
            ),
          };
        }
        return oldData;
      });

      // Optimistic update de detalle
      if (previousDetail) {
        queryClient.setQueryData(productKeys.detail(productId), {
          ...previousDetail,
          isActive: newActiveState,
        });
      }

      return { previousQueries, previousDetail };
    },

    onError: (err, variables, context) => {
      // Rollback
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          productKeys.detail(variables.productId), 
          context.previousDetail
        );
      }

      showError(err.message || 'Error al actualizar el estado del producto');
    },

    onSuccess: (data, { newActiveState }) => {
      const mensaje = newActiveState
        ? 'Producto activado correctamente'
        : 'Producto desactivado correctamente';
      success(mensaje);
    },

    onSettled: (data, error, variables) => {
      // Invalidar para sincronizar con backend
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: productKeys.detail(variables.productId),
        refetchType: 'all',
      });
    },
  });
}

/**
 * Hook para toggle de producto destacado con optimistic update
 */
export function useToggleProductFeatured() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: async ({ productId, newFeaturedState }) => {
      return productService.updateProductFeatured(productId, newFeaturedState);
    },

    onMutate: async ({ productId, newFeaturedState }) => {
      await queryClient.cancelQueries({ queryKey: productKeys.all });

      const previousQueries = queryClient.getQueriesData({ queryKey: productKeys.lists() });
      const previousFeatured = queryClient.getQueriesData({ queryKey: productKeys.featured() });

      const optimisticUpdate = (oldData) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.map((product) =>
            product.id === productId
              ? { ...product, isFeatured: newFeaturedState }
              : product
          );
        }
        if (oldData.items) {
          return {
            ...oldData,
            items: oldData.items.map((product) =>
              product.id === productId
                ? { ...product, isFeatured: newFeaturedState }
                : product
            ),
          };
        }
        return oldData;
      };

      queryClient.setQueriesData({ queryKey: productKeys.lists() }, optimisticUpdate);
      queryClient.setQueriesData({ queryKey: productKeys.featured() }, optimisticUpdate);

      return { previousQueries, previousFeatured };
    },

    onError: (err, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousFeatured) {
        context.previousFeatured.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      showError(err.message || 'Error al actualizar el destacado del producto');
    },

    onSuccess: (data, { newFeaturedState }) => {
      const mensaje = newFeaturedState
        ? 'Producto destacado correctamente'
        : 'Producto removido de destacados';
      success(mensaje);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.featured() });
    },
  });
}

/**
 * Hook para eliminar producto
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: (productId) => productService.deleteProduct(productId),

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: productKeys.all });

      const previousQueries = queryClient.getQueriesData({ queryKey: productKeys.lists() });

      queryClient.setQueriesData({ queryKey: productKeys.lists() }, (oldData) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.filter((product) => product.id !== productId);
        }
        if (oldData.items) {
          return {
            ...oldData,
            items: oldData.items.filter((product) => product.id !== productId),
          };
        }
        return oldData;
      });

      // Remover del caché de detalle
      queryClient.removeQueries({ queryKey: productKeys.detail(productId) });

      return { previousQueries };
    },

    onError: (err, productId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showError(err.message || 'Error al eliminar el producto');
    },

    onSuccess: () => {
      success('Producto eliminado exitosamente');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

/**
 * Hook para eliminar TODOS los productos
 */
export function useDeleteAllProducts() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: () => productService.deleteAllProducts(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: productKeys.all });
      const previousQueries = queryClient.getQueriesData({ queryKey: productKeys.lists() });
      
      queryClient.setQueriesData({ queryKey: productKeys.lists() }, []);
      
      return { previousQueries };
    },

    onError: (err, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showError(err.message || 'Error al eliminar todos los productos');
    },

    onSuccess: () => {
      success('Todos los productos han sido eliminados');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

/**
 * Hook para crear producto
 * Con actualización optimista de la lista
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: (productData) => productService.createProduct(productData),

    onSuccess: (data) => {
      // Agregar a la caché de detalle
      queryClient.setQueryData(productKeys.detail(data.id), data);
      
      // Función auxiliar para agregar producto a una lista
      const addProductToList = (oldData) => {
        if (!oldData) return oldData;
        
        // Si es array simple
        if (Array.isArray(oldData)) {
          return [data, ...oldData];
        }
        
        // Si es data paginada
        if (oldData.items) {
          return {
            ...oldData,
            items: [data, ...oldData.items],
            totalItems: (oldData.totalItems || 0) + 1,
          };
        }
        
        return oldData;
      };
      
      // Agregar el nuevo producto a TODAS las listas en caché (admin)
      queryClient.setQueriesData({ queryKey: productKeys.lists() }, addProductToList);
      
      // Agregar también a las listas de productos disponibles (públicos) si está activo
      if (data.isActive !== false) {
        queryClient.setQueriesData({ queryKey: productKeys.available() }, addProductToList);
      }
      
      // Invalidar todas las queries de productos para sincronizar
      queryClient.invalidateQueries({ 
        queryKey: productKeys.all,
        refetchType: 'all',
      });
      
      // También invalidar queries públicas
      queryClient.invalidateQueries({ queryKey: ['public-products'] });
      queryClient.invalidateQueries({ queryKey: ['public-featured-products'] });
      
      success('Producto creado exitosamente');
    },

    onError: (err) => {
      showError(err.message || 'Error al crear el producto');
    },
    
    onSettled: () => {
      // Asegurar que se invalide todo al finalizar (éxito o error)
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.available() });
    },
  });
}
