import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nombreMarcaService } from '../services/productService';
import { useNotification } from '../context/NotificationContext';

// Query key factory
export const brandKeys = {
  all: ['brands'],
  lists: () => [...brandKeys.all, 'list'],
  list: (filters) => [...brandKeys.lists(), filters],
  detail: (id) => [...brandKeys.all, 'detail', id],
};

/**
 * Hook para obtener todas las marcas
 */
export function useBrands() {
  return useQuery({
    queryKey: brandKeys.list({}),
    queryFn: () => nombreMarcaService.getAllNombreMarcas(),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obtener una marca por ID
 */
export function useBrand(id) {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => nombreMarcaService.getNombreMarcaById(id),
    enabled: !!id,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para crear marca
 */
export function useCreateBrand() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: (brandData) => nombreMarcaService.createNombreMarca(brandData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      success('Marca creada exitosamente');
    },

    onError: (err) => {
      console.error('Error al crear marca:', err);
      let errorMessage = 'Error al crear la marca';
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
 * Hook para actualizar marca
 */
export function useUpdateBrand() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: ({ id, brandData }) => nombreMarcaService.updateNombreMarca(id, brandData),

    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(id) });
      success('Marca actualizada exitosamente');
    },

    onError: (err) => {
      console.error('Error al actualizar marca:', err);
      let errorMessage = 'Error al actualizar la marca';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      showError(errorMessage);
    },
  });
}

/**
 * Hook para eliminar marca
 */
export function useDeleteBrand() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: (brandId) => nombreMarcaService.deleteNombreMarca(brandId),

    onMutate: async (brandId) => {
      await queryClient.cancelQueries({ queryKey: brandKeys.all });
      const previousData = queryClient.getQueryData(brandKeys.list({}));
      
      queryClient.setQueryData(brandKeys.list({}), (old) => {
        if (!old) return old;
        return old.filter((brand) => brand.id !== brandId);
      });

      return { previousData };
    },

    onError: (err, brandId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(brandKeys.list({}), context.previousData);
      }
      console.error('Error al eliminar marca:', err);
      showError('Error al eliminar la marca. Puede tener productos asociados.');
    },

    onSuccess: () => {
      success('Marca eliminada exitosamente');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
}
