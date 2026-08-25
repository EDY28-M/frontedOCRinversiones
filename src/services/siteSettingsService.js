import axiosInstance from '../api/axiosConfig';

export const siteSettingsService = {
  get: async () => {
    const response = await axiosInstance.get('/site-settings');
    return response.data;
  },

  updateLogoUrl: async (logoUrl) => {
    const response = await axiosInstance.put('/site-settings/logo', { logoUrl });
    return response.data;
  },

  uploadLogo: async (file) => {
    const body = new FormData();
    body.append('file', file);
    const response = await axiosInstance.post('/site-settings/logo', body);
    return response.data;
  },

  getCategoryMedia: async () => {
    const response = await axiosInstance.get('/site-settings/categories');
    return response.data;
  },

  updateCategoryMedia: async (id, payload) => {
    const response = await axiosInstance.put(`/site-settings/categories/${id}`, payload);
    return response.data;
  },

  uploadCategoryImage: async (id, file) => {
    const body = new FormData();
    body.append('file', file);
    const response = await axiosInstance.post(`/site-settings/categories/${id}/image`, body);
    return response.data;
  },

  uploadCategoryOverlay: async (id, file) => {
    const body = new FormData();
    body.append('file', file);
    const response = await axiosInstance.post(`/site-settings/categories/${id}/overlay`, body);
    return response.data;
  },
};
