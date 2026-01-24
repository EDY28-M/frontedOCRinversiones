import axiosInstance from '../api/axiosConfig';

export const userService = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (id, passwordData) => {
    const response = await axiosInstance.put(`/users/${id}/password`, passwordData);
    return response.data;
  },
};
