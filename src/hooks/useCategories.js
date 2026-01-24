import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/productService';
import { useNotification } from '../context/NotificationContext';

// Query key factory
export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (filters) => [...categoryKeys.lists(), filters],
  detail: (id) => [...categoryKeys.all, 'detail', id],
};

/**
 * Hook para obtener todas las categorías
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list({}),
    queryFn: () => categoryService.getAllCategories(),
    staleTime: 60000, // 1 minuto
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obtener una categoría por ID
 */
export function useCategory(id) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para crear categoría
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: (categoryData) => categoryService.createCategory(categoryData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      success('Categoría creada exitosamente');
    },

    onError: (err) => {
      console.error('Error al crear categoría:', err);
      let errorMessage = 'Error al crear la categoría';
      if (err.response?.data) {
        if (err.response.data.errors) {
          const errors = Object.values(err.response.data.errors).flat();
          errorMessage = errors.join(', ');
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      showError(errorMessage);
    },
  });
}

/**
 * Hook para actualizar categoría
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: ({ id, categoryData }) => categoryService.updateCategory(id, categoryData),

    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      success('Categoría actualizada exitosamente');
    },

    onError: (err) => {
      console.error('Error al actualizar categoría:', err);
      let errorMessage = 'Error al actualizar la categoría';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      showError(errorMessage);
    },
  });
}

/**
 * Hook para eliminar categoría
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: (categoryId) => categoryService.deleteCategory(categoryId),

    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.all });
      const previousData = queryClient.getQueryData(categoryKeys.list({}));
      
      queryClient.setQueryData(categoryKeys.list({}), (old) => {
        if (!old) return old;
        return old.filter((cat) => cat.id !== categoryId);
      });

      return { previousData };
    },

    onError: (err, categoryId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(categoryKeys.list({}), context.previousData);
      }
      console.error('Error al eliminar categoría:', err);
      showError('Error al eliminar la categoría. Puede tener productos asociados.');
    },

    onSuccess: () => {
      success('Categoría eliminada exitosamente');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
