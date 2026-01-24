import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useNotification } from '../context/NotificationContext';

// Query key factory
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), filters],
  detail: (id) => [...userKeys.all, 'detail', id],
};

/**
 * Hook para obtener todos los usuarios
 */
export function useUsers() {
  return useQuery({
    queryKey: userKeys.list({}),
    queryFn: () => userService.getAllUsers(),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obtener un usuario por ID
 */
export function useUser(id) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para crear usuario
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: (userData) => userService.createUser(userData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      success('Usuario creado exitosamente');
    },

    onError: (err) => {
      console.error('Error al crear usuario:', err);
      let errorMessage = 'Error al crear el usuario';
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
 * Hook para actualizar usuario
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: ({ id, userData }) => userService.updateUser(id, userData),

    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      success('Usuario actualizado exitosamente');
    },

    onError: (err) => {
      console.error('Error al actualizar usuario:', err);
      let errorMessage = 'Error al actualizar el usuario';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      showError(errorMessage);
    },
  });
}

/**
 * Hook para eliminar usuario
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();

  return useMutation({
    mutationFn: (userId) => userService.deleteUser(userId),

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: userKeys.all });
      const previousData = queryClient.getQueryData(userKeys.list({}));
      
      queryClient.setQueryData(userKeys.list({}), (old) => {
        if (!old) return old;
        return old.filter((user) => user.id !== userId);
      });

      return { previousData };
    },

    onError: (err, userId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(userKeys.list({}), context.previousData);
      }
      console.error('Error al eliminar usuario:', err);
      showError('Error al eliminar el usuario');
    },

    onSuccess: () => {
      success('Usuario eliminado exitosamente');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
