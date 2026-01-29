import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useNotification } from '../context/NotificationContext';
import { useCallback } from 'react';

// Query key factory para productos
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters],
  detail: (id) => [...productKeys.all, 'detail', id],
  available: () => [...productKeys.all, 'available'],
  availableList: (filters) => [...productKeys.available(), filters],
};

/**
 * Hook para obtener productos disponibles (con imágenes) con paginación del backend
 * Usado en ProductosDestacados
 * BÚSQUEDA INSTANTÁNEA: Sin debounce, sin staleTime - busca en nombre, categoría y marca
 */
export function useAvailableProducts({ page = 1, pageSize = 12, q = '', categoryId = null } = {}) {
  return useQuery({
    queryKey: productKeys.availableList({ page, pageSize, q, categoryId }),
    queryFn: () => productService.getAvailableProducts({ page, pageSize, q, categoryId }),
    staleTime: 0, // ✅ Sin caché - búsqueda instantánea
    gcTime: 0, // ✅ No guardar en memoria - siempre datos frescos
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Mantener data anterior durante transición
  });
}

/**
 * Hook para obtener productos con React Query
 * Soporta filtros, paginación y búsqueda
 */
export function useProducts(filters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getAllProducts(),
    staleTime: 30000, // 30 segundos antes de considerar stale
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obtener un producto por ID
 */
export function useProduct(id) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 60000, // 1 minuto - evitar refetch innecesario
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
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => productService.getProductById(id),
      staleTime: 60000,
    });
  }, [queryClient]);
  
  return prefetchProduct;
}

/**
 * Hook para actualizar producto completo (desde formulario de edición)
 * Invalida cache y navega sin pantalla blanca
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: async ({ id, productData }) => {
      return productService.updateProduct(id, productData);
    },

    onSuccess: (data, { id }) => {
      // Invalidar queries para que al volver a la lista tenga datos frescos
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      success('Producto actualizado exitosamente');
    },

    onError: (err) => {
      console.error('Error al actualizar producto:', err);
      let errorMessage = 'Error al actualizar el producto';
      if (err.response?.data) {
        if (err.response.data.errors) {
          const errors = Object.values(err.response.data.errors).flat();
          errorMessage = `Errores de validación: ${errors.join(', ')}`;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      }
      showError(errorMessage);
    },
  });
}

/**
 * Hook para toggle de estado activo con optimistic update
 * Evita pantalla blanca y proporciona UX fluida
 */
export function useToggleProductActive() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: async ({ productId, product, newActiveState }) => {
      // Llamada al backend
      return productService.updateProduct(productId, {
        ...product,
        isActive: newActiveState,
      });
    },

    // Optimistic update: cambiar UI inmediatamente
    onMutate: async ({ productId, newActiveState }) => {
      // Cancelar cualquier refetch en progreso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: productKeys.all });

      // Snapshot del estado anterior para rollback
      const previousQueries = queryClient.getQueriesData({ queryKey: productKeys.lists() });

      // Actualizar optimisticamente TODAS las queries de productos
      queryClient.setQueriesData({ queryKey: productKeys.lists() }, (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((product) =>
          product.id === productId
            ? { ...product, isActive: newActiveState }
            : product
        );
      });

      // Retornar contexto para rollback
      return { previousQueries };
    },

    // Rollback en caso de error
    onError: (err, variables, context) => {
      console.error('Error al actualizar estado del producto:', err);
      
      // Restaurar estado anterior
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      showError('Error al actualizar el estado del producto. Se ha revertido el cambio.');
    },

    // Éxito: mostrar notificación
    onSuccess: (data, { newActiveState }) => {
      const mensaje = newActiveState 
        ? 'Producto activado correctamente' 
        : 'Producto desactivado correctamente';
      success(mensaje);
    },

    // Siempre refetch silencioso al terminar para sincronizar con backend
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.available() });
      // También invalidar queries públicas para actualizar /productos
      queryClient.invalidateQueries({ queryKey: ['public-products'] });
      queryClient.invalidateQueries({ queryKey: ['public-categories'] });
      queryClient.invalidateQueries({ queryKey: ['public-brands'] });
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
        return oldData.filter((product) => product.id !== productId);
      });

      return { previousQueries };
    },

    onError: (err, productId, context) => {
      console.error('Error al eliminar producto:', err);
      
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      showError('Error al eliminar el producto');
    },

    onSuccess: () => {
      success('Producto eliminado exitosamente');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
