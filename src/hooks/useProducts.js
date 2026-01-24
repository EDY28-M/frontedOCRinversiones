import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useNotification } from '../context/NotificationContext';

// Query key factory para productos
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters],
};

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
